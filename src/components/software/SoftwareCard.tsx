'use client'

/**
 * SoftwareCard — Client Component
 *
 * Individual project card for the software gallery.
 * Follows the same Server-in-Client composition pattern as
 * ProjectCard + ProjectCardShell on the homepage.
 *
 * Constitution Laws: Law 1 (spring physics), Law 2 (strict TS), Law 4 (no glsl imports).
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { SoftwareProject } from '@/core/data/software-projects'

// ─── SPRING PRESETS (Law 1) ──────────────────────────────────────────────────

const HOVER_SPRING = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const
const TAP_SPRING   = { type: 'spring', stiffness: 600, damping: 40, mass: 0.8 } as const

// ─── STATUS BADGE ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<SoftwareProject['status'], { label: string; className: string }> = {
  live:     { label: 'LIVE',     className: 'text-cobalt-glow border-cobalt-accent/40 bg-cobalt-accent/5' },
  wip:      { label: 'WIP',      className: 'text-amber-400 border-amber-400/30 bg-amber-400/5' },
  archived: { label: 'ARCHIVED', className: 'text-white-faint border-obsidian-800' },
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

interface SoftwareCardProps {
  readonly project: SoftwareProject
  readonly index: number
}

export const SoftwareCard: React.FC<SoftwareCardProps> = ({ project, index }) => {
  const { title, blurb, categoryLabel, tags, href, isExternal, year, status } = project
  const statusCfg = STATUS_CONFIG[status]

  const externalProps = isExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-obsidian-900 border border-obsidian-800 overflow-hidden"
      // ── Scroll entrance ─────────────────────────────────────────────────────
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 26,
        mass: 1.5,
        delay: index * 0.1,
      }}
      // ── Hover — physical lift + cobalt glow ─────────────────────────────────
      whileHover={{
        y: -6,
        boxShadow: '0 0 48px rgba(37, 99, 235, 0.2), 0 8px 32px rgba(0,0,0,0.5)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        transition: HOVER_SPRING,
      }}
      whileTap={{
        scale: 0.985,
        transition: TAP_SPRING,
      }}
    >
      <Link
        href={href}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-inset"
        aria-label={`View project: ${title}`}
        {...externalProps}
      >
        {/* ── Top row: category + status + arrow ────────────────────────────── */}
        <div className="flex items-start justify-between px-card pt-card gap-4">
          <span className="font-mono text-[10px] tracking-widest uppercase text-cobalt-glow">
            {categoryLabel}
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 ${statusCfg.className}`}
            >
              {statusCfg.label}
            </span>
            <span
              aria-hidden="true"
              className="font-mono text-white-faint text-xs transition-transform duration-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </div>
        </div>

        {/* ── Cobalt rule ────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="mx-card mt-5 mb-4 h-px w-12 bg-gradient-to-r from-cobalt-accent/40 to-transparent"
        />

        {/* ── Title ──────────────────────────────────────────────────────────── */}
        <h3 className="font-display text-h2 text-white-pure tracking-tight px-card leading-tight">
          {title}
        </h3>

        {/* ── Blurb ──────────────────────────────────────────────────────────── */}
        <p className="font-body text-white-muted text-sm leading-relaxed mt-3 px-card flex-1">
          {blurb}
        </p>

        {/* ── Footer: tags + year ────────────────────────────────────────────── */}
        <div className="flex items-end justify-between px-card pb-card mt-6 gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-white-faint tracking-wider border border-obsidian-800 px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="font-mono text-[10px] text-white-faint flex-shrink-0">{year}</span>
        </div>
      </Link>

      {/* ── Top-edge cobalt glow line (appears on hover) ────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cobalt-glow/60 to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        whileHover={{ opacity: 1, scaleX: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.div>
  )
}
