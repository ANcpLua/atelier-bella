import {
  ArrowLeft,
  ArrowRight,
  DoorOpen,
  Mail,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import type { CSSProperties, FormEvent, PointerEvent, TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Watercolor from "@/components/react-bits/watercolor";
import {
  artwork,
  artworkById,
  exhibitionRooms,
  heroArtwork,
  type Artwork,
  type ExhibitionRoom,
} from "@/data/artwork";

const roomById = new Map(exhibitionRooms.map((room) => [room.id, room]));

const roomCopy: Record<string, string> = {
  "north-wall":
    "Die erste Wand zeigt Bellas Avocado-Serie gross, farbig und mit weichem Licht.",
  "side-room":
    "Studien und Crops lassen Farbe, Pinselspur und Format freier atmen.",
  "auction-room":
    "Jedes Bild bekommt seinen eigenen Kaufweg. Wenn ein Link noch fehlt, geht die Anfrage direkt zu Bella.",
  "contact-room":
    "Fuer Auftraege, Besuche oder ein Bild, das du erst kurz besprechen willst.",
};

function getArtwork(id: string): Artwork {
  return artworkById.get(id) ?? artwork[0];
}

function getStatusLabel(status: Artwork["status"]): string {
  switch (status) {
    case "available":
      return "Verfuegbar";
    case "commission":
      return "Auftrag";
    case "study":
      return "Studie";
  }
}

export default function App() {
  const [activeRoomId, setActiveRoomId] = useState(exhibitionRooms[0].id);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(
    null
  );
  const [formState, setFormState] = useState<"idle" | "sent">("idle");
  const [stageTilt, setStageTilt] = useState({ x: "0deg", y: "0deg" });
  const touchStartX = useRef<number | null>(null);

  const activeRoom = roomById.get(activeRoomId) ?? exhibitionRooms[0];
  const selectedArtwork = selectedArtworkId
    ? (artworkById.get(selectedArtworkId) ?? null)
    : null;

  const activeArtwork = useMemo(() => {
    const firstId = activeRoom.artworkIds[0] ?? heroArtwork.id;
    return getArtwork(firstId);
  }, [activeRoom]);

  const goToRoom = useCallback((roomId: string | null): void => {
    if (!roomId || !roomById.has(roomId)) return;
    setActiveRoomId(roomId);
    setSelectedArtworkId(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedArtworkId(null);
      }
      if (event.key === "ArrowRight") {
        goToRoom(activeRoom.nextRoomId);
      }
      if (event.key === "ArrowLeft") {
        goToRoom(activeRoom.previousRoomId);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeRoom.nextRoomId, activeRoom.previousRoomId, goToRoom]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    event.currentTarget.reset();
    setFormState("sent");
  }

  function handleTouchStart(event: TouchEvent<HTMLElement>): void {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>): void {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 46) return;
    if (delta < 0) {
      goToRoom(activeRoom.nextRoomId);
    } else {
      goToRoom(activeRoom.previousRoomId);
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1);

    setStageTilt({
      x: `${(0.5 - y) * 3.2}deg`,
      y: `${(x - 0.5) * -4.2}deg`,
    });
  }

  return (
    <div className="bg-atelier-ink text-atelier-cream min-h-screen">
      <a className="skip-link" href="#exhibition">
        Zum Atelier
      </a>
      <SiteNav activeRoomId={activeRoomId} onRoomChange={goToRoom} />
      <main id="exhibition">
        <ExhibitionShell
          activeArtwork={activeArtwork}
          activeRoom={activeRoom}
          formState={formState}
          onArtworkSelect={setSelectedArtworkId}
          onContactSubmit={handleSubmit}
          onNextRoom={() => goToRoom(activeRoom.nextRoomId)}
          onPreviousRoom={() => goToRoom(activeRoom.previousRoomId)}
          onRoomChange={goToRoom}
          onStagePointerMove={handlePointerMove}
          stageTilt={stageTilt}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
          selectedArtwork={selectedArtwork}
        />
      </main>
    </div>
  );
}

function SiteNav({
  activeRoomId,
  onRoomChange,
}: {
  activeRoomId: string;
  onRoomChange: (roomId: string | null) => void;
}) {
  return (
    <header className="site-nav">
      <nav className="site-nav__inner" aria-label="Hauptnavigation">
        <button
          className="brand-button"
          type="button"
          onClick={() => onRoomChange(exhibitionRooms[0].id)}
        >
          Atelier Bella
        </button>
        <div className="room-tabs" role="list" aria-label="Ausstellungsraeume">
          {exhibitionRooms.map((room) => (
            <button
              aria-current={activeRoomId === room.id ? "page" : undefined}
              className="room-tab"
              key={room.id}
              type="button"
              onClick={() => onRoomChange(room.id)}
            >
              {room.kicker}
            </button>
          ))}
        </div>
        <button
          className="icon-cta"
          type="button"
          aria-label="Digitale Auktion oeffnen"
          onClick={() => onRoomChange("auction-room")}
        >
          <ShoppingBag size={18} />
        </button>
      </nav>
    </header>
  );
}

function ExhibitionShell({
  activeArtwork,
  activeRoom,
  formState,
  onArtworkSelect,
  onContactSubmit,
  onNextRoom,
  onPreviousRoom,
  onRoomChange,
  onStagePointerMove,
  stageTilt,
  onTouchEnd,
  onTouchStart,
  selectedArtwork,
}: {
  activeArtwork: Artwork;
  activeRoom: ExhibitionRoom;
  formState: "idle" | "sent";
  onArtworkSelect: (artworkId: string | null) => void;
  onContactSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNextRoom: () => void;
  onPreviousRoom: () => void;
  onRoomChange: (roomId: string | null) => void;
  onStagePointerMove: (event: PointerEvent<HTMLElement>) => void;
  stageTilt: { x: string; y: string };
  onTouchEnd: (event: TouchEvent<HTMLElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLElement>) => void;
  selectedArtwork: Artwork | null;
}) {
  return (
    <section
      className="exhibition-shell"
      aria-label="Virtuelle Ausstellung Atelier Bella"
      onPointerMove={onStagePointerMove}
      style={
        {
          "--stage-rotate-x": stageTilt.x,
          "--stage-rotate-y": stageTilt.y,
        } as CSSProperties
      }
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      <Watercolor
        className="exhibition-wash"
        width="100%"
        height="100%"
        color1="#0B1E2D"
        color2="#E64992"
        saturation={0.78}
        brightness={0.02}
        opacity={0.42}
        speed={0.18}
        scale={0.9}
        cursorInteraction
        cursorIntensity={0.35}
      />

      <div
        className={`exhibition-layout exhibition-layout--${activeRoom.purpose}`}
      >
        <ExhibitionCopy
          activeArtwork={activeArtwork}
          activeRoom={activeRoom}
          onNextRoom={onNextRoom}
          onPreviousRoom={onPreviousRoom}
        />

        <RoomStage
          activeRoom={activeRoom}
          formState={formState}
          onArtworkSelect={onArtworkSelect}
          onContactSubmit={onContactSubmit}
          onRoomChange={onRoomChange}
        />
      </div>

      <MobileDoorPath
        activeRoom={activeRoom}
        formState={formState}
        onArtworkSelect={onArtworkSelect}
        onContactSubmit={onContactSubmit}
        onNextRoom={onNextRoom}
        onPreviousRoom={onPreviousRoom}
      />

      {selectedArtwork ? (
        <ArtworkPanel
          artwork={selectedArtwork}
          onClose={() => onArtworkSelect(null)}
          onContact={() => {
            onArtworkSelect(null);
            onRoomChange("contact-room");
          }}
        />
      ) : null}
    </section>
  );
}

function ExhibitionCopy({
  activeArtwork,
  activeRoom,
  onNextRoom,
  onPreviousRoom,
}: {
  activeArtwork: Artwork;
  activeRoom: ExhibitionRoom;
  onNextRoom: () => void;
  onPreviousRoom: () => void;
}) {
  return (
    <aside className="exhibition-copy" aria-live="polite">
      <p className="section-kicker">{activeRoom.kicker}</p>
      <h1 className="exhibition-title">{activeRoom.title}</h1>
      <p className="exhibition-lede">{roomCopy[activeRoom.id]}</p>
      <div className="room-meta">
        <span>{activeArtwork.editionLabel}</span>
        <span>{activeArtwork.priceLabel}</span>
        <span>{getStatusLabel(activeArtwork.status)}</span>
      </div>
      <div className="room-actions">
        <button
          className="secondary-cta"
          type="button"
          disabled={!activeRoom.previousRoomId}
          onClick={onPreviousRoom}
        >
          <ArrowLeft size={17} />
          Zurueck
        </button>
        <button
          className="primary-cta"
          type="button"
          disabled={!activeRoom.nextRoomId}
          onClick={onNextRoom}
        >
          Weiter
          <ArrowRight size={17} />
        </button>
      </div>
    </aside>
  );
}

function RoomStage({
  activeRoom,
  formState,
  onArtworkSelect,
  onContactSubmit,
  onRoomChange,
}: {
  activeRoom: ExhibitionRoom;
  formState: "idle" | "sent";
  onArtworkSelect: (artworkId: string | null) => void;
  onContactSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRoomChange: (roomId: string | null) => void;
}) {
  if (activeRoom.purpose === "contact") {
    return (
      <div className="gallery-stage gallery-stage--contact">
        <GalleryArchitecture room={activeRoom} />
        <div className="contact-room-panel">
          <div>
            <p className="section-kicker">Kontakt</p>
            <h2>Schreib Bella.</h2>
            <p>
              Format, Raum, Motiv oder Besuchstermin reichen als Einstieg. Die
              Anfrage bleibt bewusst kurz.
            </p>
          </div>
          <ContactForm formState={formState} onSubmit={onContactSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`gallery-stage gallery-stage--${activeRoom.purpose} gallery-stage--${activeRoom.id}`}
      style={
        {
          "--room-accent": getArtwork(activeRoom.artworkIds[0]).accent,
        } as CSSProperties
      }
    >
      <GalleryArchitecture room={activeRoom} />
      <div className="room-wall-content">
        {activeRoom.artworkIds.map((id) => {
          const piece = getArtwork(id);

          return (
            <button
              className="room-frame"
              key={piece.id}
              style={{ "--art-accent": piece.accent } as CSSProperties}
              type="button"
              onClick={() => onArtworkSelect(piece.id)}
            >
              <span className="room-frame__image">
                <img
                  alt={piece.title}
                  src={piece.src}
                  width={piece.width}
                  height={piece.height}
                />
              </span>
              <span className="room-frame__label">
                <strong>{piece.title}</strong>
                <span>{piece.editionLabel}</span>
              </span>
            </button>
          );
        })}
      </div>
      {activeRoom.purpose === "buy" ? (
        <button
          className="door-hotspot door-hotspot--contact"
          type="button"
          onClick={() => onRoomChange("contact-room")}
        >
          <Mail size={16} />
          <span>Kontakt</span>
        </button>
      ) : (
        <button
          className="door-hotspot"
          type="button"
          onClick={() => onRoomChange(activeRoom.nextRoomId)}
        >
          <DoorOpen size={17} />
          <span>Weiter</span>
        </button>
      )}
    </div>
  );
}

function GalleryArchitecture({ room }: { room: ExhibitionRoom }) {
  return (
    <>
      <div className="gallery-ceiling" />
      <div className="gallery-masthead" aria-hidden="true">
        <strong>Atelier Bella</strong>
        <span>Online Collection</span>
      </div>
      <div className="gallery-back-wall">
        <span>{room.title}</span>
      </div>
      <div className="gallery-side-wall gallery-side-wall--left" />
      <div className="gallery-side-wall gallery-side-wall--right" />
      <div className="gallery-floor" />
    </>
  );
}

function MobileDoorPath({
  activeRoom,
  formState,
  onArtworkSelect,
  onContactSubmit,
  onNextRoom,
  onPreviousRoom,
}: {
  activeRoom: ExhibitionRoom;
  formState: "idle" | "sent";
  onArtworkSelect: (artworkId: string | null) => void;
  onContactSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNextRoom: () => void;
  onPreviousRoom: () => void;
}) {
  const pieces = activeRoom.artworkIds.map(getArtwork);
  const lead = pieces[0] ?? heroArtwork;

  return (
    <div className="mobile-path">
      <div className="mobile-room-card">
        <p className="section-kicker">{activeRoom.kicker}</p>
        <h2>{activeRoom.title}</h2>
        <p>{roomCopy[activeRoom.id]}</p>

        {activeRoom.purpose === "contact" ? (
          <ContactForm formState={formState} onSubmit={onContactSubmit} />
        ) : (
          <>
            <button
              className="mobile-door"
              type="button"
              onClick={() => onArtworkSelect(lead.id)}
            >
              <img
                alt={lead.title}
                src={lead.src}
                width={lead.width}
                height={lead.height}
              />
              <span>Bild oeffnen</span>
            </button>
            <div className="mobile-artwork-strip">
              {pieces.map((piece) => (
                <button
                  key={piece.id}
                  style={{ "--art-accent": piece.accent } as CSSProperties}
                  type="button"
                  onClick={() => onArtworkSelect(piece.id)}
                >
                  <img
                    alt=""
                    src={piece.src}
                    width={piece.width}
                    height={piece.height}
                  />
                  <span>{piece.editionLabel}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mobile-room-actions">
          <button
            className="secondary-cta"
            type="button"
            disabled={!activeRoom.previousRoomId}
            onClick={onPreviousRoom}
          >
            <ArrowLeft size={17} />
            Zurueck
          </button>
          <button
            className="primary-cta"
            type="button"
            disabled={!activeRoom.nextRoomId}
            onClick={onNextRoom}
          >
            Weiter
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ArtworkPanel({
  artwork,
  onClose,
  onContact,
}: {
  artwork: Artwork;
  onClose: () => void;
  onContact: () => void;
}) {
  const hasPaymentLink = artwork.paymentLink.length > 0;

  return (
    <div
      aria-labelledby="artwork-dialog-title"
      aria-modal="true"
      className="artwork-dialog"
      role="dialog"
    >
      <div className="artwork-dialog__backdrop" onClick={onClose} />
      <article className="artwork-dialog__panel">
        <button
          className="dialog-close"
          type="button"
          aria-label="Detailansicht schliessen"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <div className="detail-art">
          <img
            alt={artwork.title}
            height={artwork.height}
            src={artwork.src}
            width={artwork.width}
          />
        </div>
        <div className="detail-copy">
          <p className="section-kicker">{artwork.editionLabel}</p>
          <h2 id="artwork-dialog-title">{artwork.title}</h2>
          <p>{artwork.copy}</p>
          <dl className="detail-meta">
            <div>
              <dt>Format</dt>
              <dd>{artwork.size}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{getStatusLabel(artwork.status)}</dd>
            </div>
            <div>
              <dt>Auktion</dt>
              <dd>{artwork.priceLabel}</dd>
            </div>
          </dl>
          {hasPaymentLink ? (
            <a
              className="primary-cta detail-payment"
              href={artwork.paymentLink}
              rel="noreferrer"
              target="_blank"
            >
              Mit Stripe bieten
              <ShoppingBag size={18} />
            </a>
          ) : (
            <div className="missing-payment">
              <button className="disabled-cta" type="button" disabled>
                Stripe link fehlt
              </button>
              <button
                className="secondary-cta"
                type="button"
                onClick={onContact}
              >
                Bella kontaktieren
                <Mail size={17} />
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function ContactForm({
  formState,
  onSubmit,
}: {
  formState: "idle" | "sent";
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label>
        Name
        <input required name="name" autoComplete="name" />
      </label>
      <label>
        E-Mail
        <input required name="email" type="email" autoComplete="email" />
      </label>
      <label>
        Anfrage
        <select name="request" defaultValue="Digitales Bild">
          <option>Digitales Bild</option>
          <option>Auftrag</option>
          <option>Atelierbesuch</option>
          <option>Stripe-Link fehlt</option>
        </select>
      </label>
      <label>
        Nachricht
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Bild, Format, Motividee oder Zeitfenster"
        />
      </label>
      <button className="primary-cta contact-submit" type="submit">
        Anfrage senden
        <Sparkles size={17} />
      </button>
      {formState === "sent" ? (
        <p className="form-state">Anfrage notiert. Bella meldet sich direkt.</p>
      ) : null}
    </form>
  );
}
