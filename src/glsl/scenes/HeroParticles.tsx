'use client'

import { useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/core/store'

const VERTEX_SHADER = `
attribute float a_size;
attribute float a_phase;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouseSpeed;
uniform float u_pixelRatio;

varying float v_alpha;
varying float v_distToMouse;

void main() {
  // 1. Organic drift — sine wave per particle using individual phase offset
  vec3 pos = position;
  float t = u_time * 0.4 + a_phase;
  pos.x += sin(t * 0.7 + a_phase * 2.1) * 0.08;
  pos.y += cos(t * 0.5 + a_phase * 1.7) * 0.06;
  pos.z += sin(t * 0.3 + a_phase * 0.9) * 0.04;

  // 2. Get clip position AFTER drift to measure accurate screen-space distance
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec2 ndcPos  = clipPos.xy / clipPos.w;

  // 3. Mouse repulsion — computed in screen/NDC space for accuracy
  float dist         = distance(ndcPos, u_mouse);
  float repelRadius  = 0.25 + u_mouseSpeed * 0.004;
  float repelStrength = smoothstep(repelRadius, 0.0, dist);
  vec2 repelDir      = normalize(ndcPos - u_mouse + vec2(0.0001));
  float force        = repelStrength * (0.15 + u_mouseSpeed * 0.002);

  // 4. Apply displacement in clip space (w-division corrected)
  // Convert NDC displacement back to clip space by multiplying by w
  vec2 ndcDisplace = repelDir * force;
  clipPos.xy += ndcDisplace * clipPos.w;

  // 5. Final position — use the clip-space displaced position directly
  gl_Position = clipPos;

  // 6. Particle size based on proximity
  float proximityBoost = smoothstep(0.5, 0.0, dist) * 2.5;
  gl_PointSize = (a_size + proximityBoost) * u_pixelRatio;

  // 7. Varyings to fragment shader
  v_alpha        = 0.4 + smoothstep(0.4, 0.0, dist) * 0.6;
  v_distToMouse  = dist;
}
`

const FRAGMENT_SHADER = `
uniform vec3 u_colorBase;
uniform vec3 u_colorAccent;
uniform float u_time;

varying float v_alpha;
varying float v_distToMouse;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  if (dist > 0.5) discard;

  float strength = 1.0 - smoothstep(0.0, 0.5, dist);
  strength = pow(strength, 1.8);

  float proximity = 1.0 - smoothstep(0.0, 0.5, v_distToMouse);
  vec3 color = mix(u_colorBase, u_colorAccent, proximity * 0.7);
  float twinkle = 0.9 + 0.1 * sin(u_time * 3.0 + v_distToMouse * 10.0);
  color *= twinkle;

  gl_FragColor = vec4(color, strength * v_alpha);
}
`

interface HeroParticlesProps {
  count?: number
}

export const HeroParticles: React.FC<HeroParticlesProps> = ({ count = 3000 }) => {
  const { viewport, size } = useThree()

  /*
   * ── CRITICAL FIX ───────────────────────────────────────────────────────────
   * DO NOT subscribe to mouse state via useAppStore hooks here.
   *
   * Reason: useAppStore(selector) causes React re-renders on every store update.
   * Mouse state updates at ~60fps. Re-rendering HeroParticles at 60fps inside
   * a React component causes massive R3F reconciler overhead.
   *
   * Correct pattern: read mouse state INSIDE useFrame using getState().
   * getState() reads the current Zustand state synchronously WITHOUT triggering
   * a React re-render. The WebGL render loop gets fresh mouse values every frame
   * with zero React involvement.
   * ─────────────────────────────────────────────────────────────────────────────
   */

  // Only subscribe to state that legitimately requires a React re-render
  const setReady = useAppStore((s) => s.setHeroReady)

  // Generate particle geometry — memoized, only regenerates on viewport resize
  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)
    const phases    = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * viewport.width  * 1.4
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0
      sizes[i]  = 1.0 + Math.random() * 2.0
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, sizes, phases }
  }, [count, viewport.width, viewport.height])

  // Uniforms ref — stable across renders, mutated directly in useFrame
  const uniforms = useMemo(() => ({
    u_time:        { value: 0 },
    u_mouse:       { value: new THREE.Vector2(0, 0) },
    u_mouseSpeed:  { value: 0 },
    u_pixelRatio:  { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2 },
    u_colorBase:   { value: new THREE.Color('#A1A1AA') },
    u_colorAccent: { value: new THREE.Color('#60A5FA') },
  }), [])

  // Signal the DOM that the shader is ready — only fires once
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [setReady])

  // Particle count scales with screen area — denser on large screens, lighter on small
  useEffect(() => {
    const screenArea    = size.width * size.height
    const baseArea      = 1920 * 1080    // Reference: 1080p
    const baseCount     = 3000
    const minCount      = 800
    const maxCount      = 5000

    const scaledCount = Math.round(baseCount * (screenArea / baseArea))
    const clampedCount = Math.max(minCount, Math.min(maxCount, scaledCount))

    useAppStore.getState().setParticleCount(clampedCount)
  }, [size.width, size.height])

  /*
   * ── useFrame: the WebGL render loop ─────────────────────────────────────────
   * This runs 60 times per second OUTSIDE of React's render cycle.
   * All per-frame uniform mutations happen here.
   *
   * getState() pattern: reads current Zustand state synchronously with zero
   * React overhead. This is the correct and only place to read high-frequency
   * state inside an R3F scene.
   * ─────────────────────────────────────────────────────────────────────────────
   */
  useFrame(({ clock }) => {
    // Read mouse state directly from store — no React re-render triggered
    const { x, y, speed } = useAppStore.getState()

    uniforms.u_time.value       = clock.getElapsedTime()
    uniforms.u_mouse.value.set(x, y)
    uniforms.u_mouseSpeed.value = Math.min(speed, 100)
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-a_size"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-a_phase"
          args={[phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
