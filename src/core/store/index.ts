/**
 * Zustand Store — The WebGL/DOM Bridge
 * This is the ONLY legal communication channel between src/glsl and src/components.
 * Both domains import from here. They never import from each other.
 */

import { create } from 'zustand'
import type { ModelLoadState } from '@/core/types'

interface HardwareViewerState {
  // 3D model state (written by src/glsl, read by src/components)
  readonly activeModelId: string | null
  readonly loadState: ModelLoadState
  readonly hoveredComponentId: string | null
  readonly cameraPosition: readonly [number, number, number]

  // UI overlay state (written by src/components, read by src/glsl)
  readonly isOverlayOpen: boolean
  readonly selectedComponentId: string | null
}

interface HardwareViewerActions {
  setActiveModel: (id: string | null) => void
  setLoadState: (state: ModelLoadState) => void
  setHoveredComponent: (id: string | null) => void
  setSelectedComponent: (id: string | null) => void
  setCameraPosition: (position: readonly [number, number, number]) => void
  toggleOverlay: () => void
}

type HardwareViewerStore = HardwareViewerState & HardwareViewerActions

export const useHardwareViewerStore = create<HardwareViewerStore>((set) => ({
  // Initial state
  activeModelId: null,
  loadState: { isLoading: false, progress: 0, error: null },
  hoveredComponentId: null,
  cameraPosition: [0, 0, 5],
  isOverlayOpen: false,
  selectedComponentId: null,

  // Actions
  setActiveModel: (id) => set({ activeModelId: id }),
  setLoadState: (loadState) => set({ loadState }),
  setHoveredComponent: (id) => set({ hoveredComponentId: id }),
  setSelectedComponent: (id) => set({ selectedComponentId: id, isOverlayOpen: id !== null }),
  setCameraPosition: (cameraPosition) => set({ cameraPosition }),
  toggleOverlay: () => set((state) => ({ isOverlayOpen: !state.isOverlayOpen })),
}))
