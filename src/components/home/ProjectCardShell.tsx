'use client'

/**
 * ProjectCardShell — Client Component
 *
 * The thinnest possible 'use client' boundary for the project cards.
 * Its only job is to own Framer Motion hover/tap state. All content
 * rendering stays in the Server Component (ProjectCard) to keep the
 * client bundle minimal — Constitution Law 5.
 */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Law 1 — snappy spring preset
const HOVER_SPRING = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const
const TAP_SPRING   = { type: 'spring', stiffness: 600, damping: 40, mass: 0.8 } as const

interface ProjectCardShellProps {
  readonly children: ReactNode
  /** Controls the card's scroll-in stagger delay (seconds) */
  readonly staggerIndex?: number
}

export const ProjectCardShell: React.FC<ProjectCardShellProps> = ({
  children,
  staggerIndex = 0,
}) => {
  return (
    <motion.div
      className="group relative flex flex-col h-full bg-obsidian-900 border border-obsidian-800 overflow-hidden cursor-pointer"
      // ── Scroll entrance ──────────────────────────────────────────────────
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
        mass: 1.5,
        delay: staggerIndex * 0.09,
      }}
      // ── Hover — physical lift + glow ─────────────────────────────────────
      whileHover={{
        y: -5,
        boxShadow: '0 0 40px rgba(37, 99, 235, 0.18), 0 4px 24px rgba(0,0,0,0.5)',
        borderColor: 'rgba(59, 130, 246, 0.45)',
        transition: HOVER_SPRING,
      }}
      whileTap={{
        scale: 0.985,
        transition: TAP_SPRING,
      }}
    >
      {children}
    </motion.div>
  )
}
