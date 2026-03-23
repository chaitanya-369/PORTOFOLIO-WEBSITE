/**
 * Zustand Store — The WebGL/DOM Bridge
 * This is the ONLY legal communication channel between src/glsl and src/components.
 * Both domains import from here. They never import from each other.
 */

'use client'

import { create } from 'zustand'
import type { ModelLoadState } from '@/core/types'

// ─── MOUSE PHYSICS STATE ────────────────────────────────────────────────────

interface MouseState {
  // Normalized device coordinates (-1 to +1)
  readonly x: number
  readonly y: number
  // Raw pixel coordinates
  readonly rawX: number
  readonly rawY: number
  // Velocity (pixels per frame — used to calculate force on particles)
  readonly velocityX: number
  readonly velocityY: number
  // Speed magnitude — used for particle scatter radius
  readonly speed: number
  // Whether mouse is currently over the hero canvas
  readonly isOverCanvas: boolean
}

// ─── HARDWARE VIEWER STATE ──────────────────────────────────────────────────

interface HardwareViewerState {
  readonly activeModelId: string | null
  readonly loadState: ModelLoadState
  readonly hoveredComponentId: string | null
  readonly cameraPosition: readonly [number, number, number]
  readonly isOverlayOpen: boolean
  readonly selectedComponentId: string | null
}

// ─── HERO SHADER STATE ──────────────────────────────────────────────────────

interface HeroShaderState {
  // Whether the hero canvas has finished its entrance animation
  readonly isHeroReady: boolean
  // Frame count — used for time-based shader uniforms
  readonly frameCount: number
  // Current particle count (dynamic — reduces on mobile)
  readonly particleCount: number
}

// ─── COMBINED STORE ─────────────────────────────────────────────────────────

interface StoreState extends MouseState, HardwareViewerState, HeroShaderState {}

interface StoreActions {
  // Mouse actions (called by DOM event handlers in src/components)
  updateMouse: (x: number, y: number, rawX: number, rawY: number) => void
  setMouseOverCanvas: (over: boolean) => void

  // Hardware viewer actions
  setActiveModel: (id: string | null) => void
  setLoadState: (state: ModelLoadState) => void
  setHoveredComponent: (id: string | null) => void
  setSelectedComponent: (id: string | null) => void
  setCameraPosition: (position: readonly [number, number, number]) => void
  toggleOverlay: () => void

  // Hero shader actions (called by the R3F scene)
  setHeroReady: (ready: boolean) => void
  incrementFrame: () => void
  setParticleCount: (count: number) => void
}

type AppStore = StoreState & StoreActions

// ─── STORE INSTANCE ─────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>((set, get) => ({
  // Mouse initial state
  x: 0,
  y: 0,
  rawX: 0,
  rawY: 0,
  velocityX: 0,
  velocityY: 0,
  speed: 0,
  isOverCanvas: false,

  // Hardware viewer initial state
  activeModelId: null,
  loadState: { isLoading: false, progress: 0, error: null },
  hoveredComponentId: null,
  cameraPosition: [0, 0, 5],
  isOverlayOpen: false,
  selectedComponentId: null,

  // Hero shader initial state
  isHeroReady: false,
  frameCount: 0,
  particleCount: 3000,

  // ── Mouse actions ──────────────────────────────────────────────────────────
  updateMouse: (x, y, rawX, rawY) => {
    const prev = get()
    const velocityX = rawX - prev.rawX
    const velocityY = rawY - prev.rawY
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY)
    set({ x, y, rawX, rawY, velocityX, velocityY, speed })
  },

  setMouseOverCanvas: (over) => set({ isOverCanvas: over }),

  // ── Hardware viewer actions ────────────────────────────────────────────────
  setActiveModel: (id) => set({ activeModelId: id }),
  setLoadState: (loadState) => set({ loadState }),
  setHoveredComponent: (id) => set({ hoveredComponentId: id }),
  setSelectedComponent: (id) => set({
    selectedComponentId: id,
    isOverlayOpen: id !== null,
  }),
  setCameraPosition: (cameraPosition) => set({ cameraPosition }),
  toggleOverlay: () => set((state) => ({ isOverlayOpen: !state.isOverlayOpen })),

  // ── Hero shader actions ────────────────────────────────────────────────────
  setHeroReady: (ready) => set({ isHeroReady: ready }),
  incrementFrame: () => set((state) => ({ frameCount: state.frameCount + 1 })),
  setParticleCount: (count) => set({ particleCount: count }),
}))

// ─── SELECTOR HOOKS (prevents unnecessary re-renders) ───────────────────────

export const useMouseState = (): MouseState =>
  useAppStore((s) => ({
    x: s.x, y: s.y,
    rawX: s.rawX, rawY: s.rawY,
    velocityX: s.velocityX, velocityY: s.velocityY,
    speed: s.speed, isOverCanvas: s.isOverCanvas,
  }))

export const useHeroShaderState = (): HeroShaderState =>
  useAppStore((s) => ({
    isHeroReady: s.isHeroReady,
    frameCount: s.frameCount,
    particleCount: s.particleCount,
  }))
