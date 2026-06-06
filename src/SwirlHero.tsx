import { useState } from "react";
import SwirlBlend from "@/components/react-bits/swirl-blend";
import { siteConfig } from "@/data/site";

type Palette = {
  id: string;
  label: string;
  hint: string;
  swatch: string;
  base: [number, number, number];
  amp: [number, number, number];
  phase: [number, number, number];
};

/** Cosine-palette presets (base + amp·cos(2π·(phase + t)) per channel). */
const PALETTES: Palette[] = [
  {
    id: "warm",
    label: "Warm",
    hint: "Koralle, Pfirsich, Blau",
    swatch: "#e2683a",
    base: [0.62, 0.45, 0.42],
    amp: [0.42, 0.36, 0.32],
    phase: [0.0, 0.12, 0.24],
  },
  {
    id: "ozean",
    label: "Ozean",
    hint: "Tiefblau, Stahl",
    swatch: "#3a6fe2",
    base: [0.2, 0.34, 0.64],
    amp: [0.18, 0.26, 0.36],
    phase: [0.55, 0.5, 0.42],
  },
  {
    id: "tuerkis",
    label: "Türkis",
    hint: "Cyan, Teal, Lind",
    swatch: "#1fb6b0",
    base: [0.16, 0.54, 0.54],
    amp: [0.16, 0.32, 0.32],
    phase: [0.5, 0.4, 0.34],
  },
  {
    id: "pink",
    label: "Pink",
    hint: "Magenta, Rosé",
    swatch: "#e24a9c",
    base: [0.66, 0.3, 0.52],
    amp: [0.3, 0.22, 0.3],
    phase: [0.0, 0.18, 0.08],
  },
  {
    id: "fruehling",
    label: "Frühling",
    hint: "Lind, Mint, Hellgrün",
    swatch: "#86c25a",
    base: [0.34, 0.56, 0.4],
    amp: [0.2, 0.2, 0.16],
    phase: [0.1, 0.0, 0.18],
  },
];

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

export default function SwirlHero({ onEnter }: { onEnter?: () => void }) {
  const [active, setActive] = useState(0);
  const p = PALETTES[active];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <SwirlBlend
        key={p.id}
        className="absolute inset-0"
        speed={prefersReducedMotion ? 0 : 0.5}
        scale={7}
        iterations={5}
        cursorInteraction={!prefersReducedMotion}
        backgroundColor="#0a0a0a"
        paletteBaseR={p.base[0]}
        paletteBaseG={p.base[1]}
        paletteBaseB={p.base[2]}
        paletteAmpR={p.amp[0]}
        paletteAmpG={p.amp[1]}
        paletteAmpB={p.amp[2]}
        palettePhaseR={p.phase[0]}
        palettePhaseG={p.phase[1]}
        palettePhaseB={p.phase[2]}
      />

      {/* legibility veils: top/bottom + a left scrim so text stays readable on every palette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-[7vw]">
        <p className="mb-5 text-sm font-medium tracking-[0.35em] text-white/75 uppercase">
          {siteConfig.hero.eyebrow}
        </p>
        <h1 className="max-w-[16ch] text-5xl leading-[1.02] font-semibold tracking-tight text-white sm:text-6xl md:text-8xl">
          {siteConfig.hero.title}
        </h1>
        <p className="mt-7 max-w-[42ch] text-lg text-white/85 md:text-xl">
          {siteConfig.hero.subline}
        </p>
        <button
          type="button"
          onClick={onEnter}
          style={{ color: "#0a0a0a" }}
          className={`mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-white/95 px-7 py-3 text-sm font-semibold tracking-wide transition hover:bg-white ${FOCUS}`}
        >
          {siteConfig.hero.cta} →
        </button>
      </div>

      {/* palette switcher — desktop: labelled card */}
      <div
        className="absolute right-6 bottom-6 hidden w-60 rounded-2xl border border-white/15 bg-black/40 p-2 backdrop-blur-md md:block"
        role="group"
        aria-label="Farbwelt wählen"
      >
        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-[0.3em] text-white/50 uppercase">
          Farbwelt
        </p>
        {PALETTES.map((pal, i) => (
          <button
            key={pal.id}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none focus-visible:ring-inset ${
              i === active ? "bg-white/15" : "hover:bg-white/5"
            }`}
          >
            <span
              aria-hidden="true"
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ backgroundColor: pal.swatch }}
            />
            <span className="flex-1">
              <span className="block text-sm font-medium text-white">
                {pal.label}
              </span>
              <span className="block text-xs text-white/55">{pal.hint}</span>
            </span>
            {i === active && (
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {/* palette switcher — mobile: compact swatch row */}
      <div
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-black/40 px-4 py-3 backdrop-blur-md md:hidden"
        role="group"
        aria-label="Farbwelt wählen"
      >
        {PALETTES.map((pal, i) => (
          <button
            key={pal.id}
            type="button"
            aria-label={pal.label}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={`h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-black/60 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              i === active ? "ring-white" : "ring-transparent"
            }`}
            style={{ backgroundColor: pal.swatch }}
          />
        ))}
      </div>
    </div>
  );
}
