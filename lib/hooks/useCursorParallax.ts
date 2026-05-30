// lib/hooks/useCursorParallax.ts
'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { SPRING } from '@/lib/motion';

interface Options {
  /** Maximum offset in pixels at the screen edge. */
  intensity?: number;
  /** Invert direction (the element moves opposite the cursor). */
  invert?: boolean;
  /** When true, disables the pointer listener entirely. Pass the caller's
   *  already-stable reduced-motion boolean here to keep a single source of truth. */
  disabled?: boolean;
}

/**
 * Returns spring-damped {x, y} motion values that track the cursor.
 *
 * Disabled when:
 *  - `disabled` prop is true (typically: caller's reduced-motion boolean), or
 *  - the device is touch-only (no fine pointer).
 *
 * No internal reduced-motion subscription — the caller owns it, which avoids the
 * `useReducedMotion() → null` first-render window where the listener would briefly
 * register for users who actually opted out.
 */
export function useCursorParallax({ intensity = 8, invert = false, disabled = false }: Options = {}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.soft);
  const sy = useSpring(y, SPRING.soft);

  useEffect(() => {
    if (disabled) return;
    // One-time check at mount; does not respond to input device changes mid-session.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handler = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;   // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;  // -1..1
      const sign = invert ? -1 : 1;
      x.set(nx * intensity * sign);
      y.set(ny * intensity * sign);
    };

    window.addEventListener('pointermove', handler, { passive: true });
    return () => window.removeEventListener('pointermove', handler);
  }, [x, y, intensity, invert, disabled]);

  return { x: sx, y: sy };
}
