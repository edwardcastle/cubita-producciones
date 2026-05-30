// components/atmosphere/Grain.tsx
// Fixed-position monochrome film-grain overlay.
// - Pure SVG turbulence noise — no external assets, no extra request.
// - 3% opacity, decorative only.
// - Server component: no client JS, no hydration cost.
// - aria-hidden + pointer-events-none so it never interferes with users or AT.
// - Static (no animation). Reduced-motion users see the same thing.

const FILTER_ID = 'cubita-grain-filter';

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] mix-blend-overlay"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={FILTER_ID}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${FILTER_ID})`} />
      </svg>
    </div>
  );
}
