'use client';

import { useRef, useEffect, useState, ReactNode, createContext, useContext } from 'react';
import { EASE } from '@/lib/motion';

interface StaggerContextValue {
  visible: boolean;
  staggerDelay: number;
}

const StaggerContext = createContext<StaggerContextValue>({
  visible: false,
  staggerDelay: 0.1,
});

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  /**
   * Render items in their final (visible) state on the server / first paint
   * instead of staggering them in. Use for above-the-fold LCP content — an
   * `opacity:0` element does NOT count toward Largest Contentful Paint, so gating
   * a `priority` image grid behind the JS reveal delays LCP.
   */
  eager?: boolean;
}

const easeCss = `cubic-bezier(${EASE.standard.join(',')})`;

export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
  once = true,
  amount = 0.1,
  eager = false,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  // `eager` paints items in their final state on the server / first frame, so
  // above-the-fold LCP content is never hidden. Reduced motion is handled in CSS
  // (.cubita-reveal on each item), overriding the inline styles without a flash.
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
    <StaggerContext.Provider value={{ visible, staggerDelay }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { visible, staggerDelay } = useContext(StaggerContext);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ref.current?.parentElement) {
      const siblings = Array.from(ref.current.parentElement.children);
      setIndex(siblings.indexOf(ref.current));
    }
  }, []);

  const delay = index * staggerDelay;

  return (
    <div
      ref={ref}
      className={`cubita-reveal${className ? ` ${className}` : ''}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(30px)',
        transition: `opacity 0.5s ${easeCss} ${delay}s, transform 0.5s ${easeCss} ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
