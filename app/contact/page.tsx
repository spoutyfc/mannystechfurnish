'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowRight, Mail, Calendar, Clock, ArrowLeft } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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

      if (!res.ok) throw new Error('Failed to submit')

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Manny&apos;s Tech Furnish
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-sm text-neutral-400 hover:text-white transition-colors">Services</Link>
            <Link href="/#process" className="text-sm text-neutral-400 hover:text-white transition-colors">Process</Link>
            <Link href="/#about" className="text-sm text-neutral-400 hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </nav>

      {/* Back Link */}
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="pt-8 pb-12 px-6">
        <div className="max-w-4xl mx-auto contact-header">
          <p className="text-fuchsia-400 text-sm uppercase tracking-widest mb-4">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Let&apos;s talk about<br />your project
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl">
            Fill out the form below and I&apos;ll get back to you within 24-48 hours. Or book a call if you prefer to chat directly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="contact-info lg:col-span-2 space-y-6">
              <a
                href="https://cal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-fuchsia-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                  <Calendar className="text-fuchsia-400" size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white group-hover:text-fuchsia-400 transition-colors">Book a Call</p>
                  <p className="text-sm text-neutral-500">30-min free consultation</p>
                </div>
                <ArrowRight className="text-neutral-600 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all" size={18} />
              </a>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Mail className="text-neutral-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Email</p>
                    <a href="mailto:mansoor.dvc@gmail.com" className="text-white hover:text-fuchsia-400 transition-colors">mansoor.dvc@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                    <Clock className="text-neutral-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Response Time</p>
                    <p className="text-white">Within 24-48 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 mt-8">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Every project starts with a real conversation about your goals — no scripts, no pressure. You&apos;ll get weekly updates through the whole build and a site that&apos;s built to bring you customers.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600" />
                  <div>
                    <p className="text-sm font-medium text-white">Mansoor</p>
                    <p className="text-xs text-neutral-500">Manny&apos;s Tech Furnish</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form lg:col-span-3">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <h2 className="text-xl font-semibold mb-6">Send me a message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message sent!</h3>
                    <p className="text-neutral-400">I&apos;ll get back to you within 24-48 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-neutral-300 text-sm block mb-2">Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Your name"
                          className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-fuchsia-500/50"
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
                          className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-fuchsia-500/50"
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
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-fuchsia-500/50"
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
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-fuchsia-500/50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold py-6 rounded-full text-base"
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
      <footer className="border-t border-neutral-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-lg font-semibold">Manny&apos;s Tech Furnish</span>
          <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} Manny&apos;s Tech Furnish</p>
        </div>
      </footer>
    </div>
  )
}
