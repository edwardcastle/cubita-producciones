// components/atmosphere/Grain.tsx
// Fixed-position monochrome film-grain overlay.
// - Pure SVG turbulence noise — no external assets, no extra request.
// - Plain alpha blending at ~7% opacity so the texture is visible on both
//   light and dark sections without depending on a blend mode.
// - overflow-hidden on the wrapper prevents any SVG filter region from
//   bleeding out and triggering a horizontal scrollbar.
// - Server component: no client JS, no hydration cost.
// - aria-hidden + pointer-events-none so it never interferes with users or AT.
// - Static (no animation). Reduced-motion users see the same thing.

const FILTER_ID = 'cubita-grain-filter';

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-[0.07]"
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
