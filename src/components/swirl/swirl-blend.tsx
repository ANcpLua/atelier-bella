"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

export interface SwirlBlendProps {
  /** Container width */
  width?: string | number;
  /** Container height */
  height?: string | number;
  className?: string;
  /** Animation rate; 0 freezes the field (respect prefers-reduced-motion). */
  speed?: number;
  /** Spatial frequency of the noise field. */
  scale?: number;
  /** fBm octaves. Cost is linear in this. */
  iterations?: number;
  /** Let the pointer curl the flow around the cursor. */
  cursorInteraction?: boolean;
  /** Gaussian falloff of the curl. Higher = tighter, more local. */
  pointerRadius?: number;
  backgroundColor?: string;
  paletteBaseR?: number;
  paletteBaseG?: number;
  paletteBaseB?: number;
  paletteAmpR?: number;
  paletteAmpG?: number;
  paletteAmpB?: number;
  palettePhaseR?: number;
  palettePhaseG?: number;
  palettePhaseB?: number;
}

// The plane is authored in clip space directly, so no camera matrices are
// applied. planeGeometry(2, 2) therefore spans exactly -1..1 — a full-screen quad.
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Value-noise fBm with two domain-warp passes. The warp is what produces the
 * swirl: each pass offsets the sample point by an fBm evaluated at that same
 * point, so the field folds into itself instead of merely scrolling.
 * Colour comes from the cosine palette base + amp * cos(2pi * (phase + t)).
 */
