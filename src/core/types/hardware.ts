/**
 * Hardware Types — ECE Portfolio
 * All 3D model, PCB, and hardware project interfaces live here.
 * Consumed by both src/glsl (Three.js scenes) and src/components (UI overlays).
 */

export interface HardwareProject {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly category: HardwareCategory
  readonly modelPath: string          // Path to .glb file in /public/models/
  readonly thumbnailPath: string      // Path to preview image
  readonly components: ICComponent[]  // Clickable nodes on the 3D model
  readonly tags: string[]
  readonly dateCompleted: string      // ISO 8601 date string
  readonly featured: boolean
}

export type HardwareCategory =
  | 'pcb'
  | 'vlsi'
  | 'robotics'
  | 'embedded'
  | 'fpga'
  | 'rf'

export interface ICComponent {
  readonly id: string
  readonly partNumber: string
  readonly manufacturer: string
  readonly description: string
  readonly function: string
  readonly voltage: string
  readonly packageType: string
  // 3D position on the model for tooltip placement
  readonly position: Vector3Tuple
}

// Three.js compatible tuple — avoids importing THREE.Vector3 into core types
export type Vector3Tuple = readonly [x: number, y: number, z: number]

export interface ModelLoadState {
  readonly isLoading: boolean
  readonly progress: number           // 0–100
  readonly error: string | null
}
