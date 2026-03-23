'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { HeroParticles } from './HeroParticles'
import { useAppStore } from '@/core/store'

export const HeroScene: React.FC = () => {
  const particleCount = useAppStore((s) => s.particleCount)

  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 60,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: false,       // Off — particles don't need it, saves GPU
        alpha: true,            // Transparent background — obsidian comes from CSS
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,           // No depth testing needed for 2D particle field
      }}
      dpr={[1, 2]}              // Cap pixel ratio at 2 for performance
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',  // Canvas never blocks DOM events
      }}
    >
      <Suspense fallback={null}>
        <HeroParticles count={particleCount} />
      </Suspense>
    </Canvas>
  )
}
