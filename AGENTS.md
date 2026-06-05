# Atelier Bella (`chromatic-atelier`)

A single-page React storefront for a painterly online atelier: a hero, themed
exhibition rooms, an artwork gallery, and per-artwork "digital-auction" cards
that link out to payment links. Static SPA — no backend, no SSR.

> **Private repo — keep it private.** `src/components/react-bits/` contains
> licensed React Bits Starter source; making this repository public would
> violate the React Bits license.

## Stack

- **Vite 7** + **React 19** + **TypeScript** (ESM, `"type": "module"`)
- **Tailwind CSS v4** via `@tailwindcss/vite` — single stylesheet at
  `src/styles/atelier.css` (no `tailwind.config`; CSS-first config + `cssVariables`)
- **three** + **@react-three/fiber**, **motion**, **gsap** — WebGL / animation
- **lucide-react** — icons
- **React Bits Pro** (`@reactbits-starter` registry only) — see "React Bits" below

## Commands

| Command                | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Vite dev server                                         |
| `npm run build`        | `tsc -b && vite build` — **typecheck is part of build** |
| `npm run preview`      | Serve the production `dist/`                            |
| `npm run typecheck`    | `tsc -b --noEmit`                                       |
| `npm run lint`         | ESLint (`eslint .`)                                     |
| `npm run lint:fix`     | ESLint with `--fix`                                     |
| `npm run format`       | Prettier write                                          |
| `npm run format:check` | Prettier check (CI-style)                               |

A type error fails `build`, which fails the Pages deploy. Run `typecheck`
before pushing.

## Layout

```
index.html              # SPA entry
src/main.tsx            # mounts <App/> into #root, imports atelier.css
src/App.tsx             # the entire SPA (hero, rooms, gallery, cards, checkout)
src/data/artwork.ts     # Artwork / ExhibitionRoom models + payment-link wiring
src/components/react-bits/   # animated components (see React Bits)
src/lib/utils.ts        # cn() helper (clsx + tailwind-merge)
src/styles/atelier.css  # Tailwind v4 entry + all design tokens
public/artwork/         # artwork image assets, referenced directly by URL
```

## Conventions

- **Import alias:** `@/*` → `src/*` (defined in both `vite.config.ts` and
  `tsconfig.app.json` — keep them in sync if you change it).
- **TypeScript:** strict project-references build (`tsc -b`). Prefer `type`
  imports; the codebase exports component prop types (e.g. `WatercolorProps`).
- **Styling:** Tailwind v4 utilities + design tokens in `atelier.css`. There is
  no JS theme config — adjust tokens in the stylesheet, not a config file.
- **Formatting/lint:** Prettier + ESLint flat config (`eslint.config.mjs`) are
  the source of truth. Don't hand-format; run `lint:fix` / `format`.

## React Bits

`components.json` is wired to **`@reactbits-starter` only** (100 animated
components; the `@reactbits-pro` block registry is _not_ configured). The full
usage reference lives in **`SKILL.md`** at the repo root — read it before
adding or troubleshooting React Bits components instead of duplicating it here.

Project-specific notes (the SKILL.md is written Next.js-first; this is Vite):

- **No `next/dynamic`** — lazy-load heavy WebGL components with `React.lazy` +
  `<Suspense>`, not `next/dynamic`.
- **No `next-themes`** — theming is custom via `atelier.css`, not a theme
  provider.
- **`"use client"` is a harmless no-op** here (Vite ignores it). Leave it in
  installed files; don't add it to your own.
- `src/components/react-bits/` already holds the **real, licensed Starter
  components** (e.g. `watercolor`, `warp-twister`) — verified ~95–100% identical
  to the registry source, just Prettier-reformatted. They are NOT placeholders;
  don't "replace" them. This premium source is why the repo is private.
- License key: `REACTBITS_LICENSE_KEY` in `.env.local` (gitignored). Install
  with `npx shadcn@latest add @reactbits-starter/<slug>-tw`.

## Artwork & payment links

`src/data/artwork.ts` is the single source for artwork metadata, exhibition
rooms, and pricing. Each sellable piece (`saleMode: "digital-auction"`) maps to
a build-time env var `VITE_ARTWORK_01_PAYMENT_LINK` … `_08_`. Because Vite
inlines every `VITE_`-prefixed var into the client bundle, **these payment
links are intentionally public** (e.g. Stripe Payment Links) — not secrets.
Set them in `.env.local` locally.

## Deployment

> **Status:** the repo is now **private**, so GitHub Pages (free plan) no longer
> serves the site, and `deploy-pages.yml` will no longer publish. Hosting
> migration to a host that builds private repos for free (Cloudflare Pages /
> Netlify / Vercel) is pending.

GitHub Pages via `.github/workflows/deploy-pages.yml` on push to `main` (or
manual `workflow_dispatch`):

- Node 24, `npm ci`, `npm run build` → uploads `dist/` as the Pages artifact.
- The 8 `VITE_ARTWORK_*_PAYMENT_LINK` values are injected from GitHub repo
  **Variables** (`vars`), not Secrets — consistent with them being public.
- `vite.config.ts` sets `base: "./"` so the build works under the Pages
  subpath. `manualChunks` splits `three` / `motion` / `react` for caching.

## Secrets

- `.env.local` (gitignored) holds `REACTBITS_LICENSE_KEY` and the local payment
  links. **Never commit it.**
- The license key is the only true secret here and must stay out of CI vars and
  the client bundle.
