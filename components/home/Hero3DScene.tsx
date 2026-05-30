'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image as DreiImage, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { easing } from 'maath';
import * as THREE from 'three';

interface Photo {
  id: string;
  url: string;
  alt: string;
}

interface Hero3DSceneProps {
  photos: Photo[];
  reducedMotion: boolean;
}

// Radial / staggered-depth arrangement: one centerpiece, others orbit in soft focus.
function getPositions(count: number): Array<[number, number, number]> {
  const positions: Array<[number, number, number]> = [];
  // First photo: front-center, slightly forward
  positions.push([0, 0.1, 0.6]);
  // Remaining: arrange around in a soft fan, varying depth
  for (let i = 1; i < count; i++) {
    const angle = (i / Math.max(count - 1, 1)) * Math.PI - Math.PI / 2; // -π/2 .. π/2
    const radius = 2.2;
    const x = Math.sin(angle) * radius;
    const z = -Math.cos(angle) * radius - 0.4;
    const y = (i % 2 === 0 ? 0.15 : -0.15) + Math.sin(i) * 0.1;
    positions.push([x, y, z]);
  }
  return positions;
}

function getScales(count: number): number[] {
  const scales: number[] = [1.6]; // hero photo is biggest
  for (let i = 1; i < count; i++) {
    scales.push(0.9 - (i % 3) * 0.1);
  }
  return scales;
}

function FloatingPhotos({ photos, reducedMotion }: { photos: Photo[]; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const positions = getPositions(photos.length);
  const scales = getScales(photos.length);
  const { pointer } = useThree();

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    if (reducedMotion) {
      // Hold scene static, recentered.
      easing.dampE(groupRef.current.rotation, [0, 0, 0], 0.3, dt);
      easing.damp3(groupRef.current.position, [0, 0, 0], 0.3, dt);
      return;
    }
    // Cursor-driven drift: rotate the group slightly toward the pointer + parallax shift.
    const targetRotY = pointer.x * 0.18;
    const targetRotX = -pointer.y * 0.1;
    easing.dampE(
      groupRef.current.rotation,
      [targetRotX, targetRotY, 0],
      0.4,
      dt
    );
    easing.damp3(
      groupRef.current.position,
      [pointer.x * 0.15, pointer.y * 0.08, 0],
      0.4,
      dt
    );
  });

  return (
    <group ref={groupRef}>
      {photos.map((photo, i) => (
        <FloatingPhoto
          key={photo.id}
          url={photo.url}
          position={positions[i]}
          scale={scales[i]}
          index={i}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  );
}

function FloatingPhoto({
  url,
  position,
  scale,
  index,
  reducedMotion,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
  index: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!meshRef.current) return;
    if (reducedMotion) return;
    // Slow per-photo bob and yaw for "alive" feel.
    const t = state.clock.elapsedTime;
    const bob = Math.sin(t * 0.6 + index) * 0.04;
    const yaw = Math.sin(t * 0.3 + index * 1.7) * 0.06;
    easing.damp3(
      meshRef.current.position,
      [position[0], position[1] + bob, position[2]],
      0.6,
      dt
    );
    easing.damp(meshRef.current.rotation, 'y', yaw, 0.6, dt);
  });

  return (
    <group ref={meshRef} position={position}>
      <DreiImage
        url={url}
        scale={[scale * 1.5, scale * 2]}
        transparent
        radius={0.05}
      />
    </group>
  );
}

export default function Hero3DScene({ photos, reducedMotion }: Hero3DSceneProps) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 5, 5]}
        intensity={0.9}
        color="#ffb380"
        castShadow
      />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={0.25}
        color="#3b2a4a"
      />
      <Environment preset="sunset" />

      <FloatingPhotos photos={photos} reducedMotion={reducedMotion} />

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.45}
        scale={10}
        blur={3.5}
        far={3}
        resolution={512}
      />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          intensity={0.6}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.2}
        />
        <Vignette eskil={false} offset={0.35} darkness={0.55} />
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.18}
        />
      </EffectComposer>
    </>
  );
}
