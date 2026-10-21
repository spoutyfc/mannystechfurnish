'use client'

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  animate,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from 'react'

/* ---------- Easing ---------- */
const EASE = [0.16, 1, 0.3, 1] as const

/* ---------- Word-by-word headline reveal ---------- */
export function AnimatedHeading({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
}: {
  text: string
  className?: string
  as?: ElementType
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -8% 0px' })
  const words = text.split(' ')

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', filter: 'blur(6px)' }}
              animate={
                inView
                  ? { y: 0, filter: 'blur(0px)' }
                  : { y: '110%', filter: 'blur(6px)' }
              }
              transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.07 }}
            >
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  )
}

/* ---------- Generic scroll reveal ---------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE, delay: i * 0.08 },
  }),
}

export function FadeUp({
  children,
  className = '',
  index = 0,
}: {
  children: ReactNode
  className?: string
  index?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' })
  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Magnetic wrapper (buttons / links) ---------- */
export function Magnetic({
  children,
  className = '',
  strength = 0.4,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Count-up number ---------- */
export function CountUp({
  value,
  className = '',
}: {
  value: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduceMotion = useReducedMotion()

  // The final value is rendered on the server, so crawlers, no-JS visitors and
  // reduced-motion users always see the real number. When the stat scrolls
  // into view the text is animated up to that value by writing to the DOM
  // node directly, which avoids a re-render per frame.
  useEffect(() => {
    const node = ref.current
    if (!node || !inView || reduceMotion) return

    const match = value.match(/(\d[\d,.]*)/)
    if (!match) return
    const raw = match[1].replace(/,/g, '')
    const num = parseFloat(raw)
    if (!Number.isFinite(num)) return
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
    const prefix = value.slice(0, match.index)
    const suffix = value.slice((match.index ?? 0) + match[1].length)

    const controls = animate(0, num, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => {
        const formatted = v.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
        node.textContent = `${prefix}${formatted}${suffix}`
      },
      onComplete: () => {
        node.textContent = value
      },
    })
    return () => {
      controls.stop()
      node.textContent = value
    }
  }, [inView, reduceMotion, value])

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}

/* ---------- Parallax (translate based on scroll) ---------- */
export function Parallax({
  children,
  className = '',
  distance = 80,
}: {
  children: ReactNode
  className?: string
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

/* ---------- Cinematic clip-path reveal (for images/media) ---------- */
export function ClipReveal({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
}: {
  children: ReactNode
  className?: string
  delay?: number
  from?: 'bottom' | 'left'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const hidden =
    from === 'left' ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)'
  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: hidden }}
      animate={inView ? { clipPath: 'inset(0 0 0 0)' } : { clipPath: hidden }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 3D tilt-on-hover wrapper (cards / media) ---------- */
export function Tilt({
  children,
  className = '',
  max = 10,
  scale = 1.02,
}: {
  children: ReactNode
  className?: string
  max?: number
  scale?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 150, damping: 15, mass: 0.4 })
  const sry = useSpring(ry, { stiffness: 150, damping: 15, mass: 0.4 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * max * 2)
    rx.set(-py * max * 2)
  }
  const reset = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformStyle: 'preserve-3d',
        transformPerspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
