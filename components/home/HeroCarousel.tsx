'use client';

import { useState, useEffect, useCallback, useSyncExternalStore, ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StrapiImage } from '@/lib/strapi';

interface HeroCarouselLabels {
  /** aria-label for the previous-slide button */
  prev: string;
  /** aria-label for the next-slide button */
  next: string;
  /** aria-label prefix for dot indicators, e.g. "Go to slide" → "Go to slide 1" */
  slide: string;
}

interface HeroCarouselProps {
  /** Background images managed in Strapi; empty array renders the static fallback */
  images: StrapiImage[];
  /** Hero content (eyebrow, title, subtitle, CTA) rendered on top of the images */
  children: ReactNode;
  /** Localized accessibility labels for the controls */
  labels: HeroCarouselLabels;
  /** Autoplay interval in milliseconds */
  interval?: number;
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION_QUERY);
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

const SECTION_CLASS =
  'relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-12 md:py-24 px-4 overflow-hidden';

export default function HeroCarousel({
  images,
  children,
  labels,
  interval = 5000,
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const count = images.length;
  const hasImages = count > 0;
  const hasControls = count > 1;

  const goTo = useCallback((next: number) => {
    setIndex((current) => {
      void current;
      return next;
    });
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % count),
    [count]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  );

  useEffect(() => {
    if (!hasControls || paused || reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => clearInterval(id);
  }, [hasControls, paused, reducedMotion, count, interval]);

  return (
    <section
      className={SECTION_CLASS}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {hasImages && (
        <div className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={images[index].url}
                alt={images[index].alternativeText || ''}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        </div>
      )}

      <div className="relative z-10">{children}</div>

      {hasControls && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={labels.prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={labels.next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 grid place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((image, i) => (
              <button
                key={image.url}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`${labels.slide} ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-amber-500' : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
