'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClientCheckoutSession, PLAN_DETAILS, type PlanType } from '@/app/actions/payment'
import { Check, Loader2, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react'

type Plan = (typeof PLAN_DETAILS)[PlanType]

export default function PayClient({
  slug,
  name,
  companyName,
  planType,
  plan,
  alreadyPaid,
  canceled,
}: {
  slug: string
  name: string
  companyName: string | null
  planType: PlanType
  plan: Plan
  alreadyPaid: boolean
  canceled: boolean
}) {
  const [includeCareplan, setIncludeCareplan] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const firstName = name.split(' ')[0]

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const { url } = await createClientCheckoutSession(slug, planType === 'option1' ? includeCareplan : false)
      window.location.href = url
    } catch {
      setError('Something went wrong starting checkout. Please try again or contact Mansoor.')
      setLoading(false)
    }
  }

  if (alreadyPaid) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center border border-neutral-800 rounded-2xl p-10">
          <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
            <Check className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-extrabold uppercase mb-3">All set, {firstName}</h1>
          <p className="text-neutral-400 leading-relaxed">
            This invoice has already been paid. Thank you! Mansoor will be in touch about next steps.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 mt-8 text-sm font-mono uppercase tracking-widest text-accent hover:underline">
            Back to site <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ambient accent glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[40rem] h-[40rem] rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-20">
        <Link href="/" className="font-display text-lg font-extrabold uppercase tracking-tight">
          Manny&apos;s<span className="text-accent">.</span>
        </Link>

        <div className="mt-10 md:mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">Your project invoice</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase leading-[0.95] text-balance">
            Hey {firstName}, let&apos;s get
            <br /> your project rolling
          </h1>
          <p className="text-neutral-400 mt-4 max-w-lg leading-relaxed">
            {companyName ? `Prepared for ${companyName}. ` : ''}
            Review the plan below and complete your secure payment to kick things off.
          </p>
        </div>

        {canceled && (
          <div className="mt-8 flex items-center gap-3 border border-amber-500/40 bg-amber-500/10 rounded-xl px-4 py-3 text-sm text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Checkout was canceled. No charge was made — you can try again whenever you&apos;re ready.
          </div>
        )}

        <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Plan summary */}
          <div className="border border-neutral-800 rounded-2xl p-6 md:p-8 bg-neutral-950/60">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase">{plan.title}</h2>
                <p className="text-neutral-500 text-sm mt-1">{plan.subtitle}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest border border-neutral-700 rounded-full px-3 py-1 text-neutral-400 shrink-0">
                {plan.cadence}
              </span>
            </div>

            <div className="mt-6 mb-8">
              <span className="font-display text-4xl font-extrabold text-accent">{plan.price}</span>
            </div>

            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-neutral-300">{f}</span>
                </li>
              ))}
            </ul>

            {planType === 'option1' && (
              <label className="mt-8 flex items-start gap-3 p-4 rounded-xl border border-neutral-800 bg-white/[0.02] cursor-pointer hover:border-accent/40 transition-colors">
                <input
                  type="checkbox"
                  checked={includeCareplan}
                  onChange={(e) => setIncludeCareplan(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[var(--accent)]"
                />
                <span>
                  <span className="block font-medium">Add the Care Plan — $70/mo</span>
                  <span className="block text-sm text-neutral-500">Priority updates, security monitoring & ongoing support. Cancel anytime.</span>
                </span>
              </label>
            )}
          </div>

          {/* Checkout panel */}
          <div className="border border-neutral-800 rounded-2xl p-6 md:p-8 bg-neutral-950/60 h-fit lg:sticky lg:top-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-4">Order summary</h3>

            <div className="space-y-3 text-sm border-b border-neutral-800 pb-5 mb-5">
              <div className="flex justify-between">
                <span className="text-neutral-400">{plan.title}</span>
                <span className="text-white">{plan.price}</span>
              </div>
              {planType === 'option1' && includeCareplan && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Care Plan</span>
                  <span className="text-white">$70/mo</span>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-400 mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-black font-semibold uppercase tracking-wide py-3.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Redirecting...
                </>
              ) : (
                <>
                  Pay securely <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5" /> Secured by Stripe · cards & more
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
