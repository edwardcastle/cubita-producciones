// components/atmosphere/Grain.tsx
// Fixed-position film-grain overlay.
// - Pure SVG turbulence noise — no external assets, no extra request.
// - The SVG is oversized (110%) and offset (-5%) so the stepped translate
//   animation never reveals edges through the wrapper's overflow-hidden.
// - Plain alpha at ~7% opacity so the texture shows on both light and dark.
// - Server component: zero client JS apart from CSS animation.
// - aria-hidden + pointer-events-none.
// - prefers-reduced-motion stops the animation (handled in globals.css).

const FILTER_ID = 'cubita-grain-filter';

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-[0.22]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="cubita-grain absolute"
        style={{ top: '-5%', left: '-5%', width: '110%', height: '110%' }}
      >
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
