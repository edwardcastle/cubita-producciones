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
  /** Hero text (eyebrow, title, subtitle, CTA) rendered on top of the images */
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

// On mobile the hero stacks: 16:9 image band on top, text below, with a tall
// min-height so the section feels generous. At md+ the image becomes the
// full-bleed background and the text overlays it.
const SECTION_CLASS =
  'relative flex flex-col overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white min-h-[70dvh] md:min-h-screen';

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
        <div className="absolute inset-0 w-full">
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
          {/* Dark overlay — keeps the hero text legible over bright images.
              Slightly stronger band in the vertical middle where the text sits. */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/20" aria-hidden="true" />

          {hasControls && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={labels.prev}
                className="hidden md:grid absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={labels.next}
                className="hidden md:grid absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 place-items-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
        </div>
      )}

      {/* Top scrim — desktop only (transparent navbar legibility over the image) */}
      <div
        className="hidden md:block pointer-events-none absolute inset-x-0 top-0 h-32 md:h-40 bg-gradient-to-b from-black/70 to-transparent"
        aria-hidden="true"
      />

      {/* Hero text — flows below the image on mobile, overlays it on desktop.
          flex-1 lets it fill the remaining height so its content stays
          vertically centered in the taller mobile hero. */}
      <div className="relative z-10 w-full flex-1 flex items-center py-10 px-4 md:py-16">
        {children}
      </div>
    </section>
  );
}
