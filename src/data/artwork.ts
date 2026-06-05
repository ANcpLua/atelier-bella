export type Artwork = {
  title: string;
  format: string;
  size: string;
  src: string;
  width: number;
  height: number;
  status: "available" | "commission" | "study";
};

export const squareArtwork: Artwork = {
  title: "Avocado Stillleben I",
  format: "Square",
  size: "1:1",
  src: "artwork/01_square_1x1_1254x1254.png",
  width: 1254,
  height: 1254,
  status: "available",
};

export const portraitTwoByThreeArtwork: Artwork = {
  title: "Pink Ground Study",
  format: "Portrait",
  size: "2:3",
  src: "artwork/02_portrait_2x3_1024x1536.png",
  width: 1024,
  height: 1536,
  status: "study",
};

export const portraitThreeByFourArtwork: Artwork = {
  title: "Lemon and Blue",
  format: "Portrait",
  size: "3:4",
  src: "artwork/03_portrait_3x4_1086x1448.png",
  width: 1086,
  height: 1448,
  status: "available",
};

export const portraitFourByFiveArtwork: Artwork = {
  title: "Green Flesh",
  format: "Portrait",
  size: "4:5",
  src: "artwork/04_portrait_4x5_1122x1402.png",
  width: 1122,
  height: 1402,
  status: "commission",
};

export const aSeriesArtwork: Artwork = {
  title: "A-Series Crop",
  format: "Paper",
  size: "A-series",
  src: "artwork/05_portrait_a_series_1055x1491.png",
  width: 1055,
  height: 1491,
  status: "study",
};

export const landscapeThreeByTwoArtwork: Artwork = {
  title: "Table Light",
  format: "Landscape",
  size: "3:2",
  src: "artwork/06_landscape_3x2_1536x1024.png",
  width: 1536,
  height: 1024,
  status: "available",
};

export const landscapeFourByThreeArtwork: Artwork = {
  title: "Gallery Crop",
  format: "Landscape",
  size: "4:3",
  src: "artwork/07_landscape_4x3_1448x1086.png",
  width: 1448,
  height: 1086,
  status: "commission",
};

export const wideArtwork: Artwork = {
  title: "Chromatic Table",
  format: "Wide",
  size: "16:9",
  src: "artwork/08_landscape_16x9_1672x941.png",
  width: 1672,
  height: 941,
  status: "available",
};

export const artwork: Artwork[] = [
  squareArtwork,
  portraitTwoByThreeArtwork,
  portraitThreeByFourArtwork,
  portraitFourByFiveArtwork,
  aSeriesArtwork,
  landscapeThreeByTwoArtwork,
  landscapeFourByThreeArtwork,
  wideArtwork,
];

export const heroArtwork = wideArtwork;
export const processArtwork = aSeriesArtwork;
export const featuredArtwork: Artwork[] = [
  squareArtwork,
  portraitThreeByFourArtwork,
  portraitFourByFiveArtwork,
  landscapeThreeByTwoArtwork,
];
