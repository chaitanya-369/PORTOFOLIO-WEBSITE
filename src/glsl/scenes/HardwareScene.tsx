'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { HardwareModel } from '../loaders/HardwareModel'
import { useAppStore } from '@/core/store'
import type { HardwareProject } from '@/core/types/hardware'

interface HardwareSceneProps {
  project: HardwareProject
}

export const HardwareScene: React.FC<HardwareSceneProps> = ({ project }) => {
  const isPaused = useAppStore(s => s.isPaused)

  return (
    <Canvas
      camera={{ position: [-3, 4, 6], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]} 
      frameloop={isPaused ? 'never' : 'always'}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <Suspense fallback={null}>
        {/* Pre-baked HDRI environment for physically accurate PBR lighting on metals */}
        <Environment preset="city" />
        
        {/* Subtle base lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Primary Hardware Mesh (Isolated pure WebGL component) */}
        <HardwareModel project={project} />

        {/* Cinematic grounding shadow */}
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={4} 
          color="#0A0A0B" 
        />

        {/* 
          Premium Physics Layer 
          dampingFactor 0.05 enforces massive angular weight to model rotations 
        */}
        <OrbitControls 
          enableDamping={true} 
          dampingFactor={0.05} 
          minDistance={3} 
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 + 0.1} // Prevents looking totally underneath
        />
      </Suspense>
    </Canvas>
  )
}
