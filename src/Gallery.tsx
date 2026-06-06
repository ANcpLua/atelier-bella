import { artwork, type Artwork } from "@/data/artwork";

const STATUS: Record<Artwork["status"], string> = {
  available: "Verfügbar",
  study: "Studie",
  commission: "Auf Anfrage",
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

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
              "aria-label": `${art.title} – ${art.priceLabel} – kaufen (öffnet in neuem Tab)`,
            }
          : {})}
        className={`block rounded-2xl ${buyable ? FOCUS : ""}`}
      >
        <img
          src={art.src}
          alt={`„${art.title}“ — ${art.format}-Gemälde, ${art.size}`}
          loading="lazy"
          decoding="async"
          style={{ aspectRatio: `${art.width} / ${art.height}` }}
          className="block h-auto w-full transition duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />

        {/* status badge */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: art.accent }}
          />
          {STATUS[art.status]}
        </span>

        {/* caption — always visible on mobile, hover/focus-reveal on desktop */}
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 opacity-100 transition duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none md:translate-y-2 md:opacity-0">
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
      <a
        href="#werke"
        className={`sr-only rounded-full bg-white px-5 py-2 font-semibold text-black focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 ${FOCUS}`}
      >
        Zum Inhalt springen
      </a>

      <header className="flex items-center justify-between px-[6vw] py-7">
        <button
          type="button"
          onClick={onBack}
          className={`group inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium tracking-wide text-white/70 transition hover:text-white ${FOCUS}`}
        >
          <span
            aria-hidden="true"
            className="transition group-hover:-translate-x-0.5 motion-reduce:transition-none"
          >
            ←
          </span>
          Atelier Bella
        </button>
        <span className="text-xs font-medium tracking-[0.3em] text-white/40 uppercase">
          Online Atelier
        </span>
      </header>

      <main id="werke">
        <section className="px-[6vw] pt-10 pb-16">
          <p className="mb-3 text-sm font-medium tracking-[0.35em] text-white/50 uppercase">
            Ausstellung
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
              Werke
            </h1>
            <p className="max-w-[34ch] text-white/55">
              {artwork.length} Originale — Öl &amp; Studie. Jedes Bild als
              digitale Edition erhältlich.
            </p>
          </div>
        </section>

        <div className="columns-1 gap-6 px-[6vw] pb-24 sm:columns-2 lg:columns-3">
          {artwork.map((art) => (
            <Piece key={art.id} art={art} />
          ))}
        </div>
      </main>

      <section
        id="kontakt"
        className="border-t border-white/10 px-[6vw] py-20"
        aria-labelledby="kontakt-title"
      >
        <p className="mb-3 text-sm font-medium tracking-[0.35em] text-white/50 uppercase">
          Kontakt
        </p>
        <h2
          id="kontakt-title"
          className="text-4xl font-semibold tracking-tight"
        >
          Über das Atelier
        </h2>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-white/70">
          Atelier Bella ist ein kleines Online-Atelier für farbstarke Stillleben
          — Öl, sichtbare Textur, klare Farbwelten. Originale und
          Auftragsarbeiten entstehen auf Anfrage. Schreib mir gern, wenn dich
          ein Werk interessiert oder du eine Idee mitbringst.
        </p>
        <a
          href="mailto:hallo@atelierbella.art?subject=Anfrage%20Atelier%20Bella"
          className={`mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold tracking-wide text-black transition hover:bg-white/90 ${FOCUS}`}
        >
          Schreib dem Atelier →
        </a>
      </section>

      <footer className="border-t border-white/10 px-[6vw] py-10 text-sm text-white/45">
        Atelier Bella · Online Atelier — Malerei von Bella.
      </footer>
    </div>
  );
}
