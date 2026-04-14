'use client'

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useMouseTracker } from '@/core/hooks/useMouseTracker'
import { useAppStore } from '@/core/store'

// Dynamic import — Three.js must never be in the SSR bundle
const HeroScene = dynamic(
  () => import('@/glsl/scenes/HeroScene').then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => null,
  }
)

export const HeroWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isHeroReady  = useAppStore((s) => s.isHeroReady)

  // Register mouse tracker on the hero container
  useMouseTracker({ targetRef: containerRef })

  return (
    // NO aria-hidden on the outer container — it contains interactive elements
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-obsidian-950"
      style={{ willChange: 'transform' }}
    >
      {/*
        ── DECORATIVE LAYER ──────────────────────────────────────────────────
        aria-hidden="true" applied ONLY to the visual/decorative elements.
        Screen readers skip these entirely.
      */}

      {/* WebGL Canvas — purely visual, no semantic content */}
      <div aria-hidden="true" className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Radial vignette — purely visual */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(10,10,11,0.7) 100%)',
        }}
      />

      {/*
        ── CONTENT LAYER ─────────────────────────────────────────────────────
        NOT aria-hidden. Headings and interactive elements must be accessible.
        pointer-events-none on the wrapper so the WebGL canvas receives mouse
        events; pointer-events-auto re-enabled on the CTA row specifically.
      */}
      <AnimatePresence>
        {isHeroReady && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 20,
              mass: 1.5,
            }}
          >
            {/* Eyebrow label */}
            <motion.p
              className="font-mono text-cobalt-glow text-sm tracking-wider mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: 0.1,
              }}
            >
              Hi, I am Chaitanya Sangana
            </motion.p>

            {/* Primary heading — semantic H1, accessible */}
            <motion.h1
              className="font-display text-hero text-white-pure text-center leading-none tracking-tight max-w-4xl px-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 28,
                mass: 1.2,
                delay: 0.2,
              }}
            >
              Hardware
              <br />
              <span className="text-cobalt-glow">Engineer</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="font-body text-h3 text-white-muted text-center mt-6 max-w-xl px-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
                delay: 0.35,
              }}
            >
              PCB Design · VLSI · Embedded Systems · Robotics
            </motion.p>

            {/* CTA row — pointer-events-auto re-enabled here only */}
            <motion.div
              className="flex gap-4 mt-10 pointer-events-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                delay: 0.5,
              }}
            >
              {/* Primary CTA */}
              <motion.a
                href="/hardware"
                className="px-6 py-3 bg-cobalt-accent text-white-pure font-body font-medium text-sm tracking-wide border border-cobalt-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: '#1D4ED8',
                  transition: { type: 'spring', stiffness: 600, damping: 40 },
                }}
                whileTap={{
                  scale: 0.97,
                  transition: { type: 'spring', stiffness: 600, damping: 40 },
                }}
              >
                View Hardware
              </motion.a>

              {/* Secondary CTA */}
              <motion.a
                href="https://github.com/chaitanya-369"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-transparent text-white-muted font-body font-medium text-sm tracking-wide border border-obsidian-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt-glow focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-950"
                whileHover={{
                  borderColor: '#2563EB',
                  color: '#FFFFFF',
                  transition: { type: 'spring', stiffness: 600, damping: 40 },
                }}
                whileTap={{
                  scale: 0.97,
                  transition: { type: 'spring', stiffness: 600, damping: 40 },
                }}
              >
                GitHub ↗
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        ── SCROLL INDICATOR ──────────────────────────────────────────────────
        Decorative — aria-hidden. Uses CSS animation (not Framer Motion)
        because infinite repeating springs produce erratic behavior.
        See globals.css .scroll-pulse for the animation definition.
      */}
      <AnimatePresence>
        {isHeroReady && (
          <motion.div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 20,
              mass: 1.2,
              delay: 1.2,
            }}
          >
            <span className="font-mono text-white-faint text-xs tracking-widest uppercase">
              Scroll
            </span>
            {/* CSS-animated — no JS thread cost, no Law 1 violation */}
            <div className="scroll-pulse w-px h-8 bg-gradient-to-b from-white-faint to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
