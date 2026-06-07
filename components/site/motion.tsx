'use client'

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  animate,
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
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const words = text.split(' ')

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: '110%' }}
              animate={inView ? { y: 0 } : { y: '110%' }}
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
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.08 },
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
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
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
  const [display, setDisplay] = useState('0')

  // Parse numeric portion + prefix/suffix (e.g. "340%", "12+", "Page 1")
  const match = value.match(/(\d[\d,.]*)/)
  const num = match ? parseFloat(match[1].replace(/,/g, '')) : null
  const prefix = match ? value.slice(0, match.index) : ''
  const suffix = match ? value.slice((match.index ?? 0) + match[1].length) : ''

  useEffect(() => {
    if (!inView) return
    if (num === null) {
      setDisplay(value)
      return
    }
    const controls = animate(0, num, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setDisplay(`${prefix}${Math.round(v).toLocaleString()}${suffix}`),
    })
    return () => controls.stop()
  }, [inView, num, prefix, suffix, value])

  return (
    <span ref={ref} className={className}>
      {display}
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
