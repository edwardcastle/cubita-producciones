// components/home/StatCounter.tsx
'use client';

import { useRef } from 'react';
import { motion, useMotionTemplate } from 'framer-motion';
import { useCountUp, useRoundedDisplay } from '@/lib/hooks/useCountUp';

interface StatCounterProps {
  /** Final value to count up to (e.g. 30). */
  value: number;
  /** Optional suffix rendered after the number (default "+"). */
  suffix?: string;
  /** Optional className applied to the wrapping span. */
  className?: string;
}

/**
 * Animates a number from 0 → value once when scrolled into view.
 * Renders the final value statically until then (SSR / tests / reduced-motion all see the target).
 */
export default function StatCounter({ value, suffix = '+', className = '' }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useCountUp(value, ref);
  const rounded = useRoundedDisplay(motionValue);
  const display = useMotionTemplate`${rounded}${suffix}`;

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </span>
  );
}
