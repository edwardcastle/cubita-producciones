# CLAUDE.md — Cubita Producciones

## What this project is
Booking-agency website for Cuban music artists, targeting the European market.
Primary visitors: **festival bookers, event organizers, promoters**. The site
exists to make artists look world-class and to convert a booker into an inquiry.
Visual impressiveness is in service of that goal — never at the cost of clarity,
load speed, or the booking CTA.

**This is an existing Next.js codebase.** Improve incrementally. Match existing
conventions (file structure, naming, styling approach) before introducing new
patterns. Do not rewrite working code to "modernize" it unless asked.

## Stack
- Next.js (App Router assumed — check before assuming)
- React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
- TypeScript, strict where the codebase already is

When adding 3D, reach for these before writing raw three.js:
- `@react-three/drei` — controls, loaders, `<Environment />`, contact shadows
- `@react-three/postprocessing` — bloom, vignette, grain
- `maath` — easing / lerp helpers (`easing.damp3`)
- Framer Motion or GSAP for scroll/DOM-driven animation (use what's already installed)

## Aesthetic direction
This is the one place the `frontend-design` skill should NOT pick a random
direction. Cubita is **Cuban music** — the identity is warm, vibrant, alive:
think tropical heat, vintage Havana, rhythm. Commit to that.
- Warm dominant palette (deep teal / terracotta / sun-faded gold), sharp accents.
  Avoid cold corporate blues and the default purple-gradient-on-white look.
- Distinctive display typography with character; refined readable body font.
- Texture and grain over flat solid fills — atmosphere, not sterile.
- Motion should feel rhythmic and musical, never mechanical/linear.

## React Three Fiber rules (the polish layer)
Bad-looking WebGL is almost always missing these. Apply them by default:
- **Color & tone:** `gl={{ toneMapping: THREE.ACESFilmicToneMapping }}`, sRGB output.
- **Lighting:** prefer `<Environment preset="..." />` (HDRI) over a lone ambient +
  point light. Add `<ContactShadows />` or soft shadows for grounding.
- **Post-processing:** subtle `<Bloom />` + `<Vignette />` + light film grain via
  `<EffectComposer>`. Subtle — bookers, not a demo reel.
- **Motion:** every interaction eased with `easing.damp3` / lerp. Never assign raw
  target values per frame. `OrbitControls` (if used) always `enableDamping`.
- **No jank:** animate in `useFrame`, never trigger React re-renders per frame for
  transform updates (mutate refs instead).

## Interactivity priorities (in order)
1. **Pointer-reactive hero** — subtle parallax / scene drift following the cursor.
2. **Scroll-driven reveals** — staggered entrance of artist cards/sections.
3. **Clickable artist elements** — hover lift + click to artist detail.
Keep the booking CTA reachable and obvious at all times — 3D never blocks it.

## Performance (non-negotiable — this is a marketing site)
- Target 60fps desktop; degrade gracefully on mobile.
- `<Canvas dpr={[1, 2]} />` — cap device pixel ratio.
- Lazy-load / dynamic-import the 3D scene (`next/dynamic`, `ssr: false`) so it
  never blocks first paint or hurts LCP.
- `prefers-reduced-motion`: disable heavy motion and autoplay drift.
- Mobile: drop post-processing and lower geometry; never ship a 60fps-killing
  hero to a phone.
- Compress GLTF (draco/meshopt), lazy-load textures.

## Accessibility & SEO (matters — bookers find this via search)
- All interactive 3D objects need a non-WebGL accessible equivalent (real links/buttons).
- Don't put booking-critical text inside the canvas; keep it as real DOM/HTML.
- Maintain heading structure and alt text for artist imagery.

## Content/confidentiality
This is the public Cubita site. It's unrelated to other work — keep it strictly
about the artists and the agency.

## How to work
- One concern per pass: structure → lighting/materials → motion → post-processing.
  Don't mix all four in a single edit.
- After a 3D change, use the Playwright skill to screenshot desktop + mobile and
  self-check (flat lighting? black canvas? CTA covered?). For WebGL, run **headed**
  mode if the headless screenshot comes back black.
- Critique specifically before re-editing: "lighting is flat, add HDRI + bloom"
  beats "make it nicer."

## Git Commit Conventions

Use this format:

```
[<type>] <short summary>

<body explaining what and why>

<footer: references, breaking changes>
```

Rules:
- Summary line in imperative mood ("Add feature", not "Added"/"Adds"), capitalized, no trailing period, max 50 chars
- Make summaries specific ("Fix null check in login handler", not "Fix bug")
- Body explains WHY, not how; wrap at ~72 chars; omit for trivial changes
- One logical/atomic change per commit
- Reference issues in the footer (e.g. "Closes #123")
- Mark breaking changes with "BREAKING CHANGE: <description>"
- Never use vague messages like "wip", "fixes", "updates"
- Do NOT add any Claude references, co-author lines, or "Generated with Claude Code" footers to commit messages

Allowed types: feat, fix, docs, refactor, test, chore

Examples:
- `[feat] add user authentication`
- `[fix] correct timezone offset in reports`
- `[docs] update API examples`
- `[refactor] extract validation logic`
- `[test] add cases for edge inputs`
- `[chore] bump dependencies`
