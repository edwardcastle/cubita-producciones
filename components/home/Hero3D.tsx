'use client';

import { ReactNode, useEffect, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// The WebGL hero (three.js + @react-three/fiber) is code-split into its own chunk and
// only loaded on desktop when it actually mounts — keeping it out of the initial bundle
// and off mobile entirely.
const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), { ssr: false });

interface Photo {
  id: string;
  url: string;
  alt: string;
  slug?: string;
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

/**
 * Mobile-only crossfade carousel — no WebGL, no R3F, no GPU cost.
 * Cycles through the photos every 4s with a 1s opacity fade.
 */
function MobileCarousel({ photos, reducedMotion }: { photos: Photo[]; reducedMotion: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Track which slides have been shown so we only download images on demand. All slides
  // sit stacked at inset-0, so without this every full-screen photo downloads at once
  // (opacity:0 does not stop the fetch) — wasteful on the mobile hero where LCP matters.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    if (reducedMotion || photos.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % photos.length;
        setLoaded((s) => (s.has(next) ? s : new Set(s).add(next)));
        return next;
      });
    }, 4000);
    return () => window.clearInterval(id);
  }, [photos.length, reducedMotion]);

  if (photos.length === 0) return null;

  return (
    <div className="md:hidden absolute inset-0">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          {loaded.has(i) && (
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Hero3D({ photos, children }: Hero3DProps) {
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white md:min-h-screen">
      <div className="absolute inset-0 w-full">
        {/* Mobile (< md): CSS-only crossfade carousel of artist photos.
            Hidden on md+ via the inner div's md:hidden class. */}
        <MobileCarousel photos={photos} reducedMotion={reducedMotion} />

        {!isMobile && photos.length > 0 && (
          <Hero3DCanvas photos={photos} reducedMotion={reducedMotion} />
        )}
        {/* Two-layer scrim:
            1) A soft full-frame darkening (low alpha) restores overall mood without
               dimming the active card too much.
            2) A left-side gradient on top adds extra darkness behind the hero text. */}
        <div
          className="pointer-events-none absolute inset-0 bg-black/60"
          aria-hidden="true"
        />
        {/* Strong left-side darkening so the hero text has real contrast against the
            warm 3D scene. Fades to transparent before the centre so the active card
            (sitting at x=0) is unaffected. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Top scrim — desktop only (transparent navbar legibility) */}
      <div
        className="hidden md:block pointer-events-none absolute inset-x-0 top-0 h-32 md:h-40 bg-gradient-to-b from-black/70 to-transparent"
        aria-hidden="true"
      />

      {/* Hero text — real DOM, accessible. */}
      <div className="pointer-events-none relative z-10 w-full flex-1 flex items-center py-10 px-4 sm:px-6 lg:px-8 md:py-16">
        {children}
      </div>
    </section>
  );
}
