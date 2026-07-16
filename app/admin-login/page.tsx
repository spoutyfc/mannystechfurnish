'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock, ArrowRight, Loader2 } from 'lucide-react'

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

      // Small delay so the browser stores the cookie before we navigate.
      setTimeout(() => {
        window.location.href = '/admin'
      }, 120)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-5 py-16 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-black">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="font-display text-3xl font-semibold uppercase tracking-tight">
            Admin Access
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/50">
            Manny&apos;s Tech Furnish
          </p>
        </div>

        <div className="rounded-xl border border-white/12 bg-white/[0.03] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mannystechfurnish.com"
                autoComplete="username"
                className="w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-white/50">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/15 bg-black px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-50"
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

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-white/40 transition-colors hover:text-white"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  )
}
