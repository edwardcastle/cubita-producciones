'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import CanvasErrorBoundary from './CanvasErrorBoundary';

const Hero3DScene = dynamic(() => import('./Hero3DScene'), { ssr: false });

interface Photo {
  id: string;
  url: string;
  alt: string;
  slug?: string;
}

/**
 * Desktop WebGL hero. Isolated in its own module and loaded via next/dynamic(ssr:false)
 * from Hero3D, so three.js + @react-three/fiber are code-split out of the homepage's
 * initial bundle and never shipped to mobile (where the CSS carousel is used instead).
 */
export default function Hero3DCanvas({ photos, reducedMotion }: { photos: Photo[]; reducedMotion: boolean }) {
  return (
    <CanvasErrorBoundary
      fallback={
        /* If the WebGL scene fails to load (asset/loader error), show the first
           artist photo full-bleed instead of crashing the hero. */
        <div className="absolute inset-0">
          <Image
            src={photos[0].url}
            alt={photos[0].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      }
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <Hero3DScene photos={photos} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
