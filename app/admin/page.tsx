'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2, Mail, Check, RefreshCw, Inbox, PenSquare, ChevronDown } from 'lucide-react'
import { ComposeEmail, type ComposePrefill } from '@/components/admin/compose-email'
import { AdminShell } from '@/components/admin/admin-shell'

type Submission = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [composePrefill, setComposePrefill] = useState<ComposePrefill>({})

  const openCompose = (prefill: ComposePrefill = {}) => {
    setComposePrefill(prefill)
    setComposeOpen(true)
  }

  const loadSubmissions = useCallback(async () => {
    const res = await fetch('/api/admin/submissions')
    if (res.ok) {
      const data = await res.json()
      setSubmissions(data.submissions)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/admin-session')
        const data = await res.json()
        if (!data.authenticated) {
          router.push('/admin-login')
          return
        }
        setAdmin({ email: data.email })
        await loadSubmissions()
      } catch {
        router.push('/admin-login')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, loadSubmissions])

  const setStatus = async (id: string, status: 'read' | 'new') => {
    setBusy(id)
    await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
    setBusy(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this submission permanently?')) return
    setBusy(id)
    await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE' })
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
    if (active === id) setActive(null)
    setBusy(null)
  }

  const openSubmission = (s: Submission) => {
    setActive(active === s.id ? null : s.id)
    if (s.status === 'new') setStatus(s.id, 'read')
  }

  const newCount = submissions.filter((s) => s.status === 'new').length

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <AdminShell
      active="submissions"
      adminEmail={admin?.email}
      title="Inbox"
      subtitle={`${submissions.length} total message${submissions.length === 1 ? '' : 's'}`}
      badge={
        newCount > 0 ? (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent px-2 text-xs font-semibold text-accent-foreground">
            {newCount} new
          </span>
        ) : null
      }
      actions={
        <>
          <Button size="sm" onClick={() => openCompose()} className="gap-2 rounded-full bg-foreground text-background hover:opacity-90">
            <PenSquare className="h-4 w-4" /> Compose
          </Button>
          <Button variant="outline" size="sm" onClick={loadSubmissions} className="gap-2 rounded-full border-border bg-transparent">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </>
      }
    >
      {submissions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2.5">
          {submissions.map((s) => {
            const isOpen = active === s.id
            const isNew = s.status === 'new'
            return (
              <div
                key={s.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isNew ? 'border-accent/40 bg-accent/[0.04]' : 'border-border bg-card'
                }`}
              >
                <button
                  onClick={() => openSubmission(s)}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-secondary/40"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${isNew ? 'bg-accent' : 'bg-muted-foreground/40'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-foreground">{s.name}</span>
                      {isNew && (
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
                          New
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{s.subject}</p>
                  </div>
                  <span className="hidden shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground sm:block">
                    {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-border p-4 md:p-5">
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <Detail label="Email">
                        <a href={`mailto:${s.email}`} className="break-all text-accent hover:underline">{s.email}</a>
                      </Detail>
                      {s.phone && (
                        <Detail label="Phone">
                          <span className="text-foreground">{s.phone}</span>
                        </Detail>
                      )}
                      <Detail label="Received">
                        <span className="text-foreground">{new Date(s.createdAt).toLocaleString()}</span>
                      </Detail>
                    </div>
                    <Detail label="Message">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{s.message}</p>
                    </Detail>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => openCompose({ to: s.email, subject: `Re: ${s.subject}` })}
                        className="gap-2 rounded-full bg-foreground text-background hover:opacity-90"
                      >
                        <Mail className="h-4 w-4" /> Reply
                      </Button>
                      {isNew ? (
                        <Button size="sm" variant="outline" disabled={busy === s.id} onClick={() => setStatus(s.id, 'read')} className="gap-2 rounded-full border-border bg-transparent">
                          <Check className="h-4 w-4" /> Mark read
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled={busy === s.id} onClick={() => setStatus(s.id, 'new')} className="gap-2 rounded-full border-border bg-transparent">
                          Mark unread
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === s.id}
                        onClick={() => remove(s.id)}
                        className="ml-auto gap-2 rounded-full border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ComposeEmail open={composeOpen} prefill={composePrefill} onClose={() => setComposeOpen(false)} />
    </AdminShell>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border bg-card p-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-foreground">No submissions yet.</p>
      <p className="mt-1 text-sm text-muted-foreground">Contact form messages will appear here.</p>
    </div>
  )
}
