'use client'

import { useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove: (id?: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'

/**
 * Cloudflare Turnstile widget. Calls onVerify with a one-time token when the
 * challenge is solved, and onExpire when it needs re-solving. The token is
 * verified server-side, so this cannot be bypassed.
 */
export function Turnstile({
  onVerify,
  onExpire,
  className = '',
}: {
  onVerify: (token: string) => void
  onExpire?: () => void
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current || !siteKey) return
    // Avoid double-render in StrictMode / re-mounts
    if (widgetIdRef.current) return
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'dark',
      callback: (token: string) => onVerify(token),
      'expired-callback': () => onExpire?.(),
      'error-callback': () => onExpire?.(),
    })
  }, [onVerify, onExpire, siteKey])

  useEffect(() => {
    if (!siteKey) return

    // If the API is already present, render immediately.
    if (window.turnstile) {
      renderWidget()
      return
    }

    // Otherwise register the onload callback and inject the script once.
    window.onloadTurnstileCallback = renderWidget
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (!existing) {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          /* noop */
        }
        widgetIdRef.current = null
      }
    }
  }, [renderWidget, siteKey])

  if (!siteKey) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-widest text-amber-400/80">
        Bot protection not configured
      </p>
    )
  }

  return <div ref={containerRef} className={className} />
}
