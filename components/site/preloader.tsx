'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const EASE = [0.76, 0, 0.24, 1] as const

export function Preloader() {
  const [done, setDone] = useState(false)
  const [count, setCount] = useState(0)
  const reduce = useReducedMotion()

  // Lock scroll while the intro plays.
  useEffect(() => {
    if (done) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [done])

  // Animate the percentage counter from 0 -> 100.
  useEffect(() => {
    if (reduce) {
      setCount(100)
      const t = setTimeout(() => setDone(true), 300)
      return () => clearTimeout(t)
    }
    const duration = 1900
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      // ease-out so it slows near the end
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: EASE }}
        >
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 overflow-hidden"
          >
            <span className="font-display text-sm font-medium uppercase tracking-[0.4em] text-neutral-400">
              Manny&apos;s Tech Furnish
            </span>
          </motion.div>

          {/* Giant counter */}
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="block font-display text-[22vw] font-extrabold leading-none tracking-tighter text-white md:text-[14rem]"
            >
              {count}
              <span className="text-[hsl(var(--accent))] text-fuchsia-500">%</span>
            </motion.span>
          </div>

          {/* Progress line */}
          <div className="mt-2 h-px w-[60vw] max-w-md overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-fuchsia-500"
              style={{ width: `${count}%` }}
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500"
          >
            Crafting your experience
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
