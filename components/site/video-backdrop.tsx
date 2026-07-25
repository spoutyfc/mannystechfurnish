'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Path to a self-hosted mp4 in /public/videos. */
  src: string
  /** 0-1, how dark the overlay is. Higher = darker / more text contrast. */
  intensity?: number
  /** Optional object-position, e.g. "center", "top". */
  position?: string
  className?: string
}

/**
 * Ambient background video. Loads only when scrolled near the viewport
 * (IntersectionObserver), plays muted + looped, and fades in once it can play
 * so there is never a hard pop. Sits behind a dark scrim so foreground text
 * stays razor-sharp. Purely decorative — hidden from assistive tech.
 */
export function VideoBackdrop({ src, intensity = 0.72, position = 'center', className = '' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)

  // Only mount/play the video when the section is near the viewport.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        } else {
          setInView(false)
          videoRef.current?.pause()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Kick off playback once the source is attached and in view.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !inView) return
    const play = v.play()
    if (play && typeof play.catch === 'function') play.catch(() => {})
  }, [inView, ready])

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-black ${className}`}
    >
      {inView && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setReady(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ objectPosition: position, opacity: ready ? 1 : 0 }}
        />
      )}
      {/* Contrast scrim: solid-ish sides + vertical fade to keep text crisp. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,${Math.min(intensity + 0.18, 1)}) 0%, rgba(0,0,0,${intensity}) 45%, rgba(0,0,0,${Math.max(
            intensity - 0.25,
            0.35,
          )}) 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
    </div>
  )
}
