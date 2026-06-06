// ─────────────────────────────────────────────────────────────────────────
// HOW TO ADD A REAL WORK
//   1. Put the photo in  public/artwork/  (any size — we convert to .webp).
//   2. Add an entry to `works` below. Only `id`, `title` and `src` are required.
//   3. To sell it: set `status: "available"` and either
//        • paste a Stripe Payment Link as `paymentLink` (these are public), or
//        • set a VITE_…_PAYMENT_LINK env var and reference it via `paymentEnvKey`.
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

// Placeholder set (one real motif, varied crops) — swap for real photos.
const works: WorkInput[] = [
  {
    id: "avocado-01",
    title: "Avocado Stillleben I",
    format: "Square",
    size: "1:1",
    src: "artwork/01_square_1x1_1254x1254.webp",
    width: 1254,
    height: 1254,
    status: "available",
    accent: "#B7F26D",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_01_PAYMENT_LINK",
    copy: "Das zentrale Motiv als konzentrierter Einstieg in Bellas Avocado-Serie.",
  },
  {
    id: "avocado-02",
    title: "Pink Ground Study",
    format: "Portrait",
    size: "2:3",
    src: "artwork/02_portrait_2x3_1024x1536.webp",
    width: 1024,
    height: 1536,
    status: "study",
    accent: "#E64992",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_02_PAYMENT_LINK",
    copy: "Ein hoher Ausschnitt mit starkem Pink-Grund und dichtem Pinselauftrag.",
  },
  {
    id: "avocado-03",
    title: "Lemon and Blue",
    format: "Portrait",
    size: "3:4",
    src: "artwork/03_portrait_3x4_1086x1448.webp",
    width: 1086,
    height: 1448,
    status: "available",
    accent: "#28D8D4",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_03_PAYMENT_LINK",
    copy: "Avocado, Zitrone und Blau stehen wie drei Lichtquellen im dunklen Raum.",
  },
  {
    id: "avocado-04",
    title: "Green Flesh",
    format: "Portrait",
    size: "4:5",
    src: "artwork/04_portrait_4x5_1122x1402.webp",
    width: 1122,
    height: 1402,
    status: "commission",
    accent: "#9DDC42",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_04_PAYMENT_LINK",
    copy: "Nahe am Fruchtfleisch, mit sichtbaren Grün- und Gelbschichten.",
  },
  {
    id: "avocado-05",
    title: "A-Series Crop",
    format: "Paper",
    size: "A-Serie",
    src: "artwork/05_portrait_a_series_1055x1491.webp",
    width: 1055,
    height: 1491,
    status: "study",
    accent: "#1F6FA8",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_05_PAYMENT_LINK",
    copy: "Ein papiernaher Ausschnitt, gebaut aus Schichtung, Reibung und Farbe.",
  },
  {
    id: "avocado-06",
    title: "Table Light",
    format: "Landscape",
    size: "3:2",
    src: "artwork/06_landscape_3x2_1536x1024.webp",
    width: 1536,
    height: 1024,
    status: "available",
    accent: "#E64992",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_06_PAYMENT_LINK",
    copy: "Breiter Tisch, harte Farbe, viel Raum für die Pinselspur.",
  },
  {
    id: "avocado-07",
    title: "Gallery Crop",
    format: "Landscape",
    size: "4:3",
    src: "artwork/07_landscape_4x3_1448x1086.webp",
    width: 1448,
    height: 1086,
    status: "commission",
    accent: "#28D8D4",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_07_PAYMENT_LINK",
    copy: "Der ruhigere Raum-Crop, gut für großflächige digitale Hängung.",
  },
  {
    id: "avocado-08",
    title: "Chromatic Table",
    format: "Wide",
    size: "16:9",
    src: "artwork/08_landscape_16x9_1672x941.webp",
    width: 1672,
    height: 941,
    status: "available",
    accent: "#B7F26D",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_08_PAYMENT_LINK",
    copy: "Das breiteste Format: ein farbiger Tisch wie eine offene Bühne.",
  },
];

export const artwork: Artwork[] = works.map(defineWork);
