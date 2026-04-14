'use client'

/**
 * FeaturedSection — Client Component
 *
 * Uses Framer Motion (whileInView, motion.*) for scroll-triggered animations,
 * which requires 'use client'. The data layer (featured-projects.ts) is still
 * purely static — no hydration cost beyond animation.
 *
 * Client boundaries:
 *   - FeaturedSection (this file — motion on section header, divider, CTAs)
 *   - ProjectCardShell (motion hover/tap wrapper)
 *   - StatsBar (count-up animation)
 *
 * ProjectCard itself is a Server Component rendered inside ProjectCardShell
 * via Next.js Server-in-Client composition.
 */

import { motion } from 'framer-motion'
import { featuredProjects, portfolioStats } from '@/core/data/featured-projects'
import { StatsBar } from '@/components/home/StatsBar'
import ProjectCard from '@/components/home/ProjectCard'

// Spring configs used inline (no export — internal to this section)
const SECTION_SPRING = { type: 'spring', stiffness: 200, damping: 25, mass: 1.5 } as const

export const FeaturedSection: React.FC = () => {
  // Destructure by size to place in correct grid slots
  const largeCard  = featuredProjects.find((p) => p.size === 'large')!
  const narrowCard = featuredProjects.find((p) => p.size === 'narrow')!
  const mediumCards = featuredProjects.filter((p) => p.size === 'medium')

  return (
    <section
      aria-label="Featured work"
      className="w-full bg-obsidian-950 py-section px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16">

        {/* ── SECTION HEADER ──────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={SECTION_SPRING}
        >
          {/* Eyebrow */}
          <p className="font-mono text-cobalt-glow text-xs tracking-widest uppercase">
            Selected Work
          </p>

          {/* Headline */}
          <h2 className="font-display text-h1 text-white-pure tracking-tight max-w-2xl leading-tight">
            Engineering at the intersection of{' '}
            <span className="text-cobalt-glow">bits</span> &amp;{' '}
            <span className="text-white-muted">atoms.</span>
          </h2>

          {/* Subtext */}
          <p className="font-body text-white-muted max-w-xl leading-relaxed">
            Hardware that thinks. Software that ships. From 45nm silicon to production AI gateways.
          </p>
        </motion.div>

        {/* ── STATS BAR ───────────────────────────────────────────────── */}
        <StatsBar stats={portfolioStats} />

        {/* ── CARD GRID ───────────────────────────────────────────────── */}
        {/*
          Desktop: asymmetric 5fr/3fr top row, 1fr/1fr bottom row
          Mobile: single column stack
        */}
        <div className="flex flex-col gap-4">
          {/* Row 1 — large + narrow */}
          <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-4 items-stretch">
            {/* Large card gets extra height on desktop */}
            <div className="min-h-[340px]">
              <ProjectCard project={largeCard} staggerIndex={0} />
            </div>
            <div className="min-h-[280px] md:min-h-0">
              <ProjectCard project={narrowCard} staggerIndex={1} />
            </div>
          </div>

          {/* Row 2 — two medium cards equal split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediumCards.map((project, i) => (
              <div key={project.id} className="min-h-[260px]">
                <ProjectCard project={project} staggerIndex={i + 2} />
              </div>
            ))}
          </div>
        </div>

        {/* ── DOMAIN DIVIDER ──────────────────────────────────────────── */}
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
            Hardware · Software
          </span>
          <div className="flex-1 h-px bg-obsidian-800" />
        </motion.div>

        {/* ── DUAL CTA ROW ────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...SECTION_SPRING, delay: 0.15 }}
        >
          {/* Primary — hardware */}
          <motion.a
            href="/hardware"
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
            Explore Hardware →
          </motion.a>

          {/* Secondary — software */}
          <motion.a
            href="/software"
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
            View Software →
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}
