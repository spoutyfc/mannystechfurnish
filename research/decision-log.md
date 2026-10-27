# Decision log

| Date | Decision | Why | Reversible? |
|---|---|---|---|
| 2026-10-27 | Work on branch `aec/growth-partner` in a separate worktree (`../mannystechfurnish-aec`) | The main checkout (`polish/2026-10-21`) had uncommitted edits to the README and contact route that are not mine | Yes |
| 2026-10-27 | Keep the existing stack (Next.js App Router, Tailwind v4, Postgres, Resend, Stripe) | Works, tested, deployed; no migration benefit | — |
| 2026-10-27 | Upgrade Next 16.2.6 → 16.4.3 | Audit found critical RCE and middleware-bypass advisories | Yes |
| 2026-10-27 | Remove public Stripe payment links from the marketing site; keep `lib/plans.ts`, `/pay/[slug]` and admin untouched | Prompt: work starts only after a signed agreement. Existing clients' invoices must keep working | Yes |
| 2026-10-27 | Do not create a $1,000/month Stripe price | Live-mode Stripe change = external action needing approval. Invoice manually or approve creation later | — |
| 2026-10-27 | "Book a fit call" goes to a form, not a calendar tool | No booking account exists; adding Cal.com/Calendly is an account decision for Mansoor | Yes |
| 2026-10-27 | Region shown as "Tri-Valley, California" | Prompt says Dublin, vault says Pleasanton; Tri-Valley is true for both | Yes |
| 2026-10-27 | Light drawing-sheet design; remove WebGL, video, preloader, Lenis, scroll blur | Audience wants calm and credible; old effects cost ~16 MB video + 4.8 MB PNGs and ignored reduced motion | Yes |
| 2026-10-27 | Case-study facts limited to dated page counts from live sitemaps | Only checkable facts; no outcomes until clients supply data and permission | Yes |
| 2026-10-27 | Fit-call fields folded into the stored message instead of new DB columns | No migration against production DB; admin inbox shows them as-is | Yes |
| 2026-10-27 | Max two builds in progress; billing starts at kickoff | Capacity model at assumed 30 h/week: ~6 safe clients; 10 simultaneous builds = ~81 h/week | Yes — revise when hours are confirmed |
| 2026-10-27 | Count the Nov 30 goal as signed agreements with scheduled kickoffs, not 10 live builds | Same capacity constraint; MRR counted only when paid | Owner decision |
| 2026-10-27 | Turnstile still skips verification when its secret is missing | Changing it could break the live form if production lacks the key; honeypot + rate limit remain. Flagged | Owner to confirm prod has `TURNSTILE_SECRET_KEY` |
| 2026-10-27 | No outreach drafted for sending; drafts carry a postal-address blocker | CAN-SPAM requires a physical address; none on record | — |
| 2026-10-27 | Prospect licenses left "unverified" | CSLB bulk download and BPELSG lookups are form-driven; downloading bulk data needs approval | Yes |
