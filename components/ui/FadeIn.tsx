'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { EASE } from '@/lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  /**
   * Render the final (visible) state on the server / first paint instead of
   * fading in. Use for above-the-fold LCP content — an `opacity:0` element does
   * NOT count toward Largest Contentful Paint, so gating a `priority` image or an
   * H1 behind the JS reveal delays LCP and wastes the preload.
   */
  eager?: boolean;
}

const initialTransforms: Record<Direction, string> = {
  up: 'translateY(40px)',
  down: 'translateY(-40px)',
  left: 'translateX(40px)',
  right: 'translateX(-40px)',
  none: 'none',
};

const easeCss = `cubic-bezier(${EASE.standard.join(',')})`;

export default function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
  amount = 0.2,
  eager = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  // `eager` paints the final state on the server / first frame, so above-the-fold
  // LCP content is never hidden. Reduced motion is handled in CSS (.cubita-reveal),
  // which overrides the inline styles below without a JS flash.
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: amount }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, amount, eager]);

  return (
    <div
      ref={ref}
      className={`cubita-reveal${className ? ` ${className}` : ''}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : initialTransforms[direction],
        transition: `opacity ${duration}s ${easeCss} ${delay}s, transform ${duration}s ${easeCss} ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
