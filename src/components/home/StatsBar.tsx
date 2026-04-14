'use client'

/**
 * StatsBar — Client Component
 *
 * Animated statistics counter row. Requires 'use client' because:
 *   1. useInView (from framer-motion) is a browser-only hook
 *   2. useCountUp uses Framer's animate() — browser-only
 *
 * All three counters share a single `useInView` ref to start simultaneously.
 */

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/core/hooks/useCountUp'
import type { portfolioStats } from '@/core/data/featured-projects'

type Stat = (typeof portfolioStats)[number]

interface StatPillProps {
  readonly stat: Stat
  readonly inView: boolean
  readonly index: number
}

const StatPill: React.FC<StatPillProps> = ({ stat, inView, index }) => {
  const { displayValue } = useCountUp({ target: stat.value, inView, duration: 1.6 })

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 px-8 py-5 border-r border-obsidian-800 last:border-r-0 flex-1"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 28,
        delay: index * 0.12,
      }}
    >
      {/* Animated number */}
      <div className="flex items-baseline gap-1">
        <motion.span className="font-display text-[2.5rem] font-bold text-white-pure leading-none tracking-tight">
          {displayValue}
        </motion.span>
        <span aria-hidden="true" className="font-mono text-cobalt-glow text-sm">+</span>
      </div>
      {/* Label */}
      <span className="font-mono text-white-faint text-[11px] tracking-widest uppercase">
        {stat.label}
      </span>
    </motion.div>
  )
}

interface StatsBarProps {
  readonly stats: typeof portfolioStats
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div
      ref={ref}
      className="flex items-stretch divide-x-0 border border-obsidian-800 bg-obsidian-900"
      aria-label="Portfolio statistics"
    >
      {stats.map((stat, i) => (
        <StatPill key={stat.label} stat={stat} inView={inView} index={i} />
      ))}
    </div>
  )
}
