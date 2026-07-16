'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Applies a very subtle vertical motion blur proportional to scroll velocity.
 * Helps the eye track content during fast scrolls instead of everything
 * snapping past at once. Clamped low so text never becomes unreadable.
 *
 * NOTE: must NOT wrap any `position: fixed` elements — a CSS filter on an
 * ancestor breaks fixed positioning. Only the scrolling page sections live here.
 */
export function ScrollBlur({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let lastY = window.scrollY
    let lastT = performance.now()
    let current = 0
    let raf = 0
    let idleFrames = 0

    const tick = () => {
      const now = performance.now()
      const dy = window.scrollY - lastY
      const dt = Math.max(now - lastT, 1)
      lastY = window.scrollY
      lastT = now

      // px per ms -> map to a tiny blur, capped at 4px
      const velocity = Math.abs(dy / dt)
      const target = Math.min(velocity * 1.6, 4)

      // ease toward target for smoothness
      current += (target - current) * 0.2

      if (current < 0.05) {
        current = 0
        idleFrames++
      } else {
        idleFrames = 0
      }

      el.style.filter = current > 0.05 ? `blur(${current.toFixed(2)}px)` : ''

      // keep animating; pause loop only after a long idle to save battery
      if (idleFrames < 120) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const wake = () => {
      if (!raf) {
        lastT = performance.now()
        lastY = window.scrollY
        raf = requestAnimationFrame(tick)
      }
    }

    window.addEventListener('scroll', wake, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', wake)
      if (raf) cancelAnimationFrame(raf)
      el.style.filter = ''
    }
  }, [])

  return (
    <div ref={ref} style={{ willChange: 'filter' }}>
      {children}
    </div>
  )
}
