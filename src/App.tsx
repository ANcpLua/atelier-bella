import {
  ArrowLeft,
  ArrowRight,
  DoorOpen,
  Mail,
  Palette,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import type { CSSProperties, FormEvent, PointerEvent, TouchEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Watercolor, {
  type WatercolorProps,
} from "@/components/react-bits/watercolor";
import WarpTwister, {
  type WarpTwisterProps,
} from "@/components/react-bits/warp-twister";
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
    "Die erste Wand haengt wie ein warmer Auftakt: Frucht, Farbe und ruhiges Atelierlicht.",
  "side-room":
    "Studien und Crops zeigen Pinselspur, Schichtung und kleine helle Momente.",
  "auction-room":
    "Jedes Bild bleibt einzeln erreichbar. Wenn ein Link noch fehlt, geht die Anfrage direkt zu Bella.",
  "contact-room":
    "Fuer Auftraege, Besuche oder ein Bild, das du in Ruhe besprechen willst.",
};

type ThemeVariables = CSSProperties & Record<`--${string}`, string | number>;

type WatercolorTheme = Required<
  Pick<
    WatercolorProps,
    | "color1"
    | "color2"
    | "saturation"
    | "brightness"
    | "opacity"
    | "speed"
    | "scale"
    | "cursorIntensity"
  >
>;

type WarpTheme = Required<
  Pick<
    WarpTwisterProps,
    | "radius"
    | "narrow"
    | "length"
    | "hazeSpeed"
    | "dustSpeed"
    | "hazeStrength"
    | "hazeFrequency"
    | "dustDensity"
    | "dustSize"
    | "dustOpacity"
    | "edgeFade"
    | "spiralTight"
    | "rotSpeed"
    | "baseColor"
    | "cameraDistance"
  >
>;

type ExhibitionTheme = {
  id: string;
  name: string;
  description: string;
  swatch: string;
  variables: ThemeVariables;
  watercolor: WatercolorTheme;
  warp: WarpTheme;
};

const exhibitionThemes: ExhibitionTheme[] = [
  {
    id: "warm",
    name: "Warm",
    description: "Pfirsich, Pink, Tuerkis",
    swatch: "linear-gradient(135deg, #f4b37d, #d976a2 54%, #7fd8c6)",
    variables: {
      "--theme-ink": "#17100f",
      "--theme-ink-rgb": "23, 16, 15",
      "--theme-night": "#241816",
      "--theme-wall": "#34251f",
      "--theme-wall-rgb": "52, 37, 31",
      "--theme-floor": "#1d1512",
      "--theme-door": "#100908",
      "--theme-door-rgb": "16, 9, 8",
      "--theme-text": "#f7f3ea",
      "--theme-text-rgb": "247, 243, 234",
      "--theme-muted": "#d0c3b8",
      "--theme-accent": "#7fd8c6",
      "--theme-accent-rgb": "127, 216, 198",
      "--theme-secondary": "#d976a2",
      "--theme-secondary-rgb": "217, 118, 162",
      "--theme-primary": "#d7e891",
      "--theme-primary-rgb": "215, 232, 145",
      "--theme-primary-text": "#17100f",
      "--theme-gilt": "#c99a5b",
      "--theme-gilt-rgb": "201, 154, 91",
      "--theme-frame": "#f7f3ea",
      "--theme-panel": "rgba(23, 16, 15, 0.78)",
    },
    watercolor: {
      color1: "#3A211A",
      color2: "#D976A2",
      saturation: 0.5,
      brightness: 0.08,
      opacity: 0.34,
      speed: 0.16,
      scale: 0.72,
      cursorIntensity: 0.18,
    },
    warp: {
      radius: 1.65,
      narrow: 2.35,
      length: 8.2,
      hazeSpeed: 0.18,
      dustSpeed: 0.12,
      hazeStrength: 0.16,
      hazeFrequency: 34,
      dustDensity: 155,
      dustSize: 48,
      dustOpacity: 0.055,
      edgeFade: 2.4,
      spiralTight: 0.18,
      rotSpeed: 0.026,
      baseColor: [0.86, 0.55, 0.36],
      cameraDistance: 9.6,
    },
  },
  {
    id: "lagoon",
    name: "Lagune",
    description: "Tuerkis, Lime, Nachtblau",
    swatch: "linear-gradient(135deg, #06242b, #28d8d4 48%, #b7f26d)",
    variables: {
      "--theme-ink": "#061416",
      "--theme-ink-rgb": "6, 20, 22",
      "--theme-night": "#092126",
      "--theme-wall": "#0e3840",
      "--theme-wall-rgb": "14, 56, 64",
      "--theme-floor": "#061012",
      "--theme-door": "#031010",
      "--theme-door-rgb": "3, 16, 16",
      "--theme-text": "#f4fff9",
      "--theme-text-rgb": "244, 255, 249",
      "--theme-muted": "#b8d2d0",
      "--theme-accent": "#28d8d4",
      "--theme-accent-rgb": "40, 216, 212",
      "--theme-secondary": "#e64992",
      "--theme-secondary-rgb": "230, 73, 146",
      "--theme-primary": "#b7f26d",
      "--theme-primary-rgb": "183, 242, 109",
      "--theme-primary-text": "#071016",
      "--theme-gilt": "#65cfc7",
      "--theme-gilt-rgb": "101, 207, 199",
      "--theme-frame": "#f7f3ea",
      "--theme-panel": "rgba(6, 20, 22, 0.8)",
    },
    watercolor: {
      color1: "#092126",
      color2: "#28D8D4",
      saturation: 0.72,
      brightness: 0.04,
      opacity: 0.38,
      speed: 0.15,
      scale: 0.76,
      cursorIntensity: 0.22,
    },
    warp: {
      radius: 1.7,
      narrow: 2.45,
      length: 8.4,
      hazeSpeed: 0.16,
      dustSpeed: 0.11,
      hazeStrength: 0.2,
      hazeFrequency: 36,
      dustDensity: 160,
      dustSize: 46,
      dustOpacity: 0.06,
      edgeFade: 2.45,
      spiralTight: 0.2,
      rotSpeed: 0.024,
      baseColor: [0.18, 0.85, 0.8],
      cameraDistance: 9.7,
    },
  },
  {
    id: "twilight",
    name: "Twilight",
    description: "Cyan, Magenta, Violett",
    swatch: "linear-gradient(135deg, #28d8d4, #e64992 48%, #7c4dff)",
    variables: {
      "--theme-ink": "#130b19",
      "--theme-ink-rgb": "19, 11, 25",
      "--theme-night": "#21132e",
      "--theme-wall": "#34205a",
      "--theme-wall-rgb": "52, 32, 90",
      "--theme-floor": "#110a17",
      "--theme-door": "#090711",
      "--theme-door-rgb": "9, 7, 17",
      "--theme-text": "#fff7fb",
      "--theme-text-rgb": "255, 247, 251",
      "--theme-muted": "#d0c1df",
      "--theme-accent": "#28d8d4",
      "--theme-accent-rgb": "40, 216, 212",
      "--theme-secondary": "#e64992",
      "--theme-secondary-rgb": "230, 73, 146",
      "--theme-primary": "#f3b6ff",
      "--theme-primary-rgb": "243, 182, 255",
      "--theme-primary-text": "#130b19",
      "--theme-gilt": "#a58bff",
      "--theme-gilt-rgb": "165, 139, 255",
      "--theme-frame": "#fff7fb",
      "--theme-panel": "rgba(19, 11, 25, 0.82)",
    },
    watercolor: {
      color1: "#2A1648",
      color2: "#E64992",
      saturation: 0.86,
      brightness: 0.08,
      opacity: 0.4,
      speed: 0.14,
      scale: 0.7,
      cursorIntensity: 0.2,
    },
    warp: {
      radius: 1.58,
      narrow: 2.25,
      length: 8.1,
      hazeSpeed: 0.14,
      dustSpeed: 0.1,
      hazeStrength: 0.19,
      hazeFrequency: 32,
      dustDensity: 145,
      dustSize: 50,
      dustOpacity: 0.052,
      edgeFade: 2.35,
      spiralTight: 0.21,
      rotSpeed: 0.022,
      baseColor: [0.82, 0.28, 0.92],
      cameraDistance: 9.5,
    },
  },
  {
    id: "coffee",
    name: "Coffee",
    description: "Espresso, Karamell, Creme",
    swatch: "linear-gradient(135deg, #170f0a, #9a6334 54%, #f2d9b2)",
    variables: {
      "--theme-ink": "#170f0a",
      "--theme-ink-rgb": "23, 15, 10",
      "--theme-night": "#24140d",
      "--theme-wall": "#4c2b19",
      "--theme-wall-rgb": "76, 43, 25",
      "--theme-floor": "#1a100a",
      "--theme-door": "#0f0805",
      "--theme-door-rgb": "15, 8, 5",
      "--theme-text": "#fff6e8",
      "--theme-text-rgb": "255, 246, 232",
      "--theme-muted": "#d8c0a6",
      "--theme-accent": "#7fd8c6",
      "--theme-accent-rgb": "127, 216, 198",
      "--theme-secondary": "#e98fa1",
      "--theme-secondary-rgb": "233, 143, 161",
      "--theme-primary": "#f2d9b2",
      "--theme-primary-rgb": "242, 217, 178",
      "--theme-primary-text": "#170f0a",
      "--theme-gilt": "#c78b45",
      "--theme-gilt-rgb": "199, 139, 69",
      "--theme-frame": "#fff2df",
      "--theme-panel": "rgba(23, 15, 10, 0.8)",
    },
    watercolor: {
      color1: "#4C2B19",
      color2: "#E98FA1",
      saturation: 0.5,
      brightness: 0.07,
      opacity: 0.33,
      speed: 0.13,
      scale: 0.78,
      cursorIntensity: 0.16,
    },
    warp: {
      radius: 1.66,
      narrow: 2.38,
      length: 8.1,
      hazeSpeed: 0.13,
      dustSpeed: 0.1,
      hazeStrength: 0.15,
      hazeFrequency: 31,
      dustDensity: 150,
      dustSize: 48,
      dustOpacity: 0.052,
      edgeFade: 2.42,
      spiralTight: 0.16,
      rotSpeed: 0.019,
      baseColor: [0.76, 0.48, 0.24],
      cameraDistance: 9.8,
    },
  },
  {
    id: "royal",
    name: "Royal",
    description: "Blau, Petrol, Pink",
    swatch: "linear-gradient(135deg, #061016, #1f6fa8 48%, #28d8d4)",
    variables: {
      "--theme-ink": "#061016",
      "--theme-ink-rgb": "6, 16, 22",
      "--theme-night": "#071c24",
      "--theme-wall": "#0d3249",
      "--theme-wall-rgb": "13, 50, 73",
      "--theme-floor": "#050e15",
      "--theme-door": "#03090e",
      "--theme-door-rgb": "3, 9, 14",
      "--theme-text": "#f4fbff",
      "--theme-text-rgb": "244, 251, 255",
      "--theme-muted": "#b7c9d5",
      "--theme-accent": "#28d8d4",
      "--theme-accent-rgb": "40, 216, 212",
      "--theme-secondary": "#e64992",
      "--theme-secondary-rgb": "230, 73, 146",
      "--theme-primary": "#b7f26d",
      "--theme-primary-rgb": "183, 242, 109",
      "--theme-primary-text": "#061016",
      "--theme-gilt": "#7bb9d6",
      "--theme-gilt-rgb": "123, 185, 214",
      "--theme-frame": "#f7f3ea",
      "--theme-panel": "rgba(6, 16, 22, 0.82)",
    },
    watercolor: {
      color1: "#0D3249",
      color2: "#28D8D4",
      saturation: 0.62,
      brightness: 0.05,
      opacity: 0.36,
      speed: 0.14,
      scale: 0.74,
      cursorIntensity: 0.18,
    },
    warp: {
      radius: 1.72,
      narrow: 2.5,
      length: 8.5,
      hazeSpeed: 0.15,
      dustSpeed: 0.11,
      hazeStrength: 0.18,
      hazeFrequency: 35,
      dustDensity: 158,
      dustSize: 48,
      dustOpacity: 0.056,
      edgeFade: 2.45,
      spiralTight: 0.2,
      rotSpeed: 0.023,
      baseColor: [0.15, 0.55, 0.88],
      cameraDistance: 9.7,
    },
  },
];

function getInitialThemeId(): string {
  if (typeof window === "undefined") return exhibitionThemes[0].id;

  const storedThemeId = window.localStorage.getItem("atelier-theme");
  return exhibitionThemes.some((theme) => theme.id === storedThemeId)
    ? (storedThemeId ?? exhibitionThemes[0].id)
    : exhibitionThemes[0].id;
}

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

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default function App() {
  const [activeThemeId, setActiveThemeId] = useState(getInitialThemeId);
  const [activeRoomId, setActiveRoomId] = useState(exhibitionRooms[0].id);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(
    null
  );
  const [formState, setFormState] = useState<"idle" | "sent">("idle");
  const [stageTilt, setStageTilt] = useState({ x: "0deg", y: "0deg" });
  const touchStartX = useRef<number | null>(null);

  const activeRoom = roomById.get(activeRoomId) ?? exhibitionRooms[0];
  const activeTheme =
    exhibitionThemes.find((theme) => theme.id === activeThemeId) ??
    exhibitionThemes[0];
  const selectedArtwork = selectedArtworkId
    ? (artworkById.get(selectedArtworkId) ?? null)
    : null;

  useEffect(() => {
    window.localStorage.setItem("atelier-theme", activeTheme.id);
  }, [activeTheme.id]);

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
    <div
      className="app-root"
      data-theme={activeTheme.id}
      style={activeTheme.variables}
    >
      <a className="skip-link" href="#exhibition">
        Zum Atelier
      </a>
      <SiteNav activeRoomId={activeRoomId} onRoomChange={goToRoom} />
      <main id="exhibition">
        <ExhibitionShell
          activeRoom={activeRoom}
          activeTheme={activeTheme}
          formState={formState}
          onArtworkSelect={setSelectedArtworkId}
          onContactSubmit={handleSubmit}
          onNextRoom={() => goToRoom(activeRoom.nextRoomId)}
          onPreviousRoom={() => goToRoom(activeRoom.previousRoomId)}
          onRoomChange={goToRoom}
          onStagePointerMove={handlePointerMove}
          onThemeChange={setActiveThemeId}
          stageTilt={stageTilt}
          themes={exhibitionThemes}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        />
      </main>
      {selectedArtwork ? (
        <ArtworkPanel
          artwork={selectedArtwork}
          onClose={() => setSelectedArtworkId(null)}
          onContact={() => {
            setSelectedArtworkId(null);
            goToRoom("contact-room");
          }}
        />
      ) : null}
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
  activeRoom,
  activeTheme,
  formState,
  onArtworkSelect,
  onContactSubmit,
  onNextRoom,
  onPreviousRoom,
  onRoomChange,
  onStagePointerMove,
  onThemeChange,
  stageTilt,
  themes,
  onTouchEnd,
  onTouchStart,
}: {
  activeRoom: ExhibitionRoom;
  activeTheme: ExhibitionTheme;
  formState: "idle" | "sent";
  onArtworkSelect: (artworkId: string | null) => void;
  onContactSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNextRoom: () => void;
  onPreviousRoom: () => void;
  onRoomChange: (roomId: string | null) => void;
  onStagePointerMove: (event: PointerEvent<HTMLElement>) => void;
  onThemeChange: (themeId: string) => void;
  stageTilt: { x: string; y: string };
  themes: ExhibitionTheme[];
  onTouchEnd: (event: TouchEvent<HTMLElement>) => void;
  onTouchStart: (event: TouchEvent<HTMLElement>) => void;
}) {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );
  const canShowDesktopMotion = useMediaQuery("(min-width: 900px)");
  const showAmbientMotion = !prefersReducedMotion;
  const showWarpTwister = showAmbientMotion && canShowDesktopMotion;

  return (
    <section
      className="exhibition-shell"
      aria-label="Virtuelle Ausstellung Atelier Bella"
      onPointerMove={onStagePointerMove}
      style={
        {
          "--stage-rotate-x": stageTilt.x,
          "--stage-rotate-y": stageTilt.y,
        } as ThemeVariables
      }
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      {showAmbientMotion ? (
        <Watercolor
          className="exhibition-wash"
          width="100%"
          height="100%"
          color1={activeTheme.watercolor.color1}
          color2={activeTheme.watercolor.color2}
          saturation={activeTheme.watercolor.saturation}
          brightness={activeTheme.watercolor.brightness}
          opacity={activeTheme.watercolor.opacity}
          speed={activeTheme.watercolor.speed}
          scale={activeTheme.watercolor.scale}
          cursorInteraction={canShowDesktopMotion}
          cursorIntensity={activeTheme.watercolor.cursorIntensity}
        />
      ) : null}

      {showWarpTwister ? (
        <WarpTwister
          className="exhibition-twister"
          radius={activeTheme.warp.radius}
          narrow={activeTheme.warp.narrow}
          length={activeTheme.warp.length}
          hazeSpeed={activeTheme.warp.hazeSpeed}
          dustSpeed={activeTheme.warp.dustSpeed}
          hazeStrength={activeTheme.warp.hazeStrength}
          hazeFrequency={activeTheme.warp.hazeFrequency}
          dustDensity={activeTheme.warp.dustDensity}
          dustSize={activeTheme.warp.dustSize}
          dustOpacity={activeTheme.warp.dustOpacity}
          edgeFade={activeTheme.warp.edgeFade}
          spiralTight={activeTheme.warp.spiralTight}
          rotSpeed={activeTheme.warp.rotSpeed}
          baseColor={activeTheme.warp.baseColor}
          cameraDistance={activeTheme.warp.cameraDistance}
        />
      ) : null}

      <div
        className={`exhibition-layout exhibition-layout--${activeRoom.purpose}`}
      >
        <ExhibitionCopy
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

      <ThemeSwitcher
        activeThemeId={activeTheme.id}
        onThemeChange={onThemeChange}
        themes={themes}
      />

      <MobileDoorPath
        activeRoom={activeRoom}
        formState={formState}
        onArtworkSelect={onArtworkSelect}
        onContactSubmit={onContactSubmit}
        onNextRoom={onNextRoom}
        onPreviousRoom={onPreviousRoom}
      />
    </section>
  );
}

