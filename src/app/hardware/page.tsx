import type { Metadata } from 'next'

import { mockHardwareProject } from '@/core/data/hardware-mock'
import { LoadingOverlay } from '@/components/hardware/LoadingOverlay'
import { HardwareSidebar } from '@/components/hardware/HardwareSidebar'

export const metadata: Metadata = {
  title: 'Hardware Explorer',
  description: 'Interactive 3D models of ECE hardware projects.',
}

import { HardwareScene } from '@/glsl/scenes/HardwareScene'

const HardwarePage = () => {
  return (
    <main className="relative w-screen h-screen bg-obsidian-950 overflow-hidden pt-22 flex flex-col items-center justify-center">
      {/* ── 3D RENDERING LAYER (GPU) ── */}
      <div className="absolute inset-0">
        <HardwareScene project={mockHardwareProject} />
      </div>

      {/* ── DOM OVERLAY LAYER (UI) ── */}
      <LoadingOverlay />
      <HardwareSidebar />

      {/* Fallback Paused State UI Removed */}
    </main>
  )
}

export default HardwarePage
