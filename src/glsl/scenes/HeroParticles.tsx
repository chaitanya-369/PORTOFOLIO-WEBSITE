'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/core/store'

// Shader source — imported as raw strings
// Note: Next.js requires raw-loader or inline for .vert/.frag files
// We inline the shader source here for Day 2; extract to files in a future refactor
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
  vec3 pos = position;
  float t = u_time * 0.4 + a_phase;
  pos.x += sin(t * 0.7 + a_phase * 2.1) * 0.08;
  pos.y += cos(t * 0.5 + a_phase * 1.7) * 0.06;
  pos.z += sin(t * 0.3 + a_phase * 0.9) * 0.04;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vec4 clipPos  = projectionMatrix * viewMatrix * worldPos;
  vec2 ndcPos   = clipPos.xy / clipPos.w;

  float dist = distance(ndcPos, u_mouse);
  float repelRadius = 0.25 + u_mouseSpeed * 0.004;
  float repelStrength = smoothstep(repelRadius, 0.0, dist);
  vec2 repelDir = normalize(ndcPos - u_mouse + vec2(0.0001));
  float force = repelStrength * (0.15 + u_mouseSpeed * 0.002);
  pos.x += repelDir.x * force;
  pos.y += repelDir.y * force;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  float proximityBoost = smoothstep(0.5, 0.0, dist) * 2.5;
  gl_PointSize = (a_size + proximityBoost) * u_pixelRatio;

  v_alpha = 0.4 + smoothstep(0.4, 0.0, dist) * 0.6;
  v_distToMouse = dist;
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
  const meshRef = useRef<THREE.Points>(null)
  const { viewport, size } = useThree()

  // Read mouse state from Zustand store (the legal WebGL↔DOM bridge)
  const mouseX     = useAppStore((s) => s.x)
  const mouseY     = useAppStore((s) => s.y)
  const mouseSpeed = useAppStore((s) => s.speed)
  const setReady   = useAppStore((s) => s.setHeroReady)

  // Generate particle geometry — memoized, never regenerated
  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)
    const phases    = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Spread particles across a wide plane in front of camera
      positions[i * 3]     = (Math.random() - 0.5) * viewport.width  * 1.4
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0

      // Random size 1–3px base
      sizes[i]  = 1.0 + Math.random() * 2.0

      // Random phase offset for organic drift
      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, sizes, phases }
  }, [count, viewport.width, viewport.height])

  // Shader uniforms — memoized ref to avoid re-creating the material
  const uniforms = useMemo(() => ({
    u_time:       { value: 0 },
    u_mouse:      { value: new THREE.Vector2(0, 0) },
    u_mouseSpeed: { value: 0 },
    u_pixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2 },
    u_colorBase:  { value: new THREE.Color('#A1A1AA') },  // white-muted
    u_colorAccent:{ value: new THREE.Color('#60A5FA') },  // cobalt-particle
  }), [])

  // Signal to DOM that the hero is ready (triggers Framer Motion entrance)
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [setReady])

  // Reduce particle count on mobile to maintain 60fps
  useEffect(() => {
    const isMobile = size.width < 768
    useAppStore.getState().setParticleCount(isMobile ? 1200 : 3000)
  }, [size.width])

  // Per-frame updates — this runs inside the WebGL render loop
  useFrame(({ clock }) => {
    uniforms.u_time.value       = clock.getElapsedTime()
    uniforms.u_mouse.value.set(mouseX, mouseY)
    uniforms.u_mouseSpeed.value = Math.min(mouseSpeed, 100)
  })

  // Next 15 / R3F 9 specific buffer attribute syntax update based on Prompt Phase 9
  return (
    <points ref={meshRef}>
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
