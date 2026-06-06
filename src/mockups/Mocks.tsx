// TEMPORARY design mockups for the gallery redesign — not committed.
import InfiniteGallery from "@/components/react-bits/infinite-gallery";
import ParallaxCarousel from "@/components/react-bits/parallax-carousel";
import { artwork } from "@/data/artwork";

const DIMS: Record<string, [number, number]> = {
  "avocado-01": [1254, 1254],
  "avocado-02": [1024, 1536],
  "avocado-03": [1086, 1448],
  "avocado-04": [1122, 1402],
  "avocado-05": [1055, 1491],
  "avocado-06": [1536, 1024],
  "avocado-07": [1448, 1086],
  "avocado-08": [1672, 941],
};

const STATUS_LABEL: Record<string, string> = {
  available: "Verfügbar",
  study: "Studie",
  commission: "Auftrag",
};

// ---- Concept A: Editorial masonry grid ----
export function MockGrid() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-[6vw] py-24 text-white">
      <header className="mb-16 flex items-end justify-between gap-8">
        <div>
          <p className="mb-3 text-sm font-medium tracking-[0.35em] text-white/50 uppercase">
            Ausstellung
          </p>
          <h2 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Werke
          </h2>
        </div>
        <p className="hidden max-w-[30ch] text-right text-white/55 md:block">
          Acht Originale — Öl &amp; Studie. Jedes Bild als Edition erhältlich.
        </p>
      </header>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
        {artwork.map((art) => (
          <figure
            key={art.id}
            className="group relative break-inside-avoid overflow-hidden rounded-2xl bg-white/5"
          >
            <img
              src={art.src}
              alt={art.title}
              loading="lazy"
              className="w-full transition duration-500 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{art.title}</h3>
                  <p className="text-sm text-white/60">
                    {art.format} · {art.priceLabel}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-white/30 px-3 py-1 text-xs">
                  {STATUS_LABEL[art.status]}
                </span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// ---- Concept B: Cinematic parallax carousel ----
export function MockCarousel() {
  const imgs = artwork.map((a) => a.src);
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      <ParallaxCarousel
        images={imgs}
        className="absolute inset-0"
        gap={0.12}
        parallaxIntensity={1.2}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[6vw] pt-10">
        <p className="text-sm font-medium tracking-[0.35em] text-white/60 uppercase">
          Ausstellung
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">Atelier Bella</h2>
      </div>
      <p className="pointer-events-none absolute inset-x-0 bottom-10 z-10 text-center text-sm tracking-wide text-white/45">
        ← ziehen zum Blättern →
      </p>
    </div>
  );
}

// ---- Concept C: Immersive 3D wall ----
export function MockWall() {
  const imgs = artwork.map((a) => ({
    url: a.src,
    width: DIMS[a.id]?.[0] ?? 1200,
    height: DIMS[a.id]?.[1] ?? 1200,
  }));
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      <InfiniteGallery
        images={imgs}
        className="absolute inset-0"
        backgroundColor="#0a0a0a"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[6vw] pt-10">
        <p className="text-sm font-medium tracking-[0.35em] text-white/60 uppercase">
          Ausstellung
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">Atelier Bella</h2>
      </div>
    </div>
  );
}

export function MockRouter() {
  const h = window.location.hash;
  if (h.startsWith("#mock-carousel")) return <MockCarousel />;
  if (h.startsWith("#mock-wall")) return <MockWall />;
  return <MockGrid />;
}
