/**
 * Software Projects — Static Data Layer
 * Consumed by src/app/software/page.tsx (Server Component).
 * Domain: src/core — pure TypeScript, no UI imports.
 */

export type SoftwareCategory = 'gateway' | 'infra' | 'tools' | 'web'
export type SoftwareStatus = 'live' | 'wip' | 'archived'

export interface SoftwareProject {
  readonly id: string
  readonly title: string
  readonly blurb: string
  readonly longBlurb: string
  readonly category: SoftwareCategory
  readonly categoryLabel: string          // Display label for the filter + card
  readonly tags: readonly string[]
  readonly href: string
  readonly isExternal: boolean
  readonly year: number
  readonly status: SoftwareStatus
  /** Optional second link (e.g., docs alongside GitHub) */
  readonly secondaryHref?: string
  readonly secondaryLabel?: string
}

export const softwareProjects: readonly SoftwareProject[] = [
  {
    id: 'api-saviour',
    title: 'API Saviour',
    blurb: 'Enterprise AI control plane with real-time budget enforcement, PII scrubbing middleware, and a programmable plugin engine across every LLM provider.',
    longBlurb: 'A production-grade AI API gateway that sits between your applications and any LLM provider. Features hard/soft budget caps with emergency freeze, automatic PII detection and scrubbing, a live plugin marketplace with an in-browser edge code editor, and a full admin dashboard with real-time telemetry.',
    category: 'gateway',
    categoryLabel: 'GATEWAY · AI INFRA',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'OpenAI', 'Anthropic'],
    href: 'https://github.com/chaitanya-369/API-SAVIOUR',
    isExternal: true,
    year: 2026,
    status: 'live',
  },
  {
    id: 'org-memory',
    title: 'ORG-MEMORY',
    blurb: 'Organisation-wide contextual memory store for LLM workflows — hierarchical data structure with fast vector retrieval and team-scoped access control.',
    longBlurb: 'A shared long-term memory layer for AI-powered teams. Stores structured knowledge across sessions, namespaced by team and project. Supports semantic search via vector embeddings, role-based access, and a REST API for direct integration into any LLM pipeline.',
    category: 'infra',
    categoryLabel: 'INFRA · LLM',
    tags: ['Node.js', 'TypeScript', 'Redis', 'REST API', 'Vector Search'],
    href: 'https://github.com/chaitanya-369/ORG-MEMORY',
    isExternal: true,
    year: 2026,
    status: 'live',
  },
  {
    id: 'ece-portfolio',
    title: 'This Portfolio',
    blurb: 'Enterprise-grade ECE portfolio built with a 4-AI orchestration pipeline. WebGL particle hero, interactive 3D hardware viewer, and a full App Router architecture.',
    longBlurb: 'A $150k-tier personal engineering portfolio showcasing hardware and software work. Built using Next.js 14 App Router, React Three Fiber for WebGL, Framer Motion spring physics, and a strict TypeScript codebase. Deployed on Vercel Edge.',
    category: 'web',
    categoryLabel: 'WEB · PORTFOLIO',
    tags: ['Next.js 14', 'React Three Fiber', 'Framer Motion', 'TypeScript', 'Tailwind'],
    href: '/',
    isExternal: false,
    year: 2026,
    status: 'wip',
  },
]

/** All unique categories that exist in the data, for filter generation */
export const SOFTWARE_FILTERS = [
  { id: 'all',     label: 'All' },
  { id: 'gateway', label: 'Gateway' },
  { id: 'infra',   label: 'Infra' },
  { id: 'web',     label: 'Web' },
  { id: 'tools',   label: 'Tools' },
] as const

export type FilterId = typeof SOFTWARE_FILTERS[number]['id']

export const softwareStats = [
  { label: 'Systems Shipped', value: 2 },
  { label: 'Lines of TypeScript', value: '10k+' },
  { label: 'LLM Providers Supported', value: 4 },
] as const
