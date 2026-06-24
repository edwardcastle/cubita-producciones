// components/home/Hero3DScene.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image as DreiImage, ContactShadows, Billboard, Sparkles, SpotLight, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { easing } from 'maath';
import * as THREE from 'three';
import { useRouter } from '@/i18n/routing';

interface Photo {
  id: string;
  url: string;
  alt: string;
  name: string;
  slug?: string;
}

interface Hero3DSceneProps {
  photos: Photo[];
  reducedMotion: boolean;
}

const AUTOPLAY_MS = 4000;

/**
 * Returns the {x, y, z, scale, opacity} target for a card at a given offset
 * from the active index. Negative offsets are to the left, positive to the right.
 */
function targetForOffset(offset: number) {
  if (offset === 0) {
    // Active card: prominent but not overwhelming.
    return { x: 0, y: 0, z: 1.0, scale: 1.15, opacity: 1.0, rotY: 0 };
  }
  const sign = Math.sign(offset);
  const abs = Math.abs(offset);
  if (abs === 1) {
    // First neighbours: ghostly — barely visible silhouettes flanking the active card.
    return { x: sign * 1.9, y: 0, z: -0.5, scale: 0.62, opacity: 0.18, rotY: sign * -0.3 };
  }
  if (abs === 2) {
    return { x: sign * 3.0, y: 0, z: -1.3, scale: 0.42, opacity: 0.06, rotY: sign * -0.4 };
  }
  return { x: sign * 4.0, y: 0, z: -2.0, scale: 0.3, opacity: 0, rotY: sign * -0.5 };
}

function StackCard({
  photo,
  offset,
  isActive,
  onActivate,
  onNavigate,
  reducedMotion,
}: {
  photo: Photo;
  offset: number;
  isActive: boolean;
  onActivate: () => void;
  onNavigate: () => void;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const imageMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const t = targetForOffset(offset);
    const hoverBoost = hovered && isActive ? 1.12 : 1;
    easing.damp3(
      groupRef.current.position,
      [t.x, t.y, t.z],
      reducedMotion ? 0.001 : 0.35,
      dt,
    );
    easing.damp3(
      groupRef.current.scale,
      [t.scale * hoverBoost, t.scale * hoverBoost, t.scale * hoverBoost],
      reducedMotion ? 0.001 : 0.35,
      dt,
    );
    easing.damp(groupRef.current.rotation, 'y', t.rotY, reducedMotion ? 0.001 : 0.35, dt);

    // Mutate the DreiImage material's opacity directly each frame. Earlier we kept
    // the eased value in a ref and passed it as a prop to <DreiImage>, but a ref
    // change doesn't trigger a re-render — so the opacity prop was stale by exactly
    // one transition (the card that *just left* still looked active, the new active
    // looked dim until the next index change). Direct material mutation in useFrame
    // is the standard R3F pattern and avoids the lag entirely.
    const mat = imageMeshRef.current?.material as
      | (THREE.Material & { opacity: number })
      | undefined;
    if (mat) {
      mat.opacity += (t.opacity - mat.opacity) * Math.min(1, dt * 5);
    }
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    if (photo.slug) document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };
  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isActive) {
      if (photo.slug) onNavigate();
    } else {
      onActivate();
    }
  };

  // DreiImage shows the texture; we render a child plane underneath at the same size
  // that owns the pointer events so the click target is a stable rectangle even while
  // DreiImage is animating its own internal transforms.
  return (
    <group ref={groupRef}>
      <Billboard>
        {/* The visible photo. Opacity is driven each frame via the ref on the underlying
            mesh in the useFrame above (a prop here would be stale by one transition). */}
        <DreiImage
          ref={imageMeshRef}
          url={photo.url}
          scale={[1.5, 2]}
          transparent
          opacity={targetForOffset(offset).opacity}
          radius={0.08}
        />
        {/* Invisible hit target. Sits just behind the image so it always catches the click. */}
        <mesh
          position={[0, 0, -0.001]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <planeGeometry args={[1.5, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Billboard>
    </group>
  );
}

function ActiveNameLabel({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  // Cross-fade approach: when `text` changes, fade the visible text out, swap content, fade back in.
  // Plus a small upward slide on the fade-in so it has a "rises into place" feel.
  const meshRef = useRef<THREE.Group>(null);
  const targetOpacityRef = useRef(1);
  const [displayed, setDisplayed] = useState(text);
  const [opacity, setOpacity] = useState(1);
  const prevTextRef = useRef(text);

  // When the incoming text changes: fade out the current text, then swap to the new text and fade back in.
  useEffect(() => {
    if (text === prevTextRef.current) return;
    targetOpacityRef.current = 0;
    const fadeOut = window.setTimeout(() => {
      setDisplayed(text);
      prevTextRef.current = text;
      targetOpacityRef.current = 1;
    }, reducedMotion ? 0 : 180);
    return () => window.clearTimeout(fadeOut);
  }, [text, reducedMotion]);

  // Drive the actual opacity and y-position via useFrame so it runs in the R3F render loop.
  useFrame((_, dt) => {
    // Ease toward the target opacity (animation lives in state but is consumed by the Text component).
    setOpacity((cur) => {
      const next = cur + (targetOpacityRef.current - cur) * Math.min(1, dt * 8);
      return Math.abs(next - cur) < 0.001 ? targetOpacityRef.current : next;
    });
    if (meshRef.current) {
      // When opacity is rising (target = 1, current < target), the text slides up from -0.15 to 0.
      const targetY = targetOpacityRef.current === 1 ? 0 : -0.15;
      easing.damp(meshRef.current.position, 'y', targetY, reducedMotion ? 0.001 : 0.25, dt);
    }
  });

  return (
    <group ref={meshRef} position={[0, -1.55, 1.2]}>
      <Billboard>
        <Text
          font="/fonts/Poppins-SemiBold.ttf"
          fontSize={0.28}
          color="#fff7e8"
          anchorX="center"
          anchorY="middle"
          maxWidth={5}
          textAlign="center"
          fillOpacity={opacity}
          outlineWidth={0.008}
          outlineColor="#000000"
          outlineOpacity={opacity * 0.6}
        >
          {displayed}
        </Text>
      </Billboard>
    </group>
  );
}

function CardStack({ photos, reducedMotion }: { photos: Photo[]; reducedMotion: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Autoplay: advance the active index every AUTOPLAY_MS.
  // Disabled under reduced motion.
  useEffect(() => {
    if (reducedMotion || photos.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [photos.length, reducedMotion]);

  return (
    <>
      {photos.map((photo, i) => {
        // Compute the signed shortest offset from activeIndex on the circular index space.
        const raw = i - activeIndex;
        const half = Math.floor(photos.length / 2);
        let offset = raw;
        if (offset > half) offset -= photos.length;
        if (offset < -half) offset += photos.length;
        const isActive = i === activeIndex;
        return (
          <StackCard
            key={photo.id}
            photo={photo}
            offset={offset}
            isActive={isActive}
            onActivate={() => setActiveIndex(i)}
            onNavigate={() => {
              if (photo.slug) router.push(`/artistas/${photo.slug}`);
            }}
            reducedMotion={reducedMotion}
          />
        );
      })}
      <ActiveNameLabel text={photos[activeIndex]?.name ?? ''} reducedMotion={reducedMotion} />
    </>
  );
}

function ConcertSpotlights({ reducedMotion }: { reducedMotion: boolean }) {
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (leftRef.current) {
      // Slow sinusoidal sweep — yaw between -0.3 and +0.3 rad over ~8 seconds.
      leftRef.current.rotation.y = Math.sin(t * 0.4) * 0.3;
      leftRef.current.rotation.z = Math.cos(t * 0.35) * 0.15;
    }
    if (rightRef.current) {
      // Opposite phase so the two beams aren't moving in lockstep.
      rightRef.current.rotation.y = Math.sin(t * 0.4 + Math.PI) * 0.3;
      rightRef.current.rotation.z = Math.cos(t * 0.35 + Math.PI) * 0.15;
    }
  });

  return (
    <>
      <group ref={leftRef} position={[-3.5, 3.2, 1]} rotation={[Math.PI * 0.6, 0, 0]}>
        <SpotLight
          castShadow={false}
          distance={9}
          angle={0.32}
          attenuation={6}
          anglePower={4}
          color="#ffb380"
          intensity={1.3}
        />
      </group>
      <group ref={rightRef} position={[3.5, 3.2, 1]} rotation={[Math.PI * 0.6, 0, 0]}>
        <SpotLight
          castShadow={false}
          distance={9}
          angle={0.32}
          attenuation={6}
          anglePower={4}
          color="#ffd09a"
          intensity={1.2}
        />
      </group>
    </>
  );
}

/**
 * Repositions the camera based on the viewport aspect ratio so the card stack always
 * fits comfortably — narrower viewports (tablet portrait, wide-mobile-but-not-mobile)
 * get the camera pulled back so the side cards aren't cropped.
 */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    let z: number;
    if (aspect < 1.0) z = 7.5;        // very narrow (tablet portrait)
    else if (aspect < 1.4) z = 6.2;   // narrow desktop / tablet landscape
    else if (aspect < 1.9) z = 5.0;   // standard 16:9
    else z = 4.5;                     // ultrawide
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.position.z = z;
      camera.updateProjectionMatrix();
    }
  }, [size.width, size.height, camera]);
  return null;
}

