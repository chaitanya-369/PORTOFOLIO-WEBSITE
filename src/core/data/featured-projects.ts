/**
 * Featured Projects — Static Showcase Data
 * Consumed by src/components/home/FeaturedSection (Server Component).
 * All project data is declared here; UI never imports from src/glsl.
 */

export type ProjectDomain = 'hardware' | 'software'
export type ProjectSize = 'large' | 'medium' | 'narrow'

export interface FeaturedProject {
  readonly id: string
  readonly title: string
  readonly blurb: string
  readonly category: string
  readonly domain: ProjectDomain
  readonly tags: readonly string[]
  readonly href: string
  readonly isExternal: boolean
  readonly year: number
  readonly size: ProjectSize
  readonly comingSoon?: boolean
}

export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: 'esp32-board',
    title: 'ESP32 Custom Dev Board',
    blurb:
      '4-layer impedance-matched PCB around an ESP32-S3 with integrated LiPo charging, high-speed USB-C, and a 9-axis IMU for autonomous robotics control.',
    category: 'PCB · HARDWARE',
    domain: 'hardware',
    tags: ['Altium', 'ESP32-S3', 'LiPo', 'IMU'],
    href: '/hardware',
    isExternal: false,
    year: 2025,
    size: 'large',
  },
  {
    id: 'api-saviour',
    title: 'API Saviour',
    blurb:
      'Enterprise AI control plane with real-time budget enforcement, PII scrubbing middleware, and a programmable plugin engine across every LLM provider.',
    category: 'GATEWAY · SOFTWARE',
    domain: 'software',
    tags: ['Next.js', 'PostgreSQL', 'TypeScript'],
    href: 'https://github.com/chaitanya-369/API-SAVIOUR',
    isExternal: true,
    year: 2026,
    size: 'narrow',
  },
  {
    id: 'org-memory',
    title: 'ORG-MEMORY',
    blurb:
      'Organisation-wide contextual memory store for LLM workflows — hierarchical data structure with fast vector retrieval and team-scoped access control.',
    category: 'INFRA · SOFTWARE',
    domain: 'software',
    tags: ['Node.js', 'Redis', 'TypeScript'],
    href: 'https://github.com/chaitanya-369/ORG-MEMORY',
    isExternal: true,
    year: 2026,
    size: 'medium',
  },
  {
    id: 'standard',
    title: 'The Standard',
    blurb:
      'A definitive technical manifest for high-performance, type-safe, and deterministic systems design.',
    category: 'SPEC · INFRA',
    domain: 'software',
    tags: ['Architecture', 'Philosophy', 'NixOS', 'Rust'],
    href: '/standard',
    isExternal: false,
    year: 2026,
    size: 'medium',
  },
]

export const portfolioStats = [
  { label: 'Hardware Projects', value: 4 },
  { label: 'Software Systems', value: 3 },
  { label: 'Chip-Level Designs', value: 2 },
] as const
