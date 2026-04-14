# Chaitanya Sangana — ECE Portfolio

> **Hardware Engineer & Software Builder** · PCB Design · VLSI · Embedded Systems · AI Systems

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![React Three Fiber](https://img.shields.io/badge/R3F-WebGL-FF6B00?style=flat-square)](https://docs.pmnd.rs/react-three-fiber)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat-square)](https://www.framer.com/motion)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

---

## Overview

A **$150k-tier ECE portfolio** built as an enterprise-grade product — not a resume site. The design language borrows from Vercel (minimalist, dark, performance-first) and Teenage Engineering (brutalist, hardware-centric). Every interaction is physically simulated. Every pixel serves a function.

Built with a **4-AI orchestration pipeline** where each agent owns a domain:

| Agent | Domain | Responsibility |
|---|---|---|
| **Antigravity** | `src/glsl/`, architecture, terminal | WebGL, R3F, system design, CI/CD |
| **Cursor** | `src/components/` | React UI, Tailwind, Framer Motion polish |
| **Windsurf** | Logic audit branch | Memory leaks, re-render tracing, perf |
| **Claude** | `src/core/`, docs | TypeScript math, case studies, planning |

---

## System Architecture

```
portfolio-root/
│
├── src/
│   ├── core/                   ← Pure TypeScript (no UI). Claude's domain.
│   │   ├── api/github.ts       ← Server-side GitHub contribution fetcher
│   │   ├── data/               ← Static project data layers
│   │   ├── store/index.ts      ← Zustand (WebGL ↔ DOM bridge)
│   │   ├── types/              ← Strict interfaces for all domains
│   │   ├── hooks/              ← Custom React hooks
│   │   └── math/               ← Physics & engineering formulas
│   │
│   ├── components/             ← React UI. Cursor's domain.
│   │   ├── layout/             ← Navbar, HeroWrapper, PageTransitionWrapper
│   │   ├── home/               ← FeaturedSection, ProjectCard, ContributionHeatmap
│   │   ├── software/           ← SoftwareGallery, SoftwareCard
│   │   ├── hardware/           ← HardwareSidebar, LoadingOverlay
│   │   ├── links/              ← LinksPageClient (bio-link page)
│   │   ├── ui/                 ← Atomic components (Button, Tag, Tooltip)
│   │   └── mdx/                ← MDX renderers for case studies
│   │
│   ├── glsl/                   ← WebGL/R3F. Antigravity's domain.
│   │   ├── scenes/             ← HeroParticles, HeroScene, HardwareScene
│   │   ├── shaders/            ← particle.vert, particle.frag (GLSL)
│   │   ├── loaders/            ← .glb model loaders with Suspense
│   │   └── materials/          ← Custom Three.js materials
│   │
│   └── app/                    ← Next.js App Router
│       ├── page.tsx            ← Homepage (async RSC — GitHub fetch)
│       ├── hardware/           ← 3D model explorer [PAUSED: needs .glb]
│       ├── software/           ← Software project gallery
│       ├── links/              ← Bio-link landing page
│       └── projects/[slug]/    ← MDX case study pages
│
├── docs/
│   ├── LATEST_STATE.json       ← AI session handover manifest
│   ├── ARCHITECTURE.md         ← This diagram + domain ownership
│   └── DESIGN_SYSTEM.md        ← Color tokens, typography, spacing
│
└── project-instructions.txt    ← THE CONSTITUTION (6 laws, read by all agents)
```

---

## Domain Dependency Graph

```
                    ┌─────────────────────┐
                    │   src/core/store    │ ← Zustand (WebGL ↔ DOM bridge)
                    └──────────┬──────────┘
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌─────────────────┐              ┌──────────────────┐
    │  src/components │              │    src/glsl      │
    │  (React + DOM)  │              │  (WebGL + R3F)   │
    └────────┬────────┘              └────────┬─────────┘
             │                               │
             └─────────────┬─────────────────┘
                           ▼
               ┌─────────────────────┐
               │     src/core        │
               │  (types, data, api) │
               └─────────────────────┘
```

**The Iron Rule:** `src/components` and `src/glsl` **never import from each other**. Zustand is the only legal communication channel. Violating this causes GPU memory leaks.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14+ App Router | SSR, React Server Components, streaming |
| Language | TypeScript (strict) | `any` banned — build fails on violations |
| Styling | Tailwind CSS v3 + CSS Modules | Layout at speed, bespoke animations |
| 3D / WebGL | Three.js + React Three Fiber | Native React ↔ WebGL component bridge |
| Animation | Framer Motion | Spring physics — no CSS `ease-in-out` allowed |
| State | Zustand | WebGL ↔ DOM bridge, mouse physics, hardware viewer |
| Content | MDX | Interactive 3D viewers embedded in prose |
| Fonts | Inter + Space Grotesk + Geist Mono | Loaded via next/font — zero layout shift |
| Deploy | Vercel Edge Network | Global CDN, instant deploys on push to main |

---

## Pages & Features

| Route | Status | Description |
|---|---|---|
| `/` | ✅ **Live** | Galaxy particle hero (GLSL) + Featured work grid + GitHub heatmap |
| `/software` | ✅ **Live** | Software project gallery with category filter tabs |
| `/links` | ✅ **Scaffold** | Bio-link landing — URLs pending |
| `/hardware` | ⏸️ **Paused** | 3D PCB/chip explorer — awaiting `.glb` CAD files |
| `/projects/[slug]` | 🔶 **Stub** | MDX case study pages — content pending |

---

## The 6 Engineering Laws

These are non-negotiable. All AI agents read `project-instructions.txt` before every session.

1. **Physics Law** — No CSS transitions on interactive elements. All motion = Framer Motion springs with explicit `mass`, `stiffness`, `damping`.
2. **TypeScript Law** — `any` is banned. Build fails. All shapes typed with generics.
3. **Handover Law** — Every session ends with an updated `docs/LATEST_STATE.json`.
4. **Isolation Law** — `src/components` ↔ `src/glsl` never import each other. Zustand only.
5. **Performance Law** — Lighthouse ≥ 95 on mobile. RSC for all static content.
6. **Commit Law** — Conventional Commits enforced: `feat(scope): description`.

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:3000

# Type check
npx tsc --noEmit

# Production build
npm run build
```

---

## Project Structure Rules

```bash
# Adding a new page
src/app/<route>/page.tsx          # Server Component, export metadata
src/components/<route>/Client.tsx # 'use client' boundary for animations

# Adding a new data type
src/core/types/<domain>.ts        # Strict interface, export from index.ts

# Adding a new static data source
src/core/data/<name>.ts           # Pure TS, no UI imports

# Adding a new API call
src/core/api/<service>.ts         # Server-only, use next: { revalidate: N }
```

---

## Hardware Projects (Roadmap)

When `.glb` CAD files are provided by the engineer:

1. Drop files into `public/models/`
2. Update `src/core/data/hardware-mock.ts` with real component data
3. Uncomment WebGL scene in `src/app/hardware/page.tsx`
4. Activate `HardwareSidebar` with IC spec click-through system

---

*Built by [Chaitanya Sangana](https://github.com/chaitanya-369) with a 4-AI orchestration pipeline.*
*Architecture: Antigravity · UI: Cursor · Logic: Windsurf · TypeScript: Claude*
