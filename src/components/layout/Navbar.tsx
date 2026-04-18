'use client'

import { motion, type Transition } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Raw hex values — Framer Motion cannot interpolate CSS custom properties (var(--…))
const COLOR_ACTIVE = '#FFFFFF'   // --color-white-pure
const COLOR_MUTED = '#A1A1AA'   // --color-white-muted

const navLinks = [
  { name: 'Software', path: '/software' },
  { name: 'Hardware', path: '/hardware' },
  { name: 'Standard', path: '/standard' },
  { name: 'Projects', path: '/projects' },
  { name: 'Links', path: '/links' },
]

export const Navbar: React.FC = () => {
  const pathname = usePathname()

  // Physics preset — Constitution Law 1
  const linkSpring: Transition = { type: 'spring', stiffness: 600, damping: 40, mass: 0.8 }

  return (
    // Plain <header> so the entrance animation never re-fires on client-side navigation.
    // The one-shot slide-in is handled by the .navbar-enter CSS keyframe in globals.css.
    <header className="navbar-enter fixed top-0 inset-x-0 z-50 h-22 flex items-center justify-between px-8 border-b border-obsidian-800/50 bg-obsidian-950/70 backdrop-blur-md">

      {/* ── LOGO (Left) ── */}
      <Link
        href="/"
        className="group flex flex-col items-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950 rounded-sm"
      >
        <motion.div
          className="flex items-baseline"
          whileHover={{ x: 2 }}
          transition={linkSpring}
        >
          <span className="font-display font-semibold text-lg md:text-xl tracking-normal text-white-pure">
            Chaitanya Sangana
          </span>
        </motion.div>
      </Link>

      {/* ── GLOBAL NAVIGATION (Center) ── */}
      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = pathname?.startsWith(link.path)
          return (
            <Link
              key={link.name}
              href={link.path}
              className="relative px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950 rounded-sm"
            >
              {/*
                Framer Motion owns color exclusively via animate/whileHover.
                NO Tailwind text-color classes here — mixing Tailwind color
                classes with FM color animation causes the double-flash.
                NO separate `transition` prop — one spring handles everything.
              */}
              <motion.span
                className="block font-body text-sm font-medium tracking-wide"
                animate={{ color: isActive ? COLOR_ACTIVE : COLOR_MUTED }}
                whileHover={{ y: -1, color: COLOR_ACTIVE }}
                transition={linkSpring}
              >
                {link.name}
              </motion.span>

              {/*
                initial={false} → skip the mount animation so the indicator
                doesn't slide in from nowhere on every navigation, only
                smoothly glides between positions via layoutId.
              */}
              {isActive && (
                <motion.div
                  layoutId="navbar-active-indicator"
                  className="absolute -bottom-2 inset-x-0 h-px bg-cobalt-glow"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 1 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── GITHUB CTA (Right) ── */}
      <div className="flex items-center">
        <motion.a
          href="https://github.com/chaitanya-369"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-obsidian-900 border border-obsidian-800 text-white-pure font-body font-medium text-xs tracking-wider uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950 rounded-sm"
          whileHover={{ borderColor: '#2563EB', backgroundColor: '#111113' }}
          whileTap={{ scale: 0.96 }}
          transition={linkSpring}
        >
          GitHub ↗
        </motion.a>
      </div>

    </header>
  )
}
