'use client'

/**
 * ContributionHeatmap — Client Component
 *
 * Renders 52 weeks × 7 days of GitHub contribution data as a
 * premium heatmap. All data is passed as props from the Server Component
 * (no client-side fetching).
 *
 * Visual design:
 * - Cells colored by contribution intensity using cobalt palette
 * - Hover tooltip: date + commit count
 * - Month labels above the grid
 * - Scroll-reveal animation on the section (one motion, not per-cell)
 * - Mobile: horizontal scroll container
 *
 * Constitution Laws:
 * - Law 1: spring physics on section entrance
 * - Law 4: no glsl imports
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getMonthLabels } from '@/core/api/github'
import type { GitHubContributionData, ContributionDay } from '@/core/api/github'

// ─── COLOR SCALE ─────────────────────────────────────────────────────────────
// Maps contribution level (0–4) to cobalt-accent opacity steps.
// Matches the design system: obsidian background → cobalt-accent at max.

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'rgba(26,26,31,1)',          // obsidian-800 — no activity
  1: 'rgba(37,99,235,0.22)',      // cobalt — light (1–3 commits)
  2: 'rgba(37,99,235,0.45)',      // cobalt — medium (4–9 commits)
  3: 'rgba(37,99,235,0.72)',      // cobalt — strong (10–19 commits)
  4: 'rgba(37,99,235,1)',         // cobalt-accent — peak (20+ commits)
}

const LEVEL_BORDER: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'rgba(42,42,49,0.8)',
  1: 'rgba(37,99,235,0.35)',
  2: 'rgba(37,99,235,0.55)',
  3: 'rgba(37,99,235,0.8)',
  4: 'rgba(59,130,246,1)',
}

// Day abbrevations (Sun first — matching GitHub)
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

// ─── SPRING PRESETS ──────────────────────────────────────────────────────────

const SECTION_SPRING = { type: 'spring', stiffness: 200, damping: 25, mass: 1.5 } as const

// ─── COMPONENT ───────────────────────────────────────────────────────────────

interface ContributionHeatmapProps {
  readonly data: GitHubContributionData
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ day: ContributionDay; x: number; y: number } | null>(null)
  const monthLabels = getMonthLabels(data.weeks)

  const CELL_SIZE  = 11   // px
  const CELL_GAP   = 2    // px
  const CELL_STEP  = CELL_SIZE + CELL_GAP

  return (
    <section
      aria-label="GitHub contribution activity"
      className="w-full bg-obsidian-950 py-section px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">

        {/* ── SECTION HEADER ─────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={SECTION_SPRING}
        >
          <p className="font-mono text-cobalt-glow text-xs tracking-widest uppercase">
            Activity
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-display text-h2 text-white-pure tracking-tight leading-tight">
              Building continuously.
            </h2>
            {/* Summary stats */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="flex flex-col items-end">
                <span className="font-display font-bold text-h3 text-white-pure tabular-nums">
                  {data.totalLastYear.toLocaleString()}
                </span>
                <span className="font-mono text-[10px] text-white-faint tracking-widest uppercase">
                  Contributions
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-display font-bold text-h3 text-white-pure tabular-nums">
                  {data.activeDays}
                </span>
                <span className="font-mono text-[10px] text-white-faint tracking-widest uppercase">
                  Active Days
                </span>
              </div>
              {data.peakDay && (
                <div className="flex flex-col items-end">
                  <span className="font-display font-bold text-h3 text-cobalt-glow tabular-nums">
                    {data.peakDay.count}
                  </span>
                  <span className="font-mono text-[10px] text-white-faint tracking-widest uppercase">
                    Peak Day
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── HEATMAP GRID ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...SECTION_SPRING, delay: 0.1 }}
          className="relative"
        >
          {/* Horizontal scroll wrapper for mobile */}
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div
              className="relative inline-flex flex-col gap-0"
              style={{ minWidth: `${data.weeks.length * CELL_STEP + 32}px` }}
            >
              {/* ── Month labels ───────────────────────────────────────── */}
              <div
                className="relative h-5 mb-1"
                style={{ marginLeft: '32px' }}
                aria-hidden="true"
              >
                {monthLabels.map(({ label, weekIndex }) => (
                  <span
                    key={`${label}-${weekIndex}`}
                    className="absolute font-mono text-[10px] text-white-faint tracking-wide"
                    style={{ left: `${weekIndex * CELL_STEP}px` }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* ── Row labels + cell grid ─────────────────────────────── */}
              <div className="flex gap-0">
                {/* Day-of-week labels */}
                <div
                  className="flex flex-col justify-between flex-shrink-0 pr-2"
                  style={{ width: '30px', height: `${7 * CELL_STEP - CELL_GAP}px` }}
                  aria-hidden="true"
                >
                  {DAY_LABELS.map((label, i) => (
                    <span
                      key={i}
                      className="font-mono text-[9px] text-white-faint leading-none"
                      style={{ height: `${CELL_SIZE}px`, lineHeight: `${CELL_SIZE}px` }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* The actual cell grid */}
                <div
                  className="relative flex gap-[2px]"
                  role="grid"
                  aria-label="Contribution calendar"
                >
                  {data.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]" role="row">
                      {week.days.map((day) => (
                        <HeatCell
                          key={day.date}
                          day={day}
                          size={CELL_SIZE}
                          onHover={(e, d) => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                            setTooltip({ day: d, x: rect.left + rect.width / 2, y: rect.top })
                          }}
                          onLeave={() => setTooltip(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Legend ─────────────────────────────────────────────── */}
              <div
                className="flex items-center gap-2 mt-3 justify-end"
                aria-hidden="true"
              >
                <span className="font-mono text-[9px] text-white-faint">Less</span>
                {([0, 1, 2, 3, 4] as const).map((level) => (
                  <div
                    key={level}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      backgroundColor: LEVEL_COLORS[level],
                      border: `1px solid ${LEVEL_BORDER[level]}`,
                    }}
                  />
                ))}
                <span className="font-mono text-[9px] text-white-faint">More</span>
              </div>
            </div>
          </div>

          {/* ── Fixed tooltip (follows mouse, rendered outside scroll area) */}
          {tooltip && (
            <div
              className="fixed z-50 pointer-events-none"
              style={{
                left: tooltip.x,
                top: tooltip.y - 42,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="bg-obsidian-900 border border-obsidian-800 px-3 py-1.5 whitespace-nowrap shadow-obsidian">
                <span className="font-mono text-white-pure text-[11px]">
                  {tooltip.day.count > 0
                    ? `${tooltip.day.count} contribution${tooltip.day.count !== 1 ? 's' : ''}`
                    : 'No contributions'}
                </span>
                <span className="font-mono text-white-faint text-[10px] ml-2">
                  {formatDate(tooltip.day.date)}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── FOOTER NOTE ────────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...SECTION_SPRING, delay: 0.12 }}
          aria-hidden="true"
        >
          <div className="flex-1 h-px bg-obsidian-800" />
          <a
            href={`https://github.com/${data.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-white-faint text-[10px] tracking-widest uppercase flex-shrink-0 hover:text-cobalt-glow transition-colors focus-visible:outline-none focus-visible:text-cobalt-glow"
          >
            @{data.username} on GitHub ↗
          </a>
          <div className="flex-1 h-px bg-obsidian-800" />
        </motion.div>

      </div>
    </section>
  )
}

// ─── HEAT CELL ───────────────────────────────────────────────────────────────

interface HeatCellProps {
  readonly day: ContributionDay
  readonly size: number
  readonly onHover: (e: React.MouseEvent, day: ContributionDay) => void
  readonly onLeave: () => void
}

const HeatCell: React.FC<HeatCellProps> = ({ day, size, onHover, onLeave }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      role="gridcell"
      aria-label={`${formatDate(day.date)}: ${day.count} contributions`}
      style={{
        width: size,
        height: size,
        backgroundColor: hovered && day.count === 0 ? 'rgba(37,99,235,0.1)' : LEVEL_COLORS[day.level],
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.7)' : LEVEL_BORDER[day.level]}`,
        transition: 'background-color 0.12s ease, border-color 0.12s ease, transform 0.1s ease',
        transform: hovered ? 'scale(1.3)' : 'scale(1)',
        borderRadius: '1px',
        cursor: 'default',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        setHovered(true)
        onHover(e, day)
      }}
      onMouseLeave={() => {
        setHovered(false)
        onLeave()
      }}
    />
  )
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
