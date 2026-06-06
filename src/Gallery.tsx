import { artwork, type Artwork } from "@/data/artwork";

const STATUS: Record<Artwork["status"], string> = {
  available: "Verfügbar",
  study: "Studie",
  commission: "Auf Anfrage",
};

function Piece({ art }: { art: Artwork }) {
  const buyable = art.status === "available" && art.paymentLink !== "";
  const Wrapper = buyable ? "a" : "div";

  return (
    <figure className="group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
      <Wrapper
        {...(buyable
          ? {
              href: art.paymentLink,
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : {})}
        className="block"
      >
        <img
          src={art.src}
          alt={art.title}
          loading="lazy"
          decoding="async"
          className="w-full transition duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* status badge */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: art.accent }}
          />
          {STATUS[art.status]}
        </span>

        {/* caption — always visible on mobile, hover-reveal on desktop */}
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 opacity-100 transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-white">
                {art.title}
              </h3>
              <p className="text-sm text-white/60">
                {art.format} · {art.size} · {art.priceLabel}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-white">
              {buyable ? "Kaufen →" : "Atelier →"}
            </span>
          </div>
        </figcaption>
      </Wrapper>
    </figure>
  );
}

export default function Gallery({ onBack }: { onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="flex items-center justify-between px-[6vw] py-7">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white/70 transition hover:text-white"
        >
          <span className="transition group-hover:-translate-x-0.5">←</span>
          Atelier Bella
        </button>
        <span className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
          Online Atelier
        </span>
      </header>

      <section className="px-[6vw] pt-10 pb-16">
        <p className="mb-3 text-sm font-medium tracking-[0.35em] text-white/50 uppercase">
          Ausstellung
        </p>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            Werke
          </h1>
          <p className="max-w-[34ch] text-white/55">
            {artwork.length} Originale — Öl &amp; Studie. Jedes Bild als digitale
            Edition erhältlich.
          </p>
        </div>
      </section>

      <main className="columns-1 gap-6 px-[6vw] pb-24 sm:columns-2 lg:columns-3">
        {artwork.map((art) => (
          <Piece key={art.id} art={art} />
        ))}
      </main>

      <footer className="border-t border-white/10 px-[6vw] py-10 text-sm text-white/45">
        Atelier Bella · Online Atelier — Malerei von Bella.
      </footer>
    </div>
  );
}
