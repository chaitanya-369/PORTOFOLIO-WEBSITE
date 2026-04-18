'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/core/store'

/**
 * HardwareControls — Premium System Power Toggle
 * Allows the user to pause/resume WebGL rendering and animations
 * to save resources when not actively working on hardware.
 */
export const HardwareControls: React.FC = () => {
  const isPaused = useAppStore(s => s.isPaused)
  const setPaused = useAppStore(s => s.setPaused)

  return (
    <div className="absolute top-8 left-8 z-50 flex items-center gap-4">
      <motion.button
        onClick={() => setPaused(!isPaused)}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-obsidian-900 border border-obsidian-800 shadow-lg transition-all hover:border-cobalt-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glowing Aura when Active */}
        {!isPaused && (
          <motion.div
            className="absolute inset-0 rounded-full bg-cobalt-accent/20 blur-md"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Power Icon */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={isPaused ? "#4B5563" : "#3B82F6"} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="relative z-10 transition-colors"
        >
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>

        {/* Tooltip Overlay */}
        <div className="absolute left-full ml-4 px-3 py-1 bg-obsidian-950/90 backdrop-blur-md border border-obsidian-800 rounded-sm opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all pointer-events-none">
          <span className="font-mono text-[10px] tracking-widest text-white-pure whitespace-nowrap uppercase">
            {isPaused ? "RESUME RENDERING SYSTEM" : "PAUSE RENDERING SYSTEM"}
          </span>
        </div>
      </motion.button>

      {/* System Status Indicator */}
      <div className="flex flex-col">
        <span className="font-mono text-[10px] tracking-[0.2em] text-white-faint uppercase">System Status</span>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isPaused ? 'bg-obsidian-700' : 'bg-cobalt-accent shadow-[0_0_8px_rgba(59,130,246,0.6)]'}`} />
          <span className={`font-mono text-[11px] tracking-wider transition-colors ${isPaused ? 'text-white-muted' : 'text-white-pure uppercase'}`}>
            {isPaused ? 'Hibernate (Paused)' : 'Active (Rendering)'}
          </span>
        </div>
      </div>
    </div>
  )
}