function ThemeSwitcher({
  activeThemeId,
  onThemeChange,
  themes,
}: {
  activeThemeId: string;
  onThemeChange: (themeId: string) => void;
  themes: ExhibitionTheme[];
}) {
  return (
    <aside className="theme-switcher" aria-label="Farbwelt">
      <div className="theme-switcher__title">
        <Palette size={15} aria-hidden="true" />
        <span>Farbwelt</span>
      </div>
      <div
        className="theme-switcher__options"
        role="radiogroup"
        aria-label="Ausstellungsfarbe waehlen"
      >
        {themes.map((theme) => (
          <button
            aria-checked={activeThemeId === theme.id}
            className="theme-option"
            key={theme.id}
            role="radio"
            type="button"
            onClick={() => onThemeChange(theme.id)}
          >
            <span
              aria-hidden="true"
              className="theme-option__swatch"
              style={{ background: theme.swatch }}
            />
            <span className="theme-option__copy">
              <strong>{theme.name}</strong>
              <span>{theme.description}</span>
            </span>
            <span className="theme-option__dot" aria-hidden="true" />
          </button>
        ))}
      </div>
    </aside>
  );
}

function ExhibitionCopy({
  activeRoom,
  onNextRoom,
  onPreviousRoom,
}: {
  activeRoom: ExhibitionRoom;
  onNextRoom: () => void;
  onPreviousRoom: () => void;
}) {
  return (
    <aside className="exhibition-copy" aria-live="polite">
      <p className="section-kicker">{activeRoom.kicker}</p>
      <h1 className="exhibition-title">{activeRoom.title}</h1>
      <div className="room-actions">
        <button
          className="secondary-cta"
          type="button"
          aria-label="Vorheriger Raum"
          disabled={!activeRoom.previousRoomId}
          onClick={onPreviousRoom}
        >
          <ArrowLeft size={15} />
        </button>
        <button
          className="primary-cta"
          type="button"
          aria-label="Naechster Raum"
          disabled={!activeRoom.nextRoomId}
          onClick={onNextRoom}
        >
          <ArrowRight size={15} />
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
        <GalleryArchitecture />
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
      <GalleryArchitecture />
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

function GalleryArchitecture() {
  return (
    <>
      <div className="gallery-ceiling" />
      <div className="gallery-masthead" aria-hidden="true">
        <strong>Atelier Bella</strong>
        <span>Online Atelier</span>
      </div>
      <div className="gallery-back-wall" aria-hidden="true" />
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
