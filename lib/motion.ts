// lib/motion.ts
// Centralised motion vocabulary for the homepage refresh.
// Spec: docs/superpowers/specs/2026-05-29-homepage-interactivity-design.md

export const SPRING = {
  soft:   { type: 'spring' as const, stiffness: 60,  damping: 18 },  // hero parallax, marquee drift
  reveal: { type: 'spring' as const, stiffness: 100, damping: 18 },  // headline / CTA reveals
  snappy: { type: 'spring' as const, stiffness: 220, damping: 22 },  // hover tilts, button hover
};

// Tuples typed as `const` so Framer Motion accepts them as cubic-bezier arrays.
export const EASE = {
  // Current curve used by FadeIn/StaggerContainer — kept so the refactor changes no visuals.
  standard: [0.25, 0.1, 0.25, 1] as const,
  smooth:    [0.4, 0, 0.2, 1] as const,       // accordion height, gradient sweeps
  cinematic: [0.25, 1, 0.5, 1] as const,      // Ken-Burns pan
};

export const DURATION = {
  micro:     0.25,
  base:      0.6,
  reveal:    0.9,
  cinematic: 7, // seconds — one full Ken-Burns cycle
};
