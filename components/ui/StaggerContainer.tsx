'use client';

import { useRef, useEffect, useState, ReactNode, createContext, useContext } from 'react';

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
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
  once = true,
  amount = 0.1,
}: StaggerContainerProps) {
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
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(30px)',
        transition: `opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
