'use client'

import { motion } from 'framer-motion'
import React from 'react'

/**
 * BranchingNav — The physical "Sub-Index" UI
 * 
 * Renders a central project node with SVG "circuit lines" that 
 * branch out to interactive navigation buttons.
 */

interface Branch {
  id: string
  label: string
}

interface BranchingNavProps {
  title: string
  branches: Branch[]
  activeBranch: string
  onBranchChange: (id: string) => void
}

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const LINE_VARIANTS = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      pathLength: { type: 'spring', stiffness: 50, damping: 20, duration: 1.5 },
      opacity: { duration: 0.3 }
    }
  }
}

const NODE_VARIANTS = {
  hidden: { scale: 0, opacity: 0, y: 10 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
}

export const BranchingNav: React.FC<BranchingNavProps> = ({ 
  title, 
  branches, 
  activeBranch, 
  onBranchChange 
}) => {
  // ─── UNIFIED COORDINATE CONSTANTS ───────────────────────────────────────
  const VB_WIDTH  = 800
  const VB_HEIGHT = 400
  const CX = VB_WIDTH / 2
  const CY = VB_HEIGHT / 2
  const RX = 300 // Horizontal stretch
  const RY = 140 // Vertical stretch
  
  return (
    <motion.div 
      className="relative w-full max-w-4xl mx-auto aspect-[2/1] flex items-center justify-center mb-16"
      initial="hidden"
      animate="visible"
      variants={CONTAINER_VARIANTS}
    >
      {/* ── CENTRAL HUB ─────────────────────────────────────────────────── */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center"
        variants={NODE_VARIANTS}
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-cobalt-accent/30 bg-black flex items-center justify-center p-3 sm:p-4 text-center shadow-[0_0_40px_rgba(37,99,235,0.2)]">
          <h2 className="font-display text-[10px] sm:text-base text-white-pure tracking-tighter leading-tight uppercase font-bold">
            {title}
          </h2>
        </div>
        {/* Pulsing Core */}
        <motion.div 
          className="absolute -z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-cobalt-glow/5"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── BRANCH LINES (SVG) ─────────────────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {branches.map((branch, i) => {
          // Normalize angle spread (-0.4π to 0.4π)
          const angle = (Math.PI * (i / Math.max(1, branches.length - 1) - 0.5)) * 0.85
          const x2 = CX + Math.sin(angle) * RX
          const y2 = CY - Math.cos(angle) * RY
          
          // Smoother S-curve entry
          const cp1x = CX + Math.sin(angle) * (RX * 0.4)
          const cp1y = CY
          const cp2x = x2 - Math.sin(angle) * (RX * 0.2)
          const cp2y = y2

          return (
            <motion.path
              key={`line-${branch.id}`}
              d={`M ${CX} ${CY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`}
              stroke="url(#branchGradient)"
              strokeWidth="1.2"
              fill="transparent"
              variants={LINE_VARIANTS}
            />
          )
        })}
      </svg>

      {/* ── BRANCH NODES ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {branches.map((branch, i) => {
          const angle = (Math.PI * (i / Math.max(1, branches.length - 1) - 0.5)) * 0.85
          
          // These percentages are exactly tied to CX/RX and CY/RY
          const left = `${((CX + Math.sin(angle) * RX) / VB_WIDTH) * 100}%`
          const top = `${((CY - Math.cos(angle) * RY) / VB_HEIGHT) * 100}%`
          const isActive = activeBranch === branch.id

          return (
            <motion.button
              key={branch.id}
              onClick={() => onBranchChange(branch.id)}
              className={`
                absolute pointer-events-auto
                px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-none border font-mono text-[8px] sm:text-[10px] tracking-wider sm:tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap
                ${isActive 
                  ? 'bg-cobalt-accent/20 border-cobalt-glow text-white-pure shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                  : 'bg-obsidian-950 border-obsidian-800 text-white-faint hover:border-white-muted hover:text-white-muted'
                }
              `}
              style={{ left, top, transform: 'translate(-50%, -50%)' }}
              variants={NODE_VARIANTS}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-cobalt-glow animate-pulse' : 'bg-obsidian-700'}`} />
                {branch.label}
              </div>
              {/* Active Connector Dot */}
              {isActive && (
                <motion.div 
                  layoutId="active-nav-dot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cobalt-glow shadow-[0_0_10px_#2563EB]"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>

  )
}
