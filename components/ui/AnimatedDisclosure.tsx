// components/ui/AnimatedDisclosure.tsx
'use client';

import { useState, useId, ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';

interface AnimatedDisclosureProps {
  title: ReactNode;
  body: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Accessible animated accordion item.
 * - Native keyboard semantics (button toggles on Enter / Space, focus ring via global :focus-visible).
 * - aria-expanded on the trigger, role="region" + aria-labelledby on the panel.
 *   (Intentionally no aria-controls: the panel is conditionally rendered, so an
 *   aria-controls id would dangle while closed.)
 * - Replaces the native <details> height jump with a Framer Motion height animation.
 * - Reduced-motion: transition duration is 0 — instant toggle, no perceptible animation.
 */
export default function AnimatedDisclosure({ title, body, defaultOpen = false }: AnimatedDisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <div
      className={`rounded-lg border border-gray-200 overflow-hidden transition-colors ${
        open ? 'bg-white shadow-sm' : 'bg-gray-50'
      }`}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-4 md:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <span className="text-base md:text-lg font-semibold text-gray-900">{title}</span>
        <span
          aria-hidden="true"
          className={`text-amber-600 text-xl leading-none transition-transform ${open ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : DURATION.base, ease: EASE.smooth }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 md:px-6 pb-4 md:pb-6 text-sm md:text-base text-gray-700 leading-relaxed">
              {body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
