'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const initialTransforms: Record<Direction, string> = {
  up: 'translateY(40px)',
  down: 'translateY(-40px)',
  left: 'translateX(40px)',
  right: 'translateX(-40px)',
  none: 'none',
};

export default function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
  amount = 0.2,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
  }, [once, amount]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : initialTransforms[direction],
        transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
