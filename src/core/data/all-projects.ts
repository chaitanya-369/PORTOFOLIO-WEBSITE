/**
 * All Projects — Unified Data Layer
 * Merges hardware + software into one catalogue for the /projects index.
 * Consumed by src/app/projects/page.tsx (Server Component).
 * Domain: src/core — pure TypeScript, no UI imports (Law 4).
 */

import { featuredProjects } from '@/core/data/featured-projects'
import { softwareProjects } from '@/core/data/software-projects'

export type ProjectDomain = 'hardware' | 'software'
export type ProjectStatus = 'live' | 'wip' | 'coming-soon'

export interface UnifiedProject {
  readonly id: string
  readonly slug: string            // used for /projects/[slug] — null if external only
  readonly title: string
  readonly blurb: string
  readonly domain: ProjectDomain
  readonly categoryLabel: string
  readonly tags: readonly string[]
  readonly href: string            // primary link (internal case study or external)
  readonly isExternal: boolean
  readonly hasDetailPage: boolean  // whether /projects/[slug] exists with real content
  readonly year: number
  readonly status: ProjectStatus
}

// ─── HARDWARE PROJECTS ───────────────────────────────────────────────────────

const hardwareProjects: readonly UnifiedProject[] = featuredProjects
  .filter((p) => p.domain === 'hardware')
  .map((p) => ({
    id: p.id,
    slug: p.id,
    title: p.title,
    blurb: p.blurb,
    domain: 'hardware' as const,
    categoryLabel: p.category,
    tags: p.tags,
    href: p.comingSoon ? '#' : `/projects/${p.id}`,
    isExternal: false,
    hasDetailPage: false,           // will flip to true as MDX files are written
    year: p.year,
    status: p.comingSoon ? 'coming-soon' : 'wip',
  }))

// ─── SOFTWARE PROJECTS ───────────────────────────────────────────────────────

const softwareUnified: readonly UnifiedProject[] = softwareProjects.map((p) => {
  const hasDetail = ['api-saviour', 'org-memory'].includes(p.id)
  return {
    id: p.id,
    slug: p.id,
    title: p.title,
    blurb: p.blurb,
    domain: 'software' as const,
    categoryLabel: p.categoryLabel,
    tags: p.tags,
    href: hasDetail ? `/projects/${p.id}` : p.href,
    isExternal: !hasDetail && p.isExternal,
    hasDetailPage: hasDetail,
    year: p.year,
    status: p.status === 'live' ? 'live' : p.status === 'wip' ? 'wip' : 'coming-soon',
  }
})

// ─── COMBINED CATALOGUE ──────────────────────────────────────────────────────

export const allProjects: readonly UnifiedProject[] = [
  ...softwareUnified,   // software first — they're the most complete
  ...hardwareProjects,
]

// Filter helpers
export const CATALOGUE_FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'software', label: 'Software' },
  { id: 'hardware', label: 'Hardware' },
] as const

export type CatalogueFilterId = typeof CATALOGUE_FILTERS[number]['id']
