# Atelier Bella

A painterly single-page atelier for a working painter — a full-screen WebGL hero that
marbles like poured paint, five switchable colour worlds, and a gallery of originals.

**Live: [atelierbella.art](https://atelierbella.art)**

Built with Vite 8 (Rolldown), React 19, TypeScript, Tailwind CSS v4, and
`@react-three/fiber`. Deployed to GitHub Pages from `main` on every push.

| Lighthouse (mobile, median of 3) |       |
| -------------------------------- | ----- |
| Performance                      | 83    |
| Accessibility                    | 100   |
| Largest contentful paint         | 3.1 s |
| Cumulative layout shift          | 0     |

## Getting started

```bash
npm ci
npm run dev        # http://localhost:5173
```

| Command                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                                  |
| `npm run build`        | Typecheck (`tsc -b`) and build for production into `dist/` |
| `npm run preview`      | Serve the production build locally                         |
| `npm run lint`         | Run ESLint                                                 |
| `npm run format:check` | Check Prettier formatting                                  |

## How it works

`src/main.tsx` renders a two-state landing: the hero (`src/SwirlHero.tsx`) until the
visitor clicks _Zur Ausstellung_, then the gallery (`src/Gallery.tsx`).

The hero background is `src/components/swirl/swirl-blend.tsx` — a full-screen quad whose
fragment shader evaluates value-noise fBm through two domain-warp passes. Each pass
offsets the sample point by an fBm evaluated at that same point, so the field folds into
itself rather than merely scrolling; that fold is what reads as swirling paint. Colour
comes from a cosine palette, `base + amp * cos(2pi * (phase + f))`, so an entire colour
world is three numbers per channel. The five presets live in `PALETTES` in
`SwirlHero.tsx`.

Two things to know before touching the hero:

- The vertex shader writes clip-space coordinates directly and ignores the camera
  matrices, so `planeGeometry` **must** be `[2, 2]` to span -1..1.
- Do not pass a `style` prop to `<Canvas>` expecting it to reach the canvas element.
  React Three Fiber puts it on the outer wrapper `div`; the canvas itself is sized by
  `gl.setSize` once the container measures non-zero.

`prefers-reduced-motion` freezes the field (`speed={0}`) and disables cursor interaction.
The hero canvas is `aria-hidden`, and every palette control is a real button carrying
`aria-pressed`.

## Build

`vite.config.ts` splits vendor code so the React runtime and `three` cache independently
of app code. Vite 8 bundles with Rolldown, which dropped Rollup's object form of
`manualChunks`; the current API is `output.codeSplitting.groups`, which captures vendor
modules by id via a `test` pattern. `three` is ~881 kB raw / ~234 kB gzipped and loads
eagerly, because the hero is the landing view.

## Artwork

Artwork lives in `public/artwork` and is referenced directly from the SPA for the hero,
gallery, card, and manifest surfaces.

## License

Site code (c) Alexander Nachtmann. The hero shader is original work.

This project contains **no React Bits Pro source**. The former
`src/components/react-bits/swirl-blend.tsx` was replaced, because the React Bits Pro
licence forbids making that source available to third parties "including as part of open
source repositories, starter kits, or boilerplates", "even if it has been modified"
([§1.3](https://pro.reactbits.dev/license)). That restriction applies at every tier.
