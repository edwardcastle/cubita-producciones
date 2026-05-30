// lib/hooks/useCountUp.ts
'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, useReducedMotion, type MotionValue } from 'framer-motion';

/**
 * Returns a MotionValue<number> that holds `target` initially, and animates from 0 → target
 * once the supplied ref enters the viewport. Idempotent — only animates once.
 *
 * @param target — final value
 * @param ref — element observed for viewport entry
 * @param duration — animation duration in seconds (default 1.4)
 *
 * - SSR / initial render: motion value is `target`, so the DOM contains the final number.
 * - Reduced-motion users: motion value stays at `target`, no animation.
 * - Tests (IntersectionObserver mocked / never firing): motion value stays at `target`,
 *   so existing text assertions like getByText('30+') still pass.
 * - On unmount mid-animation, the underlying animation is stopped to avoid orphan RAF work.
 */
export function useCountUp(
  target: number,
  ref: React.RefObject<HTMLElement | null>,
  duration = 1.4
): MotionValue<number> {
  const motionValue = useMotionValue(target);
  const prefersReduced = useReducedMotion();
  const playedRef = useRef(false);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return;
        playedRef.current = true;
        motionValue.set(0);
        controlsRef.current = animate(motionValue, target, {
          duration,
          ease: 'easeOut',
        });
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      controlsRef.current?.stop();
    };
    // `ref` and `motionValue` are stable refs / motion values, intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, prefersReduced]);

  return motionValue;
}

export function useRoundedDisplay(value: MotionValue<number>) {
  return useTransform(value, (v) => Math.round(v));
}
