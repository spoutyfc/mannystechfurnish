'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteNav } from '@/components/site/site-nav'
import { AnimatedHeading, FadeUp, Magnetic } from '@/components/site/motion'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowUpRight, Mail, Calendar, Clock, ArrowLeft, Phone, Check } from 'lucide-react'

// TODO: replace with your real Cal.com booking link, e.g. https://cal.com/mansoor-mtf/consultation
const CAL_LINK = 'https://cal.com/mansoor-mtf/consultation'
// TODO: replace with your real WhatsApp number link, e.g. https://wa.me/15551234567
const WHATSAPP_LINK = ''

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '', // honeypot
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen bg-black text-white">
      <SiteNav />

      {/* ---------------- HEADER ---------------- */}
      <section className="relative overflow-hidden border-b border-white/15 px-5 pb-16 pt-32 md:px-10 md:pb-20 md:pt-40">
        {/* soft accent glow, melts into black */}
        <div className="pointer-events-none absolute right-[-15%] top-[-20%] h-[60%] w-[60%] rounded-full bg-accent/15 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/60"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to home
            </Link>
            <span className="hidden sm:block">( Get in touch )</span>
          </motion.div>

          <h1 className="font-display text-[14vw] font-semibold uppercase leading-[0.88] tracking-tight md:text-[10.5vw] lg:text-[9rem]">
            <AnimatedHeading as="span" text="Let's build" className="block" />
            <span className="block">
              <AnimatedHeading
                as="span"
                text="something"
                className="inline"
                delay={0.12}
              />{' '}
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block text-accent"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
                >
                  great.
                </motion.span>
              </span>
            </span>
          </h1>

          <div className="mt-12 border-t border-white/15 pt-10">
            <FadeUp index={1}>
              <p className="max-w-2xl text-pretty text-xl leading-snug text-white md:text-2xl">
                Tell me about your project and I&apos;ll get back to you within 24&ndash;48 hours.
                Prefer to talk it through? Book a free call.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          {/* Left column — info */}
          <div>
            <FadeUp>
              <p className="font-mono text-xs uppercase tracking-widest text-white/55">
                ( 01 — Direct )
              </p>
            </FadeUp>

            <FadeUp index={1}>
              <Magnetic strength={0.15}>
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 flex items-center justify-between border border-white/15 p-6 transition-colors hover:border-accent/50 hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-5">
                    <Calendar className="h-7 w-7 text-accent" />
                    <div>
                      <p className="font-display text-2xl font-semibold uppercase tracking-tight">
                        Book a call
                      </p>
                      <p className="font-mono text-xs uppercase tracking-widest text-white/55">
                        30-min free consultation
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </a>
              </Magnetic>
            </FadeUp>

            {/* Detail rows */}
            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {[
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'mansoor.buspro@gmail.com',
                  href: 'mailto:mansoor.buspro@gmail.com',
                },
                { icon: Phone, label: 'Phone', value: '(925) 278-9059' },
                { icon: Clock, label: 'Response time', value: 'Within 24–48 hours' },
                ...(WHATSAPP_LINK
                  ? [
                      {
                        icon: Phone,
                        label: 'WhatsApp',
                        value: 'Message me directly',
                        href: WHATSAPP_LINK,
                      },
                    ]
                  : []),
              ].map((row, i) => {
                const Inner = (
                  <div className="group flex items-center gap-5 py-5">
                    <row.icon className="h-5 w-5 shrink-0 text-white/40 transition-colors group-hover:text-accent" />
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                        {row.label}
                      </p>
                      <p className="break-all text-white transition-colors group-hover:text-accent">
                        {row.value}
                      </p>
                    </div>
                  </div>
                )
                return (
                  <FadeUp key={row.label} index={i}>
                    {row.href ? (
                      <a href={row.href} target={row.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
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
              <div className="mt-10 border border-white/15 p-6">
                <p className="text-pretty leading-relaxed text-white/75">
                  Every project starts with a real conversation about your goals &mdash; no scripts,
                  no pressure. You&apos;ll get weekly updates through the whole build and a site
                  that&apos;s made to bring you customers.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium text-white">Mansoor</p>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">
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
              <p className="font-mono text-xs uppercase tracking-widest text-white/55">
                ( 02 — Send a message )
              </p>
            </FadeUp>

            <FadeUp index={1}>
              <div className="mt-8 border border-white/15 p-6 md:p-10">
                {submitted ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-accent/40 bg-accent/10">
                      <Check className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-display text-3xl font-semibold uppercase tracking-tight">
                      Message sent
                    </h3>
                    <p className="mt-3 text-white/60">I&apos;ll be in touch within 24&ndash;48 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="border border-red-500/30 bg-red-500/10 p-4">
                        <p className="text-sm text-red-400">{error}</p>
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
                        <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/55">
                          Name
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Your name"
                          className="h-12 rounded-none border-white/15 bg-transparent text-white placeholder:text-white/30 focus-visible:border-accent focus-visible:ring-0"
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/55">
                          Email
                        </Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="you@example.com"
                          className="h-12 rounded-none border-white/15 bg-transparent text-white placeholder:text-white/30 focus-visible:border-accent focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/55">
                        What do you need?
                      </Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="New website, landing page, redesign…"
                        className="h-12 rounded-none border-white/15 bg-transparent text-white placeholder:text-white/30 focus-visible:border-accent focus-visible:ring-0"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-white/55">
                        Tell me more
                      </Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="What's your project about? Any timeline or budget in mind?"
                        rows={5}
                        className="resize-none rounded-none border-white/15 bg-transparent text-white placeholder:text-white/30 focus-visible:border-accent focus-visible:ring-0"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-opacity hover:opacity-90 disabled:opacity-60"
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
      <footer className="border-t border-white/15 px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 md:flex-row">
          <Image
            src="/images/logo.png"
            alt="Manny's Tech Furnish"
            width={684}
            height={180}
            className="h-9 w-auto"
          />
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">
            © {new Date().getFullYear()} Manny&apos;s Tech Furnish · (925) 278-9059
          </p>
        </div>
      </footer>
    </div>
  )
}
