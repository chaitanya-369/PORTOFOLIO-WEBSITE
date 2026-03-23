'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/core/store'

interface UseMouseTrackerOptions {
  // The element to track mouse events on (defaults to window)
  targetRef?: React.RefObject<HTMLElement | null>
}

export const useMouseTracker = ({ targetRef }: UseMouseTrackerOptions = {}): void => {
  const updateMouse      = useAppStore((s) => s.updateMouse)
  const setMouseOverCanvas = useAppStore((s) => s.setMouseOverCanvas)
  const rafRef           = useRef<number | null>(null)
  const pendingRef       = useRef<{ x: number; y: number; rawX: number; rawY: number } | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent): void => {
    // Convert to NDC (-1 to +1) relative to viewport
    const x = (e.clientX / window.innerWidth)  * 2 - 1
    const y = -((e.clientY / window.innerHeight) * 2 - 1)  // Flip Y for WebGL

    pendingRef.current = { x, y, rawX: e.clientX, rawY: e.clientY }

    // Throttle store updates to animation frame rate
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        if (pendingRef.current !== null) {
          const { x, y, rawX, rawY } = pendingRef.current
          updateMouse(x, y, rawX, rawY)
          pendingRef.current = null
        }
        rafRef.current = null
      })
    }
  }, [updateMouse])

  const handleMouseEnter = useCallback((): void => {
    setMouseOverCanvas(true)
  }, [setMouseOverCanvas])

  const handleMouseLeave = useCallback((): void => {
    setMouseOverCanvas(false)
    // Reset mouse to center when it leaves
    updateMouse(0, 0, window.innerWidth / 2, window.innerHeight / 2)
  }, [setMouseOverCanvas, updateMouse])

  useEffect((): (() => void) => {
    const target = targetRef?.current ?? window

    target.addEventListener('mousemove', handleMouseMove as EventListener)
    target.addEventListener('mouseenter', handleMouseEnter as EventListener)
    target.addEventListener('mouseleave', handleMouseLeave as EventListener)

    return () => {
      target.removeEventListener('mousemove', handleMouseMove as EventListener)
      target.removeEventListener('mouseenter', handleMouseEnter as EventListener)
      target.removeEventListener('mouseleave', handleMouseLeave as EventListener)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, targetRef])
}
