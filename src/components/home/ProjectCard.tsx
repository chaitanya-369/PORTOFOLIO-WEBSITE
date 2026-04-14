/**
 * ProjectCard — Server Component
 *
 * Renders the full card content for a single FeaturedProject.
 * No 'use client' — this is a React Server Component. It passes
 * its output as children to ProjectCardShell (the Client boundary).
 *
 * Constitution Laws complied: 2 (strict TS), 4 (no glsl imports), 5 (RSC).
 */

import Link from 'next/link'
import { ProjectCardShell } from '@/components/home/ProjectCardShell'
import type { FeaturedProject } from '@/core/data/featured-projects'

interface ProjectCardProps {
  readonly project: FeaturedProject
  readonly staggerIndex?: number
}

const DOMAIN_COLORS: Record<FeaturedProject['domain'], string> = {
  hardware: 'text-cobalt-glow',
  software: 'text-cobalt-accent',
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, staggerIndex = 0 }) => {
  const { title, blurb, category, domain, tags, href, isExternal, year, comingSoon } = project

  const cardContent = (
    <>
      {/* ── Top Row: category + arrow ─────────────────────────────────────── */}
      <div className="flex items-start justify-between px-card pt-card gap-4">
        <span className={`font-mono text-[10px] tracking-widest uppercase ${DOMAIN_COLORS[domain]}`}>
          {category}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {comingSoon && (
            <span className="font-mono text-[9px] tracking-widest uppercase text-white-faint border border-obsidian-800 px-2 py-0.5">
              COMING SOON
            </span>
          )}
          {/* Arrow — translated on hover via the parent group CSS trick */}
          <span
            aria-hidden="true"
            className="font-mono text-white-faint text-xs transition-transform duration-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </div>
      </div>

      {/* ── Decorative circuit-board line pattern ─────────────────────────── */}
      <div aria-hidden="true" className="mx-card mt-5 mb-4 h-px w-12 bg-gradient-to-r from-cobalt-accent/40 to-transparent" />

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <h3 className="font-display text-h2 text-white-pure tracking-tight px-card leading-tight">
        {title}
      </h3>

      {/* ── Blurb ─────────────────────────────────────────────────────────── */}
      <p className="font-body text-white-muted text-sm leading-relaxed mt-3 px-card flex-1">
        {blurb}
      </p>

      {/* ── Footer: tags + year ───────────────────────────────────────────── */}
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
    </>
  )

  const externalProps = isExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <ProjectCardShell staggerIndex={staggerIndex}>
      <Link
        href={href}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-inset"
        aria-label={`View project: ${title}`}
        {...externalProps}
      >
        {cardContent}
      </Link>
    </ProjectCardShell>
  )
}

export default ProjectCard
