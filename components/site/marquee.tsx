'use client'

import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** seconds per loop; lower = faster */
  speed?: number
  reverse?: boolean
  className?: string
}

/**
 * Pure-CSS infinite marquee. Content duplicated for a seamless loop.
 * Pauses on hover. Honors prefers-reduced-motion (handled in globals.css).
 */
export function Marquee({ children, speed = 24, reverse = false, className = '' }: MarqueeProps) {
  return (
    <div className={`marquee group relative flex overflow-hidden ${className}`}>
      <div
        className="marquee-track flex shrink-0 items-center"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className="marquee-track flex shrink-0 items-center"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {children}
      </div>
    </div>
  )
}
