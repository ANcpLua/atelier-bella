import SwirlBlend from "@/components/react-bits/swirl-blend";

/**
 * Standalone preview of the React Bits "Swirl Blend" shader as a full-bleed
 * hero — reachable at `/#swirl` without touching the gallery app. Throwaway
 * preview; promote into the real hero or delete once the direction is settled.
 */
export default function SwirlDemo() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <SwirlBlend
        className="absolute inset-0"
        speed={0.5}
        scale={7}
        iterations={5}
        cursorInteraction
        backgroundColor="#0a0a0a"
        // Warm "Atelier Bella" palette (peach / coral / golden)
        paletteBaseR={0.62}
        paletteBaseG={0.45}
        paletteBaseB={0.42}
        paletteAmpR={0.42}
        paletteAmpG={0.36}
        paletteAmpB={0.32}
        palettePhaseR={0.0}
        palettePhaseG={0.12}
        palettePhaseB={0.24}
      />

      {/* legibility veil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <div className="absolute inset-0 flex flex-col justify-center px-[7vw]">
        <p className="mb-5 text-sm font-medium tracking-[0.35em] text-white/70 uppercase">
          Online Atelier
        </p>
        <h1 className="max-w-[16ch] text-6xl leading-[1.02] font-semibold tracking-tight text-white md:text-8xl">
          Atelier Bella
        </h1>
        <p className="mt-7 max-w-[42ch] text-lg text-white/80 md:text-xl">
          Malerei, die atmet — Farbwelten zum Mitnehmen, jede Leinwand ein
          eigenes Licht.
        </p>
      </div>
    </div>
  );
}
