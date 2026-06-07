'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

/**
 * Smooth-scroll + magnetic custom cursor + top scroll-progress bar.
 * All progressive enhancement: if JS fails, native scroll still works
 * and the cursor simply isn't shown (system cursor remains via CSS fallback).
 */
export function ExperienceLayer() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(pointer: coarse)').matches

    // ---- Smooth scroll ----
    let lenis: Lenis | null = null
    let rafId = 0
    if (!reduceMotion) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 })
      const raf = (time: number) => {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    // ---- Scroll progress bar ----
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const pct = max > 0 ? (h.scrollTop || window.scrollY) / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // ---- Custom cursor (desktop only) ----
    let cursorRaf = 0
    if (!isTouch) {
      setEnabled(true)
      let mx = window.innerWidth / 2
      let my = window.innerHeight / 2
      let rx = mx
      let ry = my

      const onMove = (e: PointerEvent) => {
        mx = e.clientX
        my = e.clientY
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
        }
        const target = e.target as HTMLElement
        const interactive = target.closest('a, button, [data-cursor="hover"]')
        if (ringRef.current) {
          ringRef.current.dataset.hover = interactive ? 'true' : 'false'
        }
      }

      const follow = () => {
        rx += (mx - rx) * 0.15
        ry += (my - ry) * 0.15
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
        }
        cursorRaf = requestAnimationFrame(follow)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      cursorRaf = requestAnimationFrame(follow)

      return () => {
        cancelAnimationFrame(rafId)
        cancelAnimationFrame(cursorRaf)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('pointermove', onMove)
        lenis?.destroy()
      }
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      lenis?.destroy()
    }
  }, [])

  return (
    <>
      {/* Scroll progress */}
      <div
        ref={barRef}
        aria-hidden="true"
        className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-fuchsia-400"
      />
      {/* Custom cursor */}
      {enabled && (
        <>
          <div
            ref={dotRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[70] -ml-1 -mt-1 h-2 w-2 rounded-full bg-fuchsia-400 mix-blend-difference"
          />
          <div
            ref={ringRef}
            aria-hidden="true"
            data-hover="false"
            className="cursor-ring pointer-events-none fixed left-0 top-0 z-[70] -ml-5 -mt-5 h-10 w-10 rounded-full border border-fuchsia-300/60 mix-blend-difference transition-[width,height,margin,background-color] duration-200"
          />
        </>
      )}
    </>
  )
}
