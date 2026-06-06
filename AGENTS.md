# Atelier Bella (`chromatic-atelier`)

A small single-page React storefront for the painter **Atelier Bella**: a
full-screen WebGL hero, then a clean gallery of original works with inquire/buy
links. Static SPA — no backend, no SSR. Live at **https://atelierbella.art/**.

> **Private repo — keep it private.**
> `src/components/react-bits/swirl-blend.tsx` is licensed React Bits Starter
> source; making this repository public would violate the React Bits license.

## Stack

- **Vite 7** + **React 19** + **TypeScript** (ESM)
- **Tailwind CSS v4** via `@tailwindcss/vite` — one stylesheet
  `src/styles/atelier.css` (no `tailwind.config`; CSS-first + design tokens)
- **three** + **@react-three/fiber** — only for the hero shader

## Commands

| Command                           | What it does                                            |
| --------------------------------- | ------------------------------------------------------- |
| `npm run dev`                     | Vite dev server                                         |
| `npm run build`                   | `tsc -b && vite build` — **typecheck is part of build** |
| `npm run preview`                 | Serve the production `dist/`                            |
| `npm run typecheck`               | `tsc -b --noEmit`                                       |
| `npm run lint` / `lint:fix`       | ESLint                                                  |
| `npm run format` / `format:check` | Prettier                                                |

A type error fails `build`, which fails the Pages deploy. Run `typecheck`
before pushing.

## Layout

```
index.html              # SPA entry
src/main.tsx            # Landing: toggles hero <-> gallery via local state
src/SwirlHero.tsx       # full-screen WebGL hero + FARBWELT palette switcher
src/Gallery.tsx         # editorial masonry gallery + contact section
src/data/site.ts        # EDITABLE CONTENT: brand, copy, contact email (base64)
src/data/artwork.ts     # EDITABLE WORKS: the artworks (forgiving schema)
src/components/react-bits/swirl-blend.tsx  # the hero shader (licensed)
src/lib/utils.ts        # cn() helper (clsx + tailwind-merge)
src/styles/atelier.css  # Tailwind v4 entry + tokens + reduced-motion baseline
public/artwork/         # artwork images (.webp), referenced by URL
```

## Editing content (config-driven)

- **Text / contact:** `src/data/site.ts` — brand, hero/gallery/about copy,
  footer. The contact email is stored **base64** and decoded only on a user
  click ("E-Mail anzeigen") so it is not a scrapeable plain string.
- **Artworks:** `src/data/artwork.ts` — one array; only `id`/`title`/`src` are
  required, the rest defaults. See the "HOW TO ADD A REAL WORK" header. A work
  is buyable when `status:"available"` **and** it has a `paymentLink` (Stripe);
  otherwise its card links through to the contact section ("Anfragen →").
- **Images:** drop a photo in `public/artwork/`, convert to `.webp` (long edge
  ~1600px, q≈84), then reference it from `artwork.ts`.

## Conventions / accessibility

- **Alias:** `@/*` → `src/*` (defined in `vite.config.ts`, `tsconfig.app.json`,
  and the root `tsconfig.json` `paths` so the shadcn CLI resolves it too).
- **Accessibility is a requirement:** semantic landmarks, descriptive `alt`,
  visible focus rings, `aria-pressed` on the palette, a skip link,
  `prefers-reduced-motion` (the shader freezes), image `aspect-ratio` (no CLS).
- **Styling:** Tailwind v4 utilities + tokens in `atelier.css`. Don't hand-format
  — run `format` / `lint:fix`.
- **Button text gotcha:** a global unlayered `button { color: inherit }` beats
  Tailwind text-colour utilities, so set button text colour via inline `style`
  (see the hero CTA and "E-Mail anzeigen") when the button is on a light
  background.

## React Bits

Only **`swirl-blend`** is used (the hero shader). `components.json` is wired to
`@reactbits-starter` only; the full vendor reference is **`SKILL.md`** at the
repo root. Add more with `npx shadcn@latest add @reactbits-starter/<slug>-tw`
(needs `REACTBITS_LICENSE_KEY` in `.env.local`). SKILL.md is Next.js-first —
this is Vite: no `next/dynamic` (use `React.lazy`); `"use client"` is a no-op.

## Deployment

GitHub Pages via `.github/workflows/deploy-pages.yml` on push to `main` (or
`workflow_dispatch`). Custom domain **`atelierbella.art`** (`public/CNAME`). The
repo is **private**, the Pages site is **public** — only the compiled `dist/`
ships, never source. `vite.config.ts` sets `base: "./"` and splits the
`three` / `react` chunks for caching.

## Secrets

`.env.local` (gitignored) holds `REACTBITS_LICENSE_KEY` — the only true secret.
Keep it out of the repo and the client bundle.
