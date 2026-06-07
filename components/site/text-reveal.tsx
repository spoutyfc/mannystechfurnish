'use client'

import { useEffect, useRef, useState, type ElementType } from 'react'

interface TextRevealProps {
  text: string
  className?: string
  as?: ElementType
  /** ms between each word */
  stagger?: number
}

/**
 * Splits text into words and reveals each with a clip-up animation on scroll.
 * Words are rendered in the DOM at all times (SEO + no-JS safe); only the
 * inner span transform animates. Falls back to fully visible.
 */
export function TextReveal({ text, className = '', as, stagger = 60 }: TextRevealProps) {
  const Tag: ElementType = as || 'h2'
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.2 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  const words = text.split(' ')

  return (
    <Tag ref={ref as never} className={className} data-reveal-text={visible ? 'in' : 'out'}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="word-reveal-mask">
            <span
              className="word-reveal-inner"
              style={{ transitionDelay: `${i * stagger}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
