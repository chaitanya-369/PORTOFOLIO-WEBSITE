'use client'

/**
 * ProjectsCatalogue — Client Component
 *
 * Full project catalogue with domain filter tabs + responsive grid.
 * Pattern mirrors SoftwareGallery exactly — consistent UX across pages.
 *
 * 'use client' required for filter state (useState) and AnimatePresence.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  allProjects,
  CATALOGUE_FILTERS,
  type UnifiedProject,
  type CatalogueFilterId,
} from '@/core/data/all-projects'

// ─── SPRING PRESETS ──────────────────────────────────────────────────────────

const SECTION_SPRING = { type: 'spring', stiffness: 200, damping: 25, mass: 1.5 } as const
const HOVER_SPRING   = { type: 'spring', stiffness: 400, damping: 30, mass: 1   } as const
const FILTER_SPRING  = { type: 'spring', stiffness: 500, damping: 38, mass: 0.8 } as const

// ─── STATUS CONFIG ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<UnifiedProject['status'], { label: string; className: string }> = {
  live:          { label: 'LIVE',      className: 'text-cobalt-glow border-cobalt-accent/40 bg-cobalt-accent/5' },
  wip:           { label: 'WIP',       className: 'text-amber-400  border-amber-400/30   bg-amber-400/5'   },
  'coming-soon': { label: 'SOON',      className: 'text-white-faint border-obsidian-800' },
}

// ─── DOMAIN PILL ─────────────────────────────────────────────────────────────

const DOMAIN_COLORS: Record<UnifiedProject['domain'], string> = {
  software: 'text-cobalt-glow',
  hardware: 'text-cobalt-glow',
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export const ProjectsCatalogue: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<CatalogueFilterId>('all')

  const filtered = activeFilter === 'all'
    ? allProjects
    : allProjects.filter((p) => p.domain === activeFilter)

  return (
    <section
      aria-label="All projects"
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
          <p className="font-mono text-cobalt-glow text-xs tracking-widest uppercase">
            All Work
          </p>
          <h1 className="font-display text-h1 text-white-pure tracking-tight max-w-2xl leading-tight">
            Every project.{' '}
            <span className="text-white-muted">Every layer of the stack.</span>
          </h1>
          <p className="font-body text-white-muted max-w-xl leading-relaxed">
            Silicon to cloud — hardware PCBs, VLSI chips, AI gateways, and infrastructure systems.
            Click any card to open its full engineering case study.
          </p>
        </motion.div>

        {/* ── STATS ────────────────────────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-3 divide-x divide-obsidian-800 border border-obsidian-800"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...SECTION_SPRING, delay: 0.07 }}
        >
          {[
            { value: allProjects.length,                                     label: 'Total Projects' },
            { value: allProjects.filter((p) => p.domain === 'hardware').length, label: 'Hardware' },
            { value: allProjects.filter((p) => p.domain === 'software').length, label: 'Software' },
          ].map((stat) => (
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
          aria-label="Filter projects by domain"
        >
          {CATALOGUE_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id
            return (
              <motion.button
                key={filter.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  relative px-4 py-2 font-mono text-xs tracking-widest uppercase border
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow
                  focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950
                  ${isActive
                    ? 'text-white-pure border-cobalt-accent bg-cobalt-accent/10'
                    : 'text-white-faint border-obsidian-800 hover:text-white-muted hover:border-obsidian-700'
                  }
                `}
                whileHover={{ y: -1, transition: FILTER_SPRING }}
                whileTap={{ scale: 0.96, transition: FILTER_SPRING }}
              >
                {filter.label}
                {isActive && (
                  <motion.div
                    layoutId="catalogue-filter"
                    className="absolute bottom-0 left-0 right-0 h-px bg-cobalt-glow"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── PROJECT GRID ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {filtered.map((project, index) => (
              <CatalogueCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── DIVIDER ──────────────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...SECTION_SPRING, delay: 0.1 }}
          aria-hidden="true"
        >
          <div className="flex-1 h-px bg-obsidian-800" />
          <span className="font-mono text-white-faint text-[10px] tracking-widest uppercase flex-shrink-0">
            Hardware · Software · ECE Portfolio
          </span>
          <div className="flex-1 h-px bg-obsidian-800" />
        </motion.div>

      </div>
    </section>
  )
}

// ─── CATALOGUE CARD ──────────────────────────────────────────────────────────

interface CatalogueCardProps {
  project: UnifiedProject
  index: number
}

const CatalogueCard: React.FC<CatalogueCardProps> = ({ project, index }) => {
  const statusCfg = STATUS_CONFIG[project.status]
  const isClickable = project.hasDetailPage || project.isExternal

  const externalProps = project.isExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  const CardInner = (
    <>
      {/* Top row */}
      <div className="flex items-start justify-between px-card pt-card gap-4">
        <span className={`font-mono text-[10px] tracking-widest uppercase ${DOMAIN_COLORS[project.domain]}`}>
          {project.categoryLabel}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 ${statusCfg.className}`}>
            {statusCfg.label}
          </span>
          {isClickable && (
            <span aria-hidden="true"
              className="font-mono text-white-faint text-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-0">
              {project.isExternal ? '↗' : '→'}
            </span>
          )}
        </div>
      </div>

      {/* Cobalt rule */}
      <div aria-hidden="true" className="mx-card mt-5 mb-4 h-px w-12 bg-gradient-to-r from-cobalt-accent/40 to-transparent" />

      {/* Title */}
      <h2 className="font-display text-h2 text-white-pure tracking-tight px-card leading-tight">
        {project.title}
      </h2>

      {/* Blurb */}
      <p className="font-body text-white-muted text-sm leading-relaxed mt-3 px-card flex-1">
        {project.blurb}
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between px-card pb-card mt-6 gap-4">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono text-[10px] text-white-faint tracking-wider border border-obsidian-800 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <span className="font-mono text-[10px] text-white-faint flex-shrink-0">{project.year}</span>
      </div>

      {/* Top glow on hover */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cobalt-glow/50 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        whileHover={{ opacity: 1, scaleX: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </>
  )

  const wrapperClass = `
    group relative flex flex-col min-h-[260px] bg-obsidian-900 border border-obsidian-800 overflow-hidden
    ${!isClickable ? 'opacity-60' : ''}
  `

  if (!isClickable) {
    return (
      <motion.div
        className={wrapperClass}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ ...SECTION_SPRING, delay: index * 0.08 }}
      >
        {CardInner}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={wrapperClass}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ ...SECTION_SPRING, delay: index * 0.08 }}
      whileHover={{
        y: -6,
        boxShadow: '0 0 48px rgba(37,99,235,0.18), 0 8px 32px rgba(0,0,0,0.5)',
        borderColor: 'rgba(59,130,246,0.4)',
        transition: HOVER_SPRING,
      }}
      whileTap={{ scale: 0.985, transition: { type: 'spring', stiffness: 600, damping: 40 } }}
    >
      <Link
        href={project.href}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-inset"
        aria-label={`View ${project.title}`}
        {...externalProps}
      >
        {CardInner}
      </Link>
    </motion.div>
  )
}
