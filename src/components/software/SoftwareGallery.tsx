'use client'

/**
 * SoftwareGallery — Client Component
 *
 * The full software section: filter tabs + responsive card grid.
 *
 * Architecture note: 'use client' is required for filter state (useState).
 * Data is imported from src/core/data/ (pure TS — Law 4 compliant).
 * SoftwareCard handles all Framer Motion (Law 1 compliant).
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  softwareProjects,
  softwareStats,
  SOFTWARE_FILTERS,
  type FilterId,
} from '@/core/data/software-projects'
import { SoftwareCard } from '@/components/software/SoftwareCard'

// ─── SPRING PRESETS (Law 1) ──────────────────────────────────────────────────

const SECTION_SPRING = { type: 'spring', stiffness: 200, damping: 25, mass: 1.5 } as const
const FILTER_SPRING  = { type: 'spring', stiffness: 500, damping: 38, mass: 0.8 } as const

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const SoftwareGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all')

  const filtered = activeFilter === 'all'
    ? softwareProjects
    : softwareProjects.filter((p) => p.category === activeFilter)

  return (
    <section
      aria-label="Software projects"
      className="w-full bg-obsidian-950 py-section px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* ── SECTION HEADER ───────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={SECTION_SPRING}
        >
          {/* Eyebrow */}
          <p className="font-mono text-cobalt-glow text-xs tracking-widest uppercase">
            Software
          </p>

          {/* Headline */}
          <h1 className="font-display text-h1 text-white-pure tracking-tight max-w-2xl leading-tight">
            Systems that{' '}
            <span className="text-cobalt-glow">think</span>,
            infrastructure that{' '}
            <span className="text-white-muted">scales.</span>
          </h1>

          {/* Subtext */}
          <p className="font-body text-white-muted max-w-xl leading-relaxed">
            AI gateways, memory infrastructure, and web applications — built with production-grade
            TypeScript and shipped to the edge.
          </p>
        </motion.div>

        {/* ── STATS ROW ────────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-3 divide-x divide-obsidian-800 border border-obsidian-800"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...SECTION_SPRING, delay: 0.08 }}
        >
          {softwareStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center py-6 px-4 text-center">
              <span className="font-display font-bold text-h2 text-white-pure tracking-tight tabular-nums">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] text-white-faint tracking-widest uppercase mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── FILTER TABS ──────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...SECTION_SPRING, delay: 0.1 }}
          role="tablist"
          aria-label="Filter software projects"
        >
          {SOFTWARE_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id
            // Check if this filter has any projects (disable empty filters)
            const hasProjects =
              filter.id === 'all' || softwareProjects.some((p) => p.category === filter.id)

            return (
              <motion.button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                disabled={!hasProjects}
                className={`
                  relative px-4 py-2 font-mono text-xs tracking-widest uppercase
                  border focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-cobalt-glow focus-visible:ring-offset-2
                  focus-visible:ring-offset-obsidian-950
                  disabled:opacity-30 disabled:cursor-not-allowed
                  ${isActive
                    ? 'text-white-pure border-cobalt-accent bg-cobalt-accent/10'
                    : 'text-white-faint border-obsidian-800 bg-transparent hover:text-white-muted hover:border-obsidian-700'
                  }
                `}
                whileHover={hasProjects ? { y: -1, transition: FILTER_SPRING } : {}}
                whileTap={hasProjects ? { scale: 0.96, transition: FILTER_SPRING } : {}}
              >
                {filter.label}
                {/* Active underline */}
                {isActive && (
                  <motion.div
                    layoutId="software-filter-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-cobalt-glow"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── CARD GRID ────────────────────────────────────────────────────── */}
        {/*
          Layout: responsive masonry-like grid.
          - Mobile: single column
          - Tablet (md): 2 columns
          - Desktop (lg): 3 columns
          AnimatePresence handles filter transition — cards exit/enter when filter changes.
        */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}                  // remounts grid on filter change
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.15 }}
          >
            {filtered.length > 0 ? (
              filtered.map((project, index) => (
                <div key={project.id} className="min-h-[280px]">
                  <SoftwareCard project={project} index={index} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="font-mono text-white-faint text-sm tracking-widest uppercase">
                  No projects in this category yet
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...SECTION_SPRING, delay: 0.1 }}
          aria-hidden="true"
        >
          <div className="flex-1 h-px bg-obsidian-800" />
          <span className="font-mono text-white-faint text-[10px] tracking-widest uppercase flex-shrink-0">
            Software · ECE Portfolio
          </span>
          <div className="flex-1 h-px bg-obsidian-800" />
        </motion.div>

        {/* ── CTA ROW ──────────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...SECTION_SPRING, delay: 0.12 }}
        >
          <motion.a
            href="https://github.com/chaitanya-369"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-cobalt-accent text-white-pure font-body font-medium text-sm tracking-wide text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950"
            whileHover={{
              backgroundColor: '#1D4ED8',
              scale: 1.02,
              transition: { type: 'spring', stiffness: 600, damping: 40, mass: 0.8 },
            }}
            whileTap={{
              scale: 0.97,
              transition: { type: 'spring', stiffness: 600, damping: 40, mass: 0.8 },
            }}
          >
            View GitHub ↗
          </motion.a>

          <motion.a
            href="/hardware"
            className="px-8 py-3.5 bg-transparent text-white-muted font-body font-medium text-sm tracking-wide border border-obsidian-800 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950"
            whileHover={{
              borderColor: '#3B82F6',
              color: '#FFFFFF',
              transition: { type: 'spring', stiffness: 600, damping: 40, mass: 0.8 },
            }}
            whileTap={{
              scale: 0.97,
              transition: { type: 'spring', stiffness: 600, damping: 40, mass: 0.8 },
            }}
          >
            Explore Hardware →
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}
