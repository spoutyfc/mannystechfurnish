'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Props = {
  src: string
  alt: string
  /** 0-1, how dark the overlay is. Higher = darker / more text contrast. */
  intensity?: number
  priority?: boolean
}

/**
 * Cinematic media backdrop: a slow Ken-Burns zoom paired with scroll-linked
 * parallax, sitting behind a heavy dark gradient so foreground text stays
 * razor-sharp. Reads like ambient video without the file weight.
 */
export function MediaBackdrop({ src, alt, intensity = 0.72, priority = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Parallax drift as the section moves through the viewport.
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -top-[10%] h-[120%]">
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.18 }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        >
          <Image
            src={src || '/placeholder.svg'}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      {/* Contrast scrim: solid sides + vertical fade to keep text crisp. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,${intensity + 0.18}) 0%, rgba(0,0,0,${intensity}) 45%, rgba(0,0,0,${Math.max(
            intensity - 0.25,
            0.35,
          )}) 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
    </div>
  )
}
