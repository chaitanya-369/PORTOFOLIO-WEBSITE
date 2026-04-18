'use client'

import dynamic from 'next/dynamic'
import { mockHardwareProject } from '@/core/data/hardware-mock'
import { LoadingOverlay } from '@/components/hardware/LoadingOverlay'
import { HardwareSidebar } from '@/components/hardware/HardwareSidebar'
import { HardwareControls } from '@/components/hardware/HardwareControls'
import { DormancyOverlay } from '@/components/hardware/DormancyOverlay'
import { useAppStore } from '@/core/store'

const HardwareScene = dynamic(
  () => import('@/glsl/scenes/HardwareScene').then(mod => mod.HardwareScene),
  { ssr: false }
)

const HardwarePage = () => {
  const isPaused = useAppStore(s => s.isPaused)

  return (
    <main className="relative w-screen h-screen bg-obsidian-950 overflow-hidden pt-22 flex flex-col items-center justify-center">
      {/* ── 3D RENDERING LAYER (GPU) ── */}
      <div className="absolute inset-0">
        <HardwareScene project={mockHardwareProject} />
      </div>

      {/* ── DOM OVERLAY LAYER (UI) ── */}
      <DormancyOverlay />
      {!isPaused && <HardwareControls />}
      <LoadingOverlay />
      <HardwareSidebar />

      {/* Fallback Paused State UI Removed */}
    </main>
  )
}

export default HardwarePage
