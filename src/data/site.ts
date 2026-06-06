// Editable site content — change copy, contact and section text here.
// (Artworks live in ./artwork.ts.)

export const siteConfig = {
  brand: "Atelier Bella",
  contactEmail: "anfh22@outlook.com",

  hero: {
    eyebrow: "Online Atelier",
    title: "Atelier Bella",
    subline:
      "Malerei, die atmet — Farbwelten zum Mitnehmen, jede Leinwand ein eigenes Licht.",
    cta: "Zur Ausstellung",
  },

  gallery: {
    eyebrow: "Ausstellung",
    title: "Werke",
    // The work count is prepended automatically, e.g. "8 Originale — …".
    intro:
      "Originale — Öl & Studie. Jedes Bild als digitale Edition erhältlich.",
  },

  about: {
    eyebrow: "Kontakt",
    title: "Über das Atelier",
    body: "Atelier Bella ist ein kleines Online-Atelier für farbstarke Stillleben — Öl, sichtbare Textur, klare Farbwelten. Originale und Auftragsarbeiten entstehen auf Anfrage. Schreib mir gern, wenn dich ein Werk interessiert oder du eine Idee mitbringst.",
    cta: "Schreib dem Atelier",
  },

  footer: "Atelier Bella · Online Atelier — Malerei von Bella.",
} as const;

export type SiteConfig = typeof siteConfig;
