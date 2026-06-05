# Atelier Bella

React SPA for a painterly online atelier, built with Vite, React, TypeScript,
Tailwind CSS v4, and a Starter-only React Bits registry setup.

## Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the Vite dev server          |
| `npm run build`        | Typecheck and build for production |
| `npm run preview`      | Preview the production build       |
| `npm run lint`         | Run ESLint                         |
| `npm run format:check` | Check formatting                   |

## React Bits

`components.json` is configured only for `@reactbits-starter`.
Set `REACTBITS_LICENSE_KEY` in `.env.local` before installing paid Starter
components with `npx shadcn@latest add @reactbits-starter/<component>-tw`.

`src/components/react-bits/` holds the **real, licensed React Bits Starter
components** (the installed originals, Prettier-reformatted on commit) — these
are not placeholders. Because that is premium licensed source, **this repository
is private; do not make it public.**

## Artwork

Artwork lives in `public/artwork` and is referenced directly from the SPA for
hero, gallery, card, and manifest surfaces.
