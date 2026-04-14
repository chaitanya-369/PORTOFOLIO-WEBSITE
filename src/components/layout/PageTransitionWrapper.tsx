'use client'

/**
 * PageTransitionWrapper — Root Cinematic Transition
 *
 * Wraps all page content in AnimatePresence so navigation never
 * produces a white flash. Pages fade + drift out, then the new
 * page fades + drifts in with spring physics.
 *
 * Architecture constraints:
 * - Must be 'use client' (AnimatePresence requires browser APIs)
 * - Placed inside layout.tsx (Server Component) as a thin client boundary
 * - `initial={false}` prevents double-animation on first load —
 *   the hero, navbar, etc. have their own entrance animations
 * - `mode="wait"` ensures the exiting page finishes before the
 *   entering page starts — prevents visual overlap
 *
 * Constitution Law 1: all transitions use spring physics.
 * `usePathname()` provides the key that signals AnimatePresence
 * when a route change has occurred.
 */

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface PageTransitionWrapperProps {
  readonly children: ReactNode
}

// ─── TRANSITION PRESETS ──────────────────────────────────────────────────────
const PAGE_ENTER = {
  opacity: 0,
  y: 10,
} as const

const PAGE_ANIMATE = {
  opacity: 1,
  y: 0,
} as const

const ENTER_SPRING = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
  mass: 1,
} as const

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={PAGE_ENTER}
      animate={PAGE_ANIMATE}
      transition={{
        ...ENTER_SPRING,
      }}
      style={{
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </motion.div>
  )
}