export default function Hero3DScene({ photos, reducedMotion }: Hero3DSceneProps) {
  return (
    <>
      <ResponsiveCamera />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 5]} intensity={0.85} color="#ffb380" />
      <directionalLight position={[-5, -2, -3]} intensity={0.25} color="#3b2a4a" />
      {/* No <Environment> HDRI: it previously fetched venice_sunset_1k.hdr from a third-party
          CDN at runtime (raw.githack.com) and crashed the hero when unreachable. It was also
          inert here — image-based lighting only affects PBR materials (MeshStandard/Physical),
          and this scene has none (DreiImage uses its own shader; the hit plane is meshBasic).
          A/B-tested headed: removing it leaves the look identical. The warm mood is carried by
          the spotlights + Bloom + Vignette + ACES tone mapping below. If a reflective PBR
          surface is ever added, reintroduce a small COMPRESSED, self-hosted HDR (not a preset). */}

      <ConcertSpotlights reducedMotion={reducedMotion} />

      {/* Drifting amber motes — read as floating stage haze / firefly atmosphere. */}
      <Sparkles
        count={80}
        scale={[10, 5, 5]}
        size={1.6}
        speed={reducedMotion ? 0 : 0.3}
        color="#ffb070"
        opacity={0.35}
        noise={1}
      />

      <CardStack photos={photos} reducedMotion={reducedMotion} />

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.4}
        scale={10}
        blur={3.5}
        far={3}
        resolution={512}
      />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={0.55} luminanceThreshold={0.65} luminanceSmoothing={0.25} />
        {/* Aggressive vignette — corners crushed to near-black so the centre acts as a
            clear spotlight. */}
        <Vignette eskil={false} offset={0.08} darkness={0.95} />
      </EffectComposer>
    </>
  );
}
