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
  /** Let the pointer bend the flow toward the cursor. */
  cursorInteraction?: boolean;
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
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime;

    // Pull the field toward the pointer, falling off with distance.
    vec2 toPointer = uPointer - uv;
    p += toPointer * uPointerStrength * exp(-4.0 * dot(toPointer, toPointer));

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

type SceneProps = Required<
  Omit<SwirlBlendProps, "width" | "height" | "className">
>;

const Scene: React.FC<SceneProps> = ({
  speed,
  scale,
  iterations,
  cursorInteraction,
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
  const pointerStrength = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerStrength: { value: 0 },
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
      pointer.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
      pointerStrength.current = 0.12;
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
    m.uniforms.uTime.value += delta * speed;
    m.uniforms.uResolution.value.set(size.width, size.height);
    m.uniforms.uPointer.value.lerp(pointer.current, 0.06);
    // Ease the pointer influence back to rest so the field settles when idle.
    pointerStrength.current *= 0.97;
    m.uniforms.uPointerStrength.value = pointerStrength.current;
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
