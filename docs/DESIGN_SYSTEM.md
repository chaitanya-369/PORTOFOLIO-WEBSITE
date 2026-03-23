# ECE Portfolio — Design System

## Color Tokens
| Token | Hex | Usage |
|-------|-----|-------|
| obsidian-950 | #0A0A0B | Primary background |
| obsidian-900 | #111113 | Card backgrounds |
| obsidian-800 | #1A1A1F | Subtle borders |
| white-pure | #FFFFFF | Primary text |
| white-muted | #A1A1AA | Secondary text |
| cobalt-accent | #2563EB | Primary accent — use sparingly |
| cobalt-glow | #3B82F6 | Hover states, active indicators |

## ACCENT COLOR — LOCKED: Electric Cobalt
**Decision date:** Day 2
**Chosen:** cobalt-accent #2563EB
**Rejected:** amber-accent #F59E0B — reserved for future consideration only
**Rule:** No amber tones anywhere in the codebase unless explicitly unlocked by Human.

## Typography Scale (Golden Ratio: 1.618)
| Role | Size | Weight | Font |
|------|------|--------|------|
| Hero | 72px / 4.5rem | 800 | Space Grotesk |
| H1 | 48px / 3rem | 700 | Space Grotesk |
| H2 | 30px / 1.875rem | 600 | Space Grotesk |
| H3 | 20px / 1.25rem | 600 | Inter |
| Body | 16px / 1rem | 400 | Inter |
| Caption | 12px / 0.75rem | 400 | Inter |
| Mono | 14px / 0.875rem | 400 | Geist Mono |

## Motion Laws (MANDATORY — NO EXCEPTIONS)
- BANNED: `transition: all 0.3s ease-in-out` — never use this
- BANNED: CSS keyframes for interactive elements
- REQUIRED: All interactive motion uses Framer Motion `type: "spring"`
- Default spring: `{ stiffness: 400, damping: 30, mass: 1 }`
- Snappy spring: `{ stiffness: 600, damping: 40, mass: 0.8 }`
- Heavy spring: `{ stiffness: 200, damping: 25, mass: 1.5 }`

## Spacing (Golden Ratio Padding Scale)
- Base unit: 4px
- Scale: 4, 8, 12, 20, 32, 52, 84, 136px
- Card internal padding: 32px
- Section vertical spacing: 84px
- Component gap: 20px
