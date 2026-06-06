// ─────────────────────────────────────────────────────────────────────────
// HOW TO ADD A REAL WORK
//   1. Put the photo in  public/artwork/  (any size — we convert to .webp).
//   2. Add an entry to `works` below. Only `id`, `title` and `src` are required.
//   3. To sell it directly: set `status: "available"` and either
//        • paste a Stripe Payment Link as `paymentLink` (these are public), or
//        • set a VITE_…_PAYMENT_LINK env var and reference it via `paymentEnvKey`.
//      Works without a buy link link through to the contact section instead.
//   Everything else has sensible defaults. `width`/`height` are optional — set
//   them (intrinsic px) to avoid layout shift while the image loads.
// ─────────────────────────────────────────────────────────────────────────

export type ArtworkStatus = "available" | "commission" | "study";

type WorkInput = {
  id: string;
  title: string;
  src: string;
  status?: ArtworkStatus;
  priceLabel?: string;
  format?: string;
  size?: string;
  accent?: string;
  copy?: string;
  width?: number;
  height?: number;
  paymentLink?: string;
  paymentEnvKey?: string;
};

export type Artwork = {
  id: string;
  title: string;
  src: string;
  status: ArtworkStatus;
  priceLabel: string;
  format: string;
  size: string;
  accent: string;
  copy: string;
  width?: number;
  height?: number;
  paymentLink: string;
};

function defineWork(w: WorkInput): Artwork {
  return {
    id: w.id,
    title: w.title,
    src: w.src,
    status: w.status ?? "available",
    priceLabel: w.priceLabel ?? "Preis auf Anfrage",
    format: w.format ?? "Gemälde",
    size: w.size ?? "",
    accent: w.accent ?? "#e2683a",
    copy: w.copy ?? "",
    width: w.width,
    height: w.height,
    paymentLink:
      w.paymentLink ??
      (w.paymentEnvKey ? (import.meta.env[w.paymentEnvKey] ?? "") : ""),
  };
}

const works: WorkInput[] = [
  {
    id: "seascape",
    title: "Türkises Meer",
    src: "artwork/seascape.webp",
    width: 1140,
    height: 1530,
    status: "available",
    format: "Öl auf Leinwand",
    accent: "#28D8D4",
    priceLabel: "Preis auf Anfrage",
    copy: "Weiter Himmel über türkiser Brandung — Öl, weiche Wolken, klare Horizontlinie.",
  },
  {
    id: "fruechte-stillleben",
    title: "Früchte-Stillleben",
    src: "artwork/fruechte-stillleben.webp",
    width: 1600,
    height: 1180,
    status: "available",
    format: "Acryl auf Leinwand",
    accent: "#E64992",
    priceLabel: "Preis auf Anfrage",
    copy: "Avocado, Zitrusfrüchte und Birnen in dichtem, farbstarkem Auftrag. Signiert Ivannella Veras.",
  },
];

export const artwork: Artwork[] = works.map(defineWork);
