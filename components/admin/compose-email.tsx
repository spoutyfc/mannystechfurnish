'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Send, Loader2, CheckCircle2 } from 'lucide-react'

export type ComposePrefill = {
  to?: string
  subject?: string
}

export function ComposeEmail({
  open,
  prefill,
  onClose,
}: {
  open: boolean
  prefill?: ComposePrefill
  onClose: () => void
}) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [heading, setHeading] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) {
      setTo(prefill?.to || '')
      setSubject(prefill?.subject || '')
      setHeading('')
      setMessage('')
      setError(null)
      setSent(false)
    }
  }, [open, prefill])

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, heading, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send email.')
      } else {
        setSent(true)
        setTimeout(onClose, 1200)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-t-2xl border border-neutral-800 bg-neutral-950 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-white">
            Compose Email
          </h2>
          <button onClick={onClose} className="text-neutral-400 transition-colors hover:text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
            <CheckCircle2 className="h-10 w-10 text-accent" />
            <p className="font-medium text-white">Email sent</p>
            <p className="text-sm text-neutral-500">Your message is on its way to {to}.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 px-5 py-5">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">To</label>
              <input
                type="email"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="client@email.com"
                className="w-full rounded-lg border border-neutral-700 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">Subject</label>
              <input
                type="text"
                required
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Your website is ready for review"
                className="w-full rounded-lg border border-neutral-700 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">
                Headline <span className="text-neutral-600">(optional, shown large)</span>
              </label>
              <input
                type="text"
                maxLength={120}
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Your project update"
                className="w-full rounded-lg border border-neutral-700 bg-black px-3 py-2.5 text-sm text-white outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-neutral-500">Message</label>
              <textarea
                required
                rows={6}
                maxLength={5000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here. Double line breaks create new paragraphs."
                className="w-full resize-y rounded-lg border border-neutral-700 bg-black px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-accent"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900/50 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose} className="border-neutral-700 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={sending} className="gap-2 bg-accent text-black hover:opacity-90">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? 'Sending…' : 'Send Email'}
              </Button>
            </div>
            <p className="text-center text-[11px] text-neutral-600">
              Sends from your branded Manny&#39;s Tech Furnish address via Resend.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
