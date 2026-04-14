import type { Metadata } from 'next'
// import dynamic from 'next/dynamic'
// import { mockHardwareProject } from '@/core/data/hardware-mock'
// import { LoadingOverlay } from '@/components/hardware/LoadingOverlay'
// import { HardwareSidebar } from '@/components/hardware/HardwareSidebar'

export const metadata: Metadata = {
  title: 'Hardware Explorer',
  description: 'Interactive 3D models of ECE hardware projects.',
}

// ⚠️ WebGL Canvas MUST skip Server Side Rendering to access window/document
// We dynamically import it here with ssr: false
/* 
const HardwareScene = dynamic(
  () => import('@/glsl/scenes/HardwareScene').then((mod) => mod.HardwareScene),
  { ssr: false }
)
*/

const HardwarePage = (): JSX.Element => {
  return (
    <main className="relative w-screen h-screen bg-obsidian-950 overflow-hidden pt-22 flex flex-col items-center justify-center">
      {/* ── 3D RENDERING LAYER (GPU) ── */}
      {/* 
        [PAUSED] - WebGL Canvas rendering is halted until physical .glb CAD files are uploaded by the user.
        <div className="absolute inset-0">
          <HardwareScene project={mockHardwareProject} />
        </div>
      */}

      {/* ── DOM OVERLAY LAYER (UI) ── */}
      {/* 
        <LoadingOverlay />
        <HardwareSidebar />
      */}

      {/* Fallback Paused State UI */}
      <div className="z-10 flex flex-col items-center text-center max-w-lg px-8">
        <div className="w-16 h-16 rounded-full bg-obsidian-900 border border-obsidian-800 flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-white-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="font-display text-h3 text-white-pure mb-2 tracking-tight">3D Rendering Paused</h1>
        <p className="font-body text-white-muted text-sm leading-relaxed">
          The WebGL hardware explorer is temporarily halted to preserve resources. It will be reactivated once the physical <code className="text-cobalt-accent">.glb</code> CAD models are integrated.
        </p>
      </div>
    </main>
  )
}

export default HardwarePage
