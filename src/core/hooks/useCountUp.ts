'use client'

/**
 * useCountUp — Framer Motion count-up animation hook
 *
 * Uses Framer Motion's `useMotionValue` + `animate()` to count from 0 to a
 * target value when the component enters the viewport. Zero rAF loops — the
 * animation runs entirely on Framer's internal animation scheduler.
 *
 * Constitution Law 1 compliant: no CSS transitions, pure Framer engine.
 */

import { useEffect } from 'react'
import { useMotionValue, useTransform, animate } from 'framer-motion'

interface UseCountUpOptions {
  /** The final number to count to */
  readonly target: number
  /** Whether the element is currently in view — triggers the animation */
  readonly inView: boolean
  /** Duration in seconds (default: 1.4) */
  readonly duration?: number
}

interface UseCountUpReturn {
  /** Framer MotionValue that outputs a rounded integer string */
  readonly displayValue: ReturnType<typeof useTransform<number, string>>
}

export function useCountUp({
  target,
  inView,
  duration = 1.4,
}: UseCountUpOptions): UseCountUpReturn {
  const motionValue = useMotionValue(0)

  // Transform the raw motion number into a rounded integer string
  const displayValue = useTransform(motionValue, (v) =>
    Math.round(v).toString()
  )

  useEffect(() => {
    if (!inView) return

    const controls = animate(motionValue, target, {
      duration,
      ease: [0.16, 1, 0.3, 1], // exponential ease-out — feels like spring without overshoot
    })

    // Cancel animation on unmount
    return () => controls.stop()
  }, [inView, target, duration, motionValue])

  return { displayValue }
}
