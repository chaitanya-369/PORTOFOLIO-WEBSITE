'use client'

/**
 * LinksPageClient — Omni-Channel Bio-Link UI
 *
 * This is the highest-traffic page on the portfolio.
 * YouTube / Instagram bio links land here.
 *
 * Design goals:
 * - Mobile-first, full-viewport, single scroll
 * - Large, premium CTA buttons with spring physics (Law 1 compliant)
 * - No Navbar dependency — standalone landing experience
 *
 * ─── TODO: Replace [PLACEHOLDER] values with real URLs before deployment ───
 */

import { motion } from 'framer-motion'
import Link from 'next/link'

// ─── SPRING CONFIGS ──────────────────────────────────────────────────────────

const CARD_SPRING = { type: 'spring', stiffness: 500, damping: 40, mass: 0.8 } as const
const ENTER_SPRING = { type: 'spring', stiffness: 200, damping: 28, mass: 1.2 } as const

// ─── LINK DATA ───────────────────────────────────────────────────────────────

interface BioLink {
  readonly id: string
  readonly label: string
  readonly sublabel: string
  readonly href: string
  readonly icon: React.ReactNode
  readonly isPrimary: boolean
  readonly isExternal: boolean
}

const LINKS: readonly BioLink[] = [
  {
    id: 'portfolio',
    label: 'Portfolio',
    sublabel: 'Interactive hardware & software showcase',
    href: '/',
    icon: <PortfolioIcon />,
    isPrimary: true,
    isExternal: false,
  },
  {
    id: 'github',
    label: 'GitHub',
    sublabel: '@chaitanya-369 · Open source & project code',
    href: 'https://github.com/chaitanya-369',
    icon: <GitHubIcon />,
    isPrimary: false,
    isExternal: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    sublabel: 'Professional profile & work experience',
    href: 'https://linkedin.com/in/[PLACEHOLDER]', // TODO: Add your LinkedIn handle
    icon: <LinkedInIcon />,
    isPrimary: false,
    isExternal: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    sublabel: 'Engineering build logs & technical deep-dives',
    href: 'https://youtube.com/@[PLACEHOLDER]', // TODO: Add your YouTube channel handle
    icon: <YouTubeIcon />,
    isPrimary: false,
    isExternal: true,
  },
  {
    id: 'email',
    label: 'Email',
    sublabel: 'Open to internships & collaborations',
    href: 'mailto:[PLACEHOLDER]@gmail.com', // TODO: Add your email address
    icon: <EmailIcon />,
    isPrimary: false,
    isExternal: false,
  },
]

// ─── MAIN ────────────────────────────────────────────────────────────────────

export const LinksPageClient: React.FC = () => {
  return (
    <main className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center px-6 py-24">

      {/* ── IDENTITY BLOCK ──────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col items-center text-center mb-12"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ENTER_SPRING}
      >
        {/* Monogram avatar */}
        <motion.div
          className="relative w-20 h-20 flex items-center justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...ENTER_SPRING, delay: 0.05 }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-obsidian-800 bg-obsidian-900" />
          {/* Cobalt glow at top */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.3) 0%, transparent 65%)',
            }}
          />
          {/* Outer glow ring */}
          <div
            aria-hidden="true"
            className="absolute -inset-px rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.4) 0%, transparent 60%)',
              filter: 'blur(4px)',
              opacity: 0.6,
            }}
          />
          <span className="font-display font-bold text-2xl text-white-pure relative z-10 select-none tracking-tight">
            CS
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="font-display font-semibold text-2xl text-white-pure tracking-tight mb-1.5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ENTER_SPRING, delay: 0.1 }}
        >
          Chaitanya Sangana
        </motion.h1>

        {/* Title */}
        <motion.p
          className="font-body text-white-muted text-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ENTER_SPRING, delay: 0.15 }}
        >
          ECE Engineer · Hardware &amp; Software Builder
        </motion.p>

        {/* Discipline tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...ENTER_SPRING, delay: 0.22 }}
        >
          {['PCB Design', 'VLSI', 'Embedded Systems', 'AI Systems'].map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-widest uppercase text-cobalt-glow border border-cobalt-accent/30 bg-cobalt-accent/5 px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── LINK CARDS ──────────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {LINKS.map((link, index) => (
          <LinkCard key={link.id} link={link} index={index} />
        ))}
      </div>

      {/* ── FOOTER TAG ──────────────────────────────────────────────────────── */}
      <motion.p
        className="font-mono text-white-faint text-[10px] tracking-widest uppercase mt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...ENTER_SPRING, delay: 0.75 }}
        aria-hidden="true"
      >
        © {new Date().getFullYear()} Chaitanya Sangana
      </motion.p>
    </main>
  )
}

// ─── LINK CARD ───────────────────────────────────────────────────────────────

interface LinkCardProps {
  link: BioLink
  index: number
}

const LinkCard: React.FC<LinkCardProps> = ({ link, index }) => {
  const externalProps = link.isExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.a
      href={link.href}
      {...externalProps}
      className={`
        group relative flex items-center gap-4 px-5 py-4
        border focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-cobalt-glow focus-visible:ring-offset-2
        focus-visible:ring-offset-obsidian-950
        ${link.isPrimary
          ? 'bg-cobalt-accent border-cobalt-accent text-white-pure'
          : 'bg-obsidian-900 border-obsidian-800 text-white-muted'
        }
      `}
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...ENTER_SPRING, delay: 0.27 + index * 0.07 }}
      whileHover={{
        x: 4,
        borderColor: link.isPrimary ? '#1D4ED8' : '#2563EB',
        backgroundColor: link.isPrimary ? '#1D4ED8' : '#111113',
        transition: CARD_SPRING,
      }}
      whileTap={{
        scale: 0.98,
        transition: CARD_SPRING,
      }}
    >
      {/* Icon container */}
      <span
        className={`flex-shrink-0 w-9 h-9 flex items-center justify-center ${
          link.isPrimary ? 'bg-white/15' : 'bg-obsidian-800'
        }`}
      >
        {link.icon}
      </span>

      {/* Label + sublabel */}
      <div className="flex flex-col min-w-0">
        <span className="font-display font-semibold text-sm text-white-pure tracking-tight">
          {link.label}
        </span>
        <span className="font-body text-xs text-white-muted truncate mt-0.5">
          {link.sublabel}
        </span>
      </div>

      {/* Arrow */}
      <motion.span
        className={`ml-auto flex-shrink-0 font-mono text-sm leading-none ${
          link.isPrimary ? 'text-white/60' : 'text-white-faint'
        }`}
        initial={{ x: 0, opacity: 0.6 }}
        whileHover={{ x: 3, opacity: 1 }}
        transition={CARD_SPRING}
        aria-hidden="true"
      >
        {link.isExternal ? '↗' : '→'}
      </motion.span>

      {/* Left-edge cobalt glow on hover (non-primary only) */}
      {!link.isPrimary && (
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-cobalt-accent origin-center scale-y-0 group-hover:scale-y-100"
          style={{ transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      )}
    </motion.a>
  )
}

// ─── INLINE SVG ICONS ────────────────────────────────────────────────────────
// Zero external deps — no network request, no layout shift.

function PortfolioIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-white-pure">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
      className="text-white-muted group-hover:text-white-pure" style={{ transition: 'color 0.15s' }}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
      className="text-white-muted group-hover:text-white-pure" style={{ transition: 'color 0.15s' }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
      className="text-white-muted group-hover:text-white-pure" style={{ transition: 'color 0.15s' }}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      className="text-white-muted group-hover:text-white-pure" style={{ transition: 'color 0.15s' }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
