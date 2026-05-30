'use client';

import { Suspense, ReactNode, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

const Hero3DScene = dynamic(() => import('./Hero3DScene'), { ssr: false });

interface Photo {
  id: string;
  url: string;
  alt: string;
}

interface Hero3DProps {
  photos: Photo[];
  children: ReactNode;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const MOBILE_QUERY = '(max-width: 767px)';

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export default function Hero3D({ photos, children }: Hero3DProps) {
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white md:min-h-screen">
      <div className="absolute inset-0 w-full">
        {!isMobile && photos.length > 0 && (
          <Canvas
            dpr={[1, 2]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              outputColorSpace: THREE.SRGBColorSpace,
              powerPreference: 'high-performance',
            }}
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            shadows
            className="absolute inset-0"
          >
            <Suspense fallback={null}>
              <Hero3DScene photos={photos} reducedMotion={reducedMotion} />
            </Suspense>
          </Canvas>
        )}
        {/* Subtle scrim for text legibility over the scene */}
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/20"
          aria-hidden="true"
        />
      </div>

      {/* Top scrim — desktop only (transparent navbar legibility) */}
      <div
        className="hidden md:block pointer-events-none absolute inset-x-0 top-0 h-32 md:h-40 bg-gradient-to-b from-black/70 to-transparent"
        aria-hidden="true"
      />

      {/* Hero text — real DOM, accessible. */}
      <div className="relative z-10 w-full flex-1 flex items-center py-10 px-4 sm:px-6 lg:px-8 md:py-16">
        {children}
      </div>
    </section>
  );
}
