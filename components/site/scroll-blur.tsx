'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Lightweight scroll-performance wrapper.
 * Promotes the page content to its own compositor layer via will-change: transform
 * so the GPU handles scrolling without CPU repaints.
 * No CSS filter — filters break fixed positioning and compound Framer blur animations.
 */
export function ScrollBlur({ children }: { children: ReactNode }) {
  return (
    <div style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
