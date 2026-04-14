import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/glsl/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // COLOR SYSTEM — from DESIGN_SYSTEM.md
      colors: {
        obsidian: {
          950: '#0A0A0B',
          900: '#111113',
          800: '#1A1A1F',
          700: '#2A2A31',
        },
        // ACCENT — LOCKED TO COBALT (Day 2 decision)
        cobalt: {
          accent: '#2563EB',   // Primary accent — sparingly
          glow: '#3B82F6',     // Hover states, active indicators
          muted: '#1D4ED8',    // Pressed states
          subtle: '#EFF6FF',   // Never use on dark bg — reserved for future light elements
          particle: '#60A5FA', // Particle shader color — slightly lighter for bloom effect
        },
        // RESERVED — do not use until Human unlocks
        // amber: { accent: '#F59E0B', glow: '#FBB024' },
        white: {
          pure: '#FFFFFF',
          muted: '#A1A1AA',
          faint: '#52525B',
        },
      },

      // TYPOGRAPHY — Space Grotesk + Inter + Geist Mono
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      // FONT SIZE SCALE — Golden Ratio (1.618)
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'h1':   ['3rem',   { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2':   ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3':   ['1.25rem',  { lineHeight: '1.3', letterSpacing: '0',       fontWeight: '600' }],
      },

      // SPACING — Golden Ratio scale (base 4px)
      spacing: {
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
        'section': '5.25rem', // 84px — vertical section spacing
        'card': '2rem',       // 32px — internal card padding
      },

      // BACKGROUND GRADIENTS
      backgroundImage: {
        'obsidian-radial': 'radial-gradient(ellipse at top, #1A1A1F 0%, #0A0A0B 70%)',
        'cobalt-glow': 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
      },

      // ANIMATION — only used for non-interactive CSS transitions
      // Interactive animations MUST use Framer Motion (see Constitution Law 1)
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      // BOX SHADOW — for card depth
      boxShadow: {
        'obsidian': '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)',
        'cobalt-glow': '0 0 40px rgba(37,99,235,0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
