'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, ArrowRight, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      setTimeout(() => {
        window.location.href = '/admin/clients'
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 text-foreground">
      {/* soft accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(50% 45% at 50% 0%, oklch(0.83 0.062 78 / 0.10), transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/logo.png"
            alt="Manny's Tech Furnish"
            width={684}
            height={180}
            className="h-10 w-auto"
            priority
          />
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Admin Console
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-2xl shadow-black/20">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-accent">
              <Lock className="h-4 w-4" />
            </span>
            <h1 className="font-display text-lg font-medium tracking-tight">Sign in</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-accent sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-accent sm:text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Manny&apos;s Tech Furnish
        </p>
      </div>
    </div>
  )
}
