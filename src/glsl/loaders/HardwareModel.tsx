'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '@/core/store'
import type { HardwareProject } from '@/core/types/hardware'

interface HardwareModelProps {
  project: HardwareProject
}

export const HardwareModel: React.FC<HardwareModelProps> = ({ project }) => {
  const meshRef = useRef<THREE.Group>(null)
  
  // Connect to Zustand physics bridge
  const setHovered = useAppStore(s => s.setHoveredComponent)
  const setSelected = useAppStore(s => s.setSelectedComponent)
  const selectedComponentId = useAppStore(s => s.selectedComponentId)
  const hoveredComponentId = useAppStore(s => s.hoveredComponentId)
  const setLoadState = useAppStore(s => s.setLoadState)
  
  // Simulate heavy model loading via Zustand state so the UI LoadingOverlay can render
  const isPaused = useAppStore(s => s.isPaused)

  useEffect(() => {
    if (isPaused) {
      // If paused, we don't want to show a loading screen that never ends
      // or consumes resources for no reason.
      setLoadState({ isLoading: false, progress: 0, error: null })
      return
    }

    setLoadState({ isLoading: true, progress: 0, error: null })
    let progress = 0
    const interval = setInterval(() => {
      progress += 15
      if (progress >= 100) {
        setLoadState({ isLoading: false, progress: 100, error: null })
        clearInterval(interval)
      } else {
        setLoadState({ isLoading: true, progress, error: null })
      }
    }, 150)
    return () => clearInterval(interval)
  }, [setLoadState, isPaused])

  // Float animation using R3F useFrame (Zero React overhead)

  useFrame((state) => {
    if (isPaused || !meshRef.current) return
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
  })

  return (
    <group ref={meshRef}>
      {/* Holographic Wireframe Placeholder Base */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 0.1, 3]} />
        <meshStandardMaterial 
          color="#0A0A0B" 
          metalness={0.9} 
          roughness={0.2} 
          wireframe={true} 
          emissive="#2563EB"
          emissiveIntensity={0.15}
        />
      </mesh>
      
      {/* Interactive IC Node Hotspots mapped from project data */}
      {project.components.map((comp) => {
        const isHovered = hoveredComponentId === comp.id
        const isSelected = selectedComponentId === comp.id
        
        return (
          <group 
            key={comp.id} 
            position={comp.position as [number, number, number]}
            onPointerOver={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
              setHovered(comp.id)
            }}
            onPointerOut={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'auto'
              setHovered(null)
            }}
            onClick={(e) => {
              e.stopPropagation()
              setSelected(comp.id)
            }}
          >
            {/* Holographic Glowing Orb */}
            <mesh>
              <sphereGeometry args={[isSelected ? 0.25 : 0.15, 32, 32]} />
              <meshStandardMaterial 
                color={isSelected ? '#FFFFFF' : '#3B82F6'} 
                emissive={isSelected ? '#FFFFFF' : '#2563EB'} 
                emissiveIntensity={isHovered || isSelected ? 2 : 0.8}
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* HTML Tooltip rendered natively in 3D space via Drei */}
            <Html distanceFactor={10} position={[0, 0.5, 0]} center zIndexRange={[100, 0]}>
              <div 
                className={`transition-all duration-300 pointer-events-none px-3 py-1.5 backdrop-blur-md border rounded-sm font-mono text-[10px] tracking-widest whitespace-nowrap ${
                  isHovered || isSelected 
                    ? 'bg-obsidian-950/80 border-cobalt-glow text-white-pure opacity-100 translate-y-0' 
                    : 'bg-obsidian-900/40 border-obsidian-800 text-white-muted opacity-0 translate-y-2'
                }`}
              >
                {comp.partNumber}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