const FRAG = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uPointer;
  uniform float uPointerStrength;
  uniform float uPointerRadius;
  uniform float uScale;
  uniform int   uIterations;
  uniform vec3  uBackground;
  uniform vec3  uBase;
  uniform vec3  uAmp;
  uniform vec3  uPhase;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 12; i++) {
      if (i >= octaves) break;
      sum += amp * valueNoise(p);
      p = rot * p * 2.02;
      amp *= 0.5;
    }
    return sum;
  }

  void main() {
    // Aspect-correct so the swirl does not stretch on wide viewports.
    vec2 uv = vUv;
    float ar = uResolution.x / uResolution.y;
    vec2 p = (uv - 0.5) * vec2(ar, 1.0);

    float t = uTime;

    // Curl the field AROUND the pointer instead of dragging it toward the
    // pointer. Translating samples toward the cursor contracts the domain and
    // bunches the noise into a knot; a rotation has determinant 1, so it bends
    // the flow without compressing it.
    //
    // The pointer is lifted into the same aspect-corrected space as p first.
    // Mixing uv-space (unit square) with aspect-space made the falloff an
    // ellipse and scaled the x displacement by 1/ar, which is why the effect
    // read as flat and smeared on a wide viewport.
    vec2 pp = (uPointer - 0.5) * vec2(ar, 1.0);
    vec2 d = p - pp;
    float fall = exp(-uPointerRadius * dot(d, d));   // circular on screen
    float ang = uPointerStrength * fall;
    float sa = sin(ang), ca = cos(ang);
    p = pp + mat2(ca, -sa, sa, ca) * d;

    vec2 sp = p * uScale;

    // Two-pass domain warp.
    vec2 q = vec2(fbm(sp + vec2(0.0, 0.0), uIterations),
                  fbm(sp + vec2(5.2, 1.3), uIterations));

    vec2 r = vec2(fbm(sp + 4.0 * q + vec2(1.7, 9.2) + 0.15 * t, uIterations),
                  fbm(sp + 4.0 * q + vec2(8.3, 2.8) + 0.126 * t, uIterations));

    float f = fbm(sp + 4.0 * r, uIterations);

    // Cosine palette (Inigo Quilez): base + amp * cos(2pi * (phase + f)).
    vec3 col = uBase + uAmp * cos(6.28318530718 * (uPhase + f));

    // Fold the warp magnitude back in as luminance detail, then seat the whole
    // thing on the background colour so the hero's scrims stay predictable.
    // fbm() with 0.5 gain sums to well under 1, so renormalise before shaping
    // rather than assuming a 0..1 range.
    float shade = clamp(f * 1.9, 0.0, 1.0);
    col *= 0.65 + 0.7 * clamp(length(r) * 1.4, 0.0, 1.0);
    col = mix(uBackground, col, smoothstep(0.02, 0.55, shade));

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Peak curl at the cursor, in radians. Past ~0.6 the noise visibly shears. */
const pointerStrength_MAX = 0.55;
/** How much a unit of pointer travel (in uv) adds to the target curl. */
const pointerStrength_GAIN = 2.2;
/** Seconds for the curl centre to catch the cursor (63% of the way). */
const POINTER_TAU = 0.07;
/** Seconds for the curl amount to reach/release its target. */
const STRENGTH_TAU = 0.16;

type SceneProps = Required<
  Omit<SwirlBlendProps, "width" | "height" | "className">
>;

const Scene: React.FC<SceneProps> = ({
  speed,
  scale,
  iterations,
  cursorInteraction,
  pointerRadius,
  backgroundColor,
  paletteBaseR,
  paletteBaseG,
  paletteBaseB,
  paletteAmpR,
  paletteAmpG,
  paletteAmpB,
  palettePhaseR,
  palettePhaseG,
  palettePhaseB,
}) => {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  /** Radians of curl at the cursor, eased toward `targetStrength`. */
  const pointerStrength = useRef(0);
  const targetStrength = useRef(0);
  const lastPointer = useRef(new THREE.Vector2(0.5, 0.5));
  const lastMoveAt = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerStrength: { value: 0 },
      uPointerRadius: { value: pointerRadius },
      uScale: { value: scale },
      uIterations: { value: iterations },
      uBackground: { value: new THREE.Color(backgroundColor) },
      uBase: {
        value: new THREE.Vector3(paletteBaseR, paletteBaseG, paletteBaseB),
      },
      uAmp: { value: new THREE.Vector3(paletteAmpR, paletteAmpG, paletteAmpB) },
      uPhase: {
        value: new THREE.Vector3(palettePhaseR, palettePhaseG, palettePhaseB),
      },
    }),
    // Palette props are keyed on `p.id` upstream, so a change remounts the scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!cursorInteraction) return;
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;

      // Drive the curl from pointer *speed*, not from the bare fact of a move.
      // A slow drift barely bends the field; a flick opens it up. Without this
      // the strength snapped to a constant on every event while the position
      // eased in slowly, so the distortion visibly trailed the cursor.
      const dx = x - lastPointer.current.x;
      const dy = y - lastPointer.current.y;
      const dist = Math.hypot(dx, dy);
      lastPointer.current.set(x, y);
      lastMoveAt.current = performance.now();

      pointer.current.set(x, y);
      targetStrength.current = Math.min(
        pointerStrength_MAX,
        targetStrength.current + dist * pointerStrength_GAIN
      );
    },
    [cursorInteraction]
  );

  React.useEffect(() => {
    if (!cursorInteraction) return;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [cursorInteraction, onPointerMove]);

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    // Clamp: a backgrounded tab can hand back a multi-second delta on resume.
    const dt = Math.min(delta, 1 / 30);

    m.uniforms.uTime.value += dt * speed;
    m.uniforms.uResolution.value.set(size.width, size.height);

    // Frame-rate independent easing. `1 - exp(-dt/tau)` gives the same settling
    // time at 60Hz and 120Hz; the old per-frame 0.06 / 0.97 constants decayed
    // twice as fast on a 120Hz display.
    const follow = 1 - Math.exp(-dt / POINTER_TAU);
    m.uniforms.uPointer.value.lerp(pointer.current, follow);

    // Bleed the curl away once the pointer rests, so the field settles.
    if (performance.now() - lastMoveAt.current > 90) targetStrength.current = 0;

    const ease = 1 - Math.exp(-dt / STRENGTH_TAU);
    pointerStrength.current +=
      (targetStrength.current - pointerStrength.current) * ease;
    m.uniforms.uPointerStrength.value = pointerStrength.current;
    m.uniforms.uPointerRadius.value = pointerRadius;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

const SwirlBlend: React.FC<SwirlBlendProps> = ({
  width = "100%",
  height = "100%",
  className,
  speed = 0.5,
  scale = 7,
  iterations = 5,
  cursorInteraction = true,
  pointerRadius = 9,
  backgroundColor = "#0a0a0a",
  paletteBaseR = 0.5,
  paletteBaseG = 0.5,
  paletteBaseB = 0.5,
  paletteAmpR = 0.5,
  paletteAmpG = 0.5,
  paletteAmpB = 0.5,
  palettePhaseR = 0,
  palettePhaseG = 0.33,
  palettePhaseB = 0.67,
}) => (
  <div
    className={cn("relative", className)}
    style={{ width, height }}
    aria-hidden="true"
  >
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      // Any `style` here replaces R3F's defaults, so width/height must be
      // restated or the canvas falls back to the HTML default 300x150.
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <Scene
        speed={speed}
        scale={scale}
        iterations={iterations}
        cursorInteraction={cursorInteraction}
        pointerRadius={pointerRadius}
        backgroundColor={backgroundColor}
        paletteBaseR={paletteBaseR}
        paletteBaseG={paletteBaseG}
        paletteBaseB={paletteBaseB}
        paletteAmpR={paletteAmpR}
        paletteAmpG={paletteAmpG}
        paletteAmpB={paletteAmpB}
        palettePhaseR={palettePhaseR}
        palettePhaseG={palettePhaseG}
        palettePhaseB={palettePhaseB}
      />
    </Canvas>
  </div>
);

export default SwirlBlend;
