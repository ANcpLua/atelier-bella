export type ArtworkStatus = "available" | "commission" | "study";

export type PaymentEnvKey =
  | "VITE_ARTWORK_01_PAYMENT_LINK"
  | "VITE_ARTWORK_02_PAYMENT_LINK"
  | "VITE_ARTWORK_03_PAYMENT_LINK"
  | "VITE_ARTWORK_04_PAYMENT_LINK"
  | "VITE_ARTWORK_05_PAYMENT_LINK"
  | "VITE_ARTWORK_06_PAYMENT_LINK"
  | "VITE_ARTWORK_07_PAYMENT_LINK"
  | "VITE_ARTWORK_08_PAYMENT_LINK";

export type Artwork = {
  id: string;
  title: string;
  format: string;
  size: string;
  src: string;
  width: number;
  height: number;
  status: ArtworkStatus;
  accent: string;
  editionLabel: string;
  saleMode: "digital-auction";
  priceLabel: string;
  paymentEnvKey: PaymentEnvKey;
  paymentLink: string;
  copy: string;
};

export type ExhibitionRoom = {
  id: string;
  title: string;
  kicker: string;
  artworkIds: string[];
  nextRoomId: string | null;
  previousRoomId: string | null;
  purpose: "gallery" | "buy" | "contact";
};

function resolvePaymentLink(paymentEnvKey: PaymentEnvKey): string {
  return import.meta.env[paymentEnvKey] ?? "";
}

function defineArtwork(
  piece: Omit<Artwork, "saleMode" | "paymentLink">
): Artwork {
  return {
    ...piece,
    saleMode: "digital-auction",
    paymentLink: resolvePaymentLink(piece.paymentEnvKey),
  };
}

export const artwork: Artwork[] = [
  defineArtwork({
    id: "avocado-01",
    title: "Avocado Stillleben I",
    format: "Square",
    size: "1:1",
    src: "artwork/01_square_1x1_1254x1254.png",
    width: 1254,
    height: 1254,
    status: "available",
    accent: "#B7F26D",
    editionLabel: "Edition 01",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_01_PAYMENT_LINK",
    copy: "Das zentrale Motiv als konzentrierter Einstieg in Bellas digitale Avocado-Serie.",
  }),
  defineArtwork({
    id: "avocado-02",
    title: "Pink Ground Study",
    format: "Portrait",
    size: "2:3",
    src: "artwork/02_portrait_2x3_1024x1536.png",
    width: 1024,
    height: 1536,
    status: "study",
    accent: "#E64992",
    editionLabel: "Edition 02",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_02_PAYMENT_LINK",
    copy: "Ein hoher Ausschnitt mit starkem Pink-Grund und dichtem Pinselauftrag.",
  }),
  defineArtwork({
    id: "avocado-03",
    title: "Lemon and Blue",
    format: "Portrait",
    size: "3:4",
    src: "artwork/03_portrait_3x4_1086x1448.png",
    width: 1086,
    height: 1448,
    status: "available",
    accent: "#28D8D4",
    editionLabel: "Edition 03",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_03_PAYMENT_LINK",
    copy: "Avocado, Zitrone und Blau stehen wie drei Lichtquellen im dunklen Raum.",
  }),
  defineArtwork({
    id: "avocado-04",
    title: "Green Flesh",
    format: "Portrait",
    size: "4:5",
    src: "artwork/04_portrait_4x5_1122x1402.png",
    width: 1122,
    height: 1402,
    status: "commission",
    accent: "#9DDC42",
    editionLabel: "Edition 04",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_04_PAYMENT_LINK",
    copy: "Nahe am Fruchtfleisch, mit sichtbaren Gruen- und Gelbschichten.",
  }),
  defineArtwork({
    id: "avocado-05",
    title: "A-Series Crop",
    format: "Paper",
    size: "A-series",
    src: "artwork/05_portrait_a_series_1055x1491.png",
    width: 1055,
    height: 1491,
    status: "study",
    accent: "#1F6FA8",
    editionLabel: "Edition 05",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_05_PAYMENT_LINK",
    copy: "Ein papiernaher Ausschnitt, gebaut aus Schichtung, Reibung und Farbe.",
  }),
  defineArtwork({
    id: "avocado-06",
    title: "Table Light",
    format: "Landscape",
    size: "3:2",
    src: "artwork/06_landscape_3x2_1536x1024.png",
    width: 1536,
    height: 1024,
    status: "available",
    accent: "#E64992",
    editionLabel: "Edition 06",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_06_PAYMENT_LINK",
    copy: "Breiter Tisch, harte Farbe, viel Raum fuer die Pinselspur.",
  }),
  defineArtwork({
    id: "avocado-07",
    title: "Gallery Crop",
    format: "Landscape",
    size: "4:3",
    src: "artwork/07_landscape_4x3_1448x1086.png",
    width: 1448,
    height: 1086,
    status: "commission",
    accent: "#28D8D4",
    editionLabel: "Edition 07",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_07_PAYMENT_LINK",
    copy: "Der ruhigere Raum-Crop, gut fuer grossflaechige digitale Haengung.",
  }),
  defineArtwork({
    id: "avocado-08",
    title: "Chromatic Table",
    format: "Wide",
    size: "16:9",
    src: "artwork/08_landscape_16x9_1672x941.png",
    width: 1672,
    height: 941,
    status: "available",
    accent: "#B7F26D",
    editionLabel: "Edition 08",
    priceLabel: "ab 5 EUR",
    paymentEnvKey: "VITE_ARTWORK_08_PAYMENT_LINK",
    copy: "Das breiteste Format: ein farbiger Tisch wie eine offene Buehne.",
  }),
];

export const exhibitionRooms: ExhibitionRoom[] = [
  {
    id: "north-wall",
    title: "Nordwand",
    kicker: "Galerie",
    artworkIds: ["avocado-01", "avocado-03", "avocado-04"],
    nextRoomId: "side-room",
    previousRoomId: null,
    purpose: "gallery",
  },
  {
    id: "side-room",
    title: "Seitenraum",
    kicker: "Studien",
    artworkIds: ["avocado-02", "avocado-05", "avocado-06", "avocado-07"],
    nextRoomId: "auction-room",
    previousRoomId: "north-wall",
    purpose: "gallery",
  },
  {
    id: "auction-room",
    title: "Digitale Auktion",
    kicker: "Kaufen",
    artworkIds: [
      "avocado-01",
      "avocado-02",
      "avocado-03",
      "avocado-04",
      "avocado-05",
      "avocado-06",
      "avocado-07",
      "avocado-08",
    ],
    nextRoomId: "contact-room",
    previousRoomId: "side-room",
    purpose: "buy",
  },
  {
    id: "contact-room",
    title: "Atelierkontakt",
    kicker: "Kontakt",
    artworkIds: ["avocado-08"],
    nextRoomId: null,
    previousRoomId: "auction-room",
    purpose: "contact",
  },
];

export const artworkById = new Map(artwork.map((piece) => [piece.id, piece]));
export const heroArtwork = artworkById.get("avocado-08") ?? artwork[0];
