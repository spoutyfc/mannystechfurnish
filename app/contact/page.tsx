'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteNav } from '@/components/site/site-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowRight, Mail, Calendar, Clock, ArrowLeft, Phone } from 'lucide-react'

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

      {/* Back Link */}
      <div className="pt-28 px-5 md:px-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="pt-8 pb-12 px-5 md:px-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent text-sm uppercase tracking-widest mb-4 font-mono">Get in Touch</p>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold uppercase mb-6 tracking-tight text-balance">
            Let&apos;s talk about<br />your project
          </h1>
          <p className="text-lg text-neutral-300 max-w-xl leading-relaxed">
            Fill out the form below and I&apos;ll get back to you within 24-48 hours. Or book a call if you prefer to chat directly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 px-5 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Calendar className="text-accent" size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white group-hover:text-accent transition-colors">Book a Call</p>
                  <p className="text-sm text-neutral-500">30-min free consultation</p>
                </div>
                <ArrowRight className="text-neutral-600 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" size={18} />
              </a>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                    <Mail className="text-neutral-400" size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Email</p>
                    <a href="mailto:mansoor.buspro@gmail.com" className="text-white hover:text-accent transition-colors break-all">mansoor.buspro@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                    <Clock className="text-neutral-400" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Response Time</p>
                    <p className="text-white">Within 24-48 hours</p>
                  </div>
                </div>
                {WHATSAPP_LINK ? (
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                      <Phone className="text-neutral-400 group-hover:text-accent transition-colors" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider">WhatsApp</p>
                      <p className="text-white group-hover:text-accent transition-colors">Message me directly</p>
                    </div>
                  </a>
                ) : null}
              </div>

              <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 mt-4">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Every project starts with a real conversation about your goals — no scripts, no pressure. You&apos;ll get weekly updates through the whole build and a site that&apos;s built to bring you customers.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-pink-600" />
                  <div>
                    <p className="text-sm font-medium text-white">Mansoor</p>
                    <p className="text-xs text-neutral-500">Manny&apos;s Tech Furnish</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Send me a message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thanks! Message sent.</h3>
                    <p className="text-neutral-400">I&apos;ll be in touch within 24-48 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-neutral-300 text-sm block mb-2">Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Your name"
                          className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-accent/50"
                        />
                      </div>
                      <div>
                        <Label className="text-neutral-300 text-sm block mb-2">Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="you@example.com"
                          className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-accent/50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-neutral-300 text-sm block mb-2">What do you need?</Label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="e.g., New website, landing page, redesign..."
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-accent/50"
                      />
                    </div>

                    <div>
                      <Label className="text-neutral-300 text-sm block mb-2">Tell me more</Label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        placeholder="What's your project about? Any timeline or budget in mind?"
                        rows={5}
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-accent/50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent hover:opacity-90 text-black font-semibold py-6 rounded-full text-base"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/15 py-8 px-5 md:px-10">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="Manny's Tech Furnish"
            width={684}
            height={180}
            className="h-9 w-auto"
          />
          <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} Manny&apos;s Tech Furnish</p>
        </div>
      </footer>
    </div>
  )
}
