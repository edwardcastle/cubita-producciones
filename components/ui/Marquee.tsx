// components/ui/Marquee.tsx
'use client';

import type { ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MarqueeProps {
  children: ReactNode;
  /** Duration of one full cycle in seconds. Higher = slower. Default 60. */
  durationSec?: number;
  /** Scroll direction. Default 'left'. */
  direction?: 'left' | 'right';
  /** Optional className applied to the outer wrapper. */
  className?: string;
}

/**
 * CSS-keyframes infinite horizontal scroller.
 * - Renders the children twice and translates by -50% / +50% over `durationSec`.
 * - Pauses (freezes at first frame) when prefers-reduced-motion is on.
 * - Decorative — caller should mark with aria-hidden if appropriate.
 *
 * Keyframes `cubita-marquee-left` / `cubita-marquee-right` live in app/globals.css.
 */
export default function Marquee({
  children,
  durationSec = 60,
  direction = 'left',
  className = '',
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const animationName = direction === 'left' ? 'cubita-marquee-left' : 'cubita-marquee-right';

  return (
    <div className={['overflow-hidden', className].filter(Boolean).join(' ')}>
      <div
        className="flex w-max"
        style={{
          willChange: reduced ? 'auto' : 'transform',
          animation: reduced ? 'none' : `${animationName} ${durationSec}s linear infinite`,
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
