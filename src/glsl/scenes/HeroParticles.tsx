'use client'

import { useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '@/core/store'

const VERTEX_SHADER = `
attribute float a_size;
attribute float a_phase;
attribute vec3 a_color;
attribute float a_radius;
attribute float a_speed;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouseSpeed;
uniform float u_pixelRatio;

varying float v_alpha;
varying float v_distToMouse;
varying vec3 v_color;
varying float v_angle;

mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main() {
  vec3 basePos = position;
  float t = u_time * a_speed * 0.5;

  // 1. Smooth, elegant orbital rotation
  vec3 pos = basePos;
  // Rotate around Y axis heavily, with slight tilt
  pos.xz *= rotate(t);
  
  // A gentle wobble on the Y axis to keep it alive
  pos.y += sin(t * 2.0 + a_phase) * 0.1;

  // Global tilt so we view the galaxy from an angle
  pos.yz *= rotate(0.4);
  pos.xy *= rotate(0.2);

  // 2. Compute future position to get tangent direction for smooth dashes
  float t2 = t + 0.1;
  vec3 pos2 = basePos;
  pos2.xz *= rotate(t2);
  pos2.y += sin(t2 * 2.0 + a_phase) * 0.1;
  pos2.yz *= rotate(0.4);
  pos2.xy *= rotate(0.2);

  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vec4 clipPos2 = projectionMatrix * modelViewMatrix * vec4(pos2, 1.0);
  
  vec2 ndcPos  = clipPos.xy / clipPos.w;
  vec2 ndcPos2 = clipPos2.xy / clipPos2.w;
  
  // Velocity vector in screen space
  vec2 vel = ndcPos2 - ndcPos;
  v_angle = atan(vel.y, vel.x);

  // 3. Mouse repulsion (but softer so as not to ruin the shape)
  float dist         = distance(ndcPos, u_mouse);
  float repelRadius  = 0.3;
  float repelStrength = smoothstep(repelRadius, 0.0, dist);
  vec2 repelDir      = normalize(ndcPos - u_mouse + vec2(0.0001));
  float force        = repelStrength * 0.15;

  clipPos.xy += repelDir * force * clipPos.w;

  gl_Position = clipPos;

  // Smooth particle size variation
  float depthScale = 1.0 / max(0.5, (clipPos.z + 5.0) * 0.2); 
  float dynamicSize = a_size * (1.0 + 0.2 * sin(u_time * 2.0 + a_phase));
  gl_PointSize = dynamicSize * max(1.0, u_pixelRatio) * depthScale * 2.5;

  v_alpha = 0.4 + a_radius * 0.1 + smoothstep(0.4, 0.0, dist) * 0.4;
  v_distToMouse = dist;
  v_color = a_color;
}
`

const FRAGMENT_SHADER = `
varying float v_alpha;
varying float v_distToMouse;
varying vec3 v_color;
varying float v_angle;

uniform float u_time;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  
  // Rotate UV to align with movement angle
  float s = sin(-v_angle);
  float c = cos(-v_angle);
  uv = mat2(c, -s, s, c) * uv;
  
  // Stretch to form an elegant soft dash
  uv.y *= 3.0;
  
  float dist = length(uv);
  if (dist > 0.5) discard;

  // Extremely soft, smooth falloff (Gaussian-like)
  float strength = exp(-dist * dist * 16.0);

  vec3 color = v_color;
  
  // Subtle twinkle so it feels alive
  float twinkle = 0.8 + 0.2 * sin(u_time * 3.0 + v_alpha * 20.0);
  color *= twinkle * 1.5; // Slight bloom

  gl_FragColor = vec4(color, strength * v_alpha);
}
`

interface HeroParticlesProps {
  count?: number
}

export const HeroParticles: React.FC<HeroParticlesProps> = ({ count = 4000 }) => {
  const { size } = useThree()
  const setReady = useAppStore((s) => s.setHeroReady)

  const { positions, sizes, phases, colors, radii, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)
    const phases    = new Float32Array(count)
    const colors    = new Float32Array(count * 3)
    const radii     = new Float32Array(count)
    const speeds    = new Float32Array(count)

    const palette = [
      new THREE.Color('#4285F4'), // Google Blue
      new THREE.Color('#EA4335'), // Google Red
      new THREE.Color('#FBBC05'), // Google Yellow
      new THREE.Color('#34A853'), // Google Green
      new THREE.Color('#8B5CF6'), // Purple
      new THREE.Color('#3B82F6'), // Cobalt Glow
    ]

    for (let i = 0; i < count; i++) {
      // Create a smooth galaxy/vortex distribution
      // Dense center, sparse edges
      const radius = Math.pow(Math.random(), 2.0) * 4.0;
      radii[i] = radius;

      // Inner particles orbit faster than outer particles
      speeds[i] = 1.0 + (4.0 - radius) * 0.5 + Math.random() * 0.2;

      // Distribute in a disk with exponential thickness based on radius
      const theta = Math.random() * Math.PI * 2.0;
      const thickness = Math.max(0.1, (4.0 - radius) * 0.15) * (Math.random() - 0.5);

      positions[i * 3]     = radius * Math.cos(theta);
      positions[i * 3 + 1] = thickness;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      sizes[i]  = 1.0 + Math.random() * 2.5;
      phases[i] = Math.random() * Math.PI * 2.0;

      // Colors more saturated at the core
      const baseColor = palette[Math.floor(Math.random() * palette.length)];
      const lerpFactor = Math.random() * 0.3 + (radius / 4.0) * 0.4; 
      // Outer edges get slightly desaturated
      const finalColor = baseColor.clone().lerp(new THREE.Color('#FFFFFF'), lerpFactor);

      colors[i * 3]     = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }

    return { positions, sizes, phases, colors, radii, speeds }
  }, [count])

  const uniforms = useMemo(() => ({
    u_time:        { value: 0 },
    u_mouse:       { value: new THREE.Vector2(0, 0) },
    u_mouseSpeed:  { value: 0 },
    u_pixelRatio:  { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2 },
  }), [])

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [setReady])

  useEffect(() => {
    const screenArea    = size.width * size.height
    const baseArea      = 1920 * 1080
    const baseCount     = 3000
    const minCount      = 1500
    const maxCount      = 6000

    const scaledCount = Math.round(baseCount * (screenArea / baseArea))
    const clampedCount = Math.max(minCount, Math.min(maxCount, scaledCount))

    useAppStore.getState().setParticleCount(clampedCount)
  }, [size.width, size.height])

  useFrame(({ clock }) => {
    const { x, y, speed } = useAppStore.getState()
    uniforms.u_time.value       = clock.getElapsedTime()
    uniforms.u_mouse.value.set(x, y)
    uniforms.u_mouseSpeed.value = Math.min(speed, 100)
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-a_size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-a_phase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-a_color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-a_radius" args={[radii, 1]} />
        <bufferAttribute attach="attributes-a_speed" args={[speeds, 1]} />
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
