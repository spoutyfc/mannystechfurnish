'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteNav } from '@/components/site/site-nav'
import { AnimatedHeading, FadeUp, Magnetic } from '@/components/site/motion'
import { Turnstile } from '@/components/site/turnstile'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ArrowUpRight,
  Mail,
  MessageSquareText,
  Clock,
  ArrowLeft,
  Phone,
  Check,
} from 'lucide-react'

const PHONE_DISPLAY = '(925) 278-9059'
const PHONE_E164 = '+19252789059'

// Pre-written text the visitor sends. Questions are plain-language and only ask
// things a non-technical client can answer — including photos & logo.
const SMS_TEMPLATE = `Hi Mansoor! I'd like a website built. Here's a quick rundown:

- Name / business:
- What my business does:
- Type of site I want (e.g. simple info page, online store, booking, portfolio):
- A website whose style I like (optional):
- Photos: I'll send my own / please use stock photos
- Logo: I already have one / I need one designed
- Rough budget:
- When I'd like it ready by:`

// sms: with "?&body=" works across both iOS and Android.
const SMS_LINK = `sms:${PHONE_E164}?&body=${encodeURIComponent(SMS_TEMPLATE)}`

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '', // honeypot
  })
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Please complete the verification below before sending.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken: token }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '', company: '' })
    } catch (err) {
      setError(
        err instanceof Error && err.message && err.message !== 'Failed to submit'
          ? err.message
          : 'Something went wrong. Please email me directly at mansoor.buspro@gmail.com'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* ---------------- HEADER ---------------- */}
      <section className="relative overflow-hidden border-b border-border px-5 pb-16 pt-36 md:px-10 md:pb-20 md:pt-44">
        {/* single soft accent wash — quiet */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
          style={{
            background:
              'radial-gradient(55% 50% at 82% 15%, oklch(0.735 0.148 185 / 0.07), transparent 70%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
            <span className="hidden items-center gap-2 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              Taking on new projects
            </span>
          </motion.div>

          <h1 className="font-display text-[13vw] font-medium leading-[0.95] tracking-[-0.03em] md:text-[7.5vw] lg:text-[6rem]">
            <AnimatedHeading as="span" text="Let's build" className="block" />
            <span className="block text-muted-foreground">
              <AnimatedHeading
                as="span"
                text="something"
                className="inline"
                delay={0.12}
              />{' '}
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block text-foreground"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                >
                  great.
                </motion.span>
              </span>
            </span>
          </h1>

          <div className="mt-12 border-t border-border pt-10">
            <FadeUp index={1}>
              <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                Tell me about your project and I&apos;ll get back to you within 24&ndash;48 hours.
                Want it faster? Shoot me a text and I&apos;ll reply right away.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section className="px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* Left column — info */}
          <div>
            <FadeUp>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Fastest way to reach me
              </p>
            </FadeUp>

            {/* TEXT BUTTON — opens their messaging app with a pre-written brief */}
            <FadeUp index={1}>
              <Magnetic strength={0.12}>
                <a
                  href={SMS_LINK}
                  className="group mt-6 flex items-center justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center gap-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <MessageSquareText className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-display text-xl font-medium tracking-tight">
                        Text me
                      </p>
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Opens a ready-to-send message
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-accent transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>
              <p className="mt-3 font-mono text-[11px] leading-relaxed tracking-wide text-muted-foreground/70">
                Tap it and your phone opens a text with a few quick questions already typed out &mdash;
                just fill in the blanks and hit send.
              </p>
            </FadeUp>

            {/* Detail rows */}
            <div className="mt-10 divide-y divide-border border-y border-border">
              {[
                {
                  icon: Phone,
                  label: 'Call or text',
                  value: PHONE_DISPLAY,
                  href: `tel:${PHONE_E164}`,
                },
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'mansoor.buspro@gmail.com',
                  href: 'mailto:mansoor.buspro@gmail.com',
                },
                { icon: Clock, label: 'Response time', value: 'Within 24–48 hours' },
              ].map((row, i) => {
                const Inner = (
                  <div className="group flex items-center gap-5 py-5">
                    <row.icon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {row.label}
                      </p>
                      <p className="break-all text-foreground transition-colors group-hover:text-accent">
                        {row.value}
                      </p>
                    </div>
                  </div>
                )
                return (
                  <FadeUp key={row.label} index={i}>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                      >
                        {Inner}
                      </a>
                    ) : (
                      Inner
                    )}
                  </FadeUp>
                )
              })}
            </div>

            {/* Personal note */}
            <FadeUp index={2}>
              <div className="mt-10 rounded-2xl border border-border bg-card p-6">
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  Every project starts with a real conversation about your goals &mdash; no scripts,
                  no pressure. You&apos;ll get weekly updates through the whole build and a site
                  that&apos;s made to bring you customers.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Mansoor</p>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Manny&apos;s Tech Furnish
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right column — form */}
          <div>
            <FadeUp>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Prefer email? Send a message
              </p>
            </FadeUp>

            <FadeUp index={1}>
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-10">
                {submitted ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-accent/10">
                      <Check className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-display text-2xl font-medium tracking-tight">
                      Message sent
                    </h3>
                    <p className="mt-3 text-muted-foreground">I&apos;ll be in touch within 24&ndash;48 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}

                    {/* Honeypot field — hidden from humans, catches bots */}
                    <div className="absolute left-[-9999px]" aria-hidden="true">
                      <label htmlFor="company">Company</label>
                      <input
                        id="company"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          Name
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Your name"
                          className="h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-accent focus-visible:ring-0"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          Email
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="you@example.com"
                          className="h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-accent focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        What do you need?
                      </Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="New website, landing page, redesign…"
                        className="h-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-accent focus-visible:ring-0"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        Tell me more
                      </Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="What's your project about? Any timeline or budget in mind?"
                        rows={5}
                        className="resize-none rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-accent focus-visible:ring-0"
                      />
                    </div>

                    {/* Bot protection */}
                    <div>
                      <Turnstile onVerify={setToken} onExpire={() => setToken('')} />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      {loading ? 'Sending…' : 'Send message'}
                      {!loading && (
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      )}
                    </button>
                  </form>
                )}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-border px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 md:flex-row">
          <Image
            src="/images/logo.png"
            alt="Manny's Tech Furnish"
            width={684}
            height={180}
            className="h-9 w-auto"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} Manny&apos;s Tech Furnish · {PHONE_DISPLAY}
          </p>
        </div>
      </footer>
    </div>
  )
}
