/**
 * UI Types — ECE Portfolio
 * Shared prop interfaces for components in src/components.
 * Cursor will import from here — do not import from src/components here.
 */

export interface SpringConfig {
  readonly stiffness: number
  readonly damping: number
  readonly mass: number
}

// Standard spring presets — from DESIGN_SYSTEM.md
export const SPRING_PRESETS = {
  default: { stiffness: 400, damping: 30, mass: 1 },
  snappy:  { stiffness: 600, damping: 40, mass: 0.8 },
  heavy:   { stiffness: 200, damping: 25, mass: 1.5 },
} as const satisfies Record<string, SpringConfig>

export interface NavigationItem {
  readonly label: string
  readonly href: string
  readonly isExternal?: boolean
}

export type ColorAccent = 'cobalt' | 'amber'
