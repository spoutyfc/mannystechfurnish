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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-t-2xl border border-border bg-card sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-medium tracking-tight text-foreground">
            Compose email
          </h2>
          <button onClick={onClose} className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
            <CheckCircle2 className="h-10 w-10 text-accent" />
            <p className="font-medium text-foreground">Email sent</p>
            <p className="text-sm text-muted-foreground">Your message is on its way to {to}.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 px-5 py-5">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">To</label>
              <input
                type="email"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="client@email.com"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none focus:border-accent sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Subject</label>
              <input
                type="text"
                required
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Your website is ready for review"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none focus:border-accent sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Headline <span className="text-muted-foreground/60">(optional, shown large)</span>
              </label>
              <input
                type="text"
                maxLength={120}
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Your project update"
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground outline-none focus:border-accent sm:text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea
                required
                rows={6}
                maxLength={5000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here. Double line breaks create new paragraphs."
                className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-base leading-relaxed text-foreground outline-none focus:border-accent sm:text-sm"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-full border-border bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={sending} className="gap-2 rounded-full bg-foreground text-background hover:opacity-90">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? 'Sending…' : 'Send email'}
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              Sends from your branded Manny&#39;s Tech Furnish address via Resend.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
