# Execution plan — AEC repositioning

Branch `aec/growth-partner` (worktree `../mannystechfurnish-aec`). Nothing is deployed, sent or
purchased. Status as of 2026-10-27.

| Phase | Output | Status |
|---|---|---|
| 1 Baseline audit | `research/baseline-audit.md` | Done |
| 2 Positioning and offer | `research/market-research.md`, `research/capacity-model.md`, offer in `lib/site-content.ts` | Done — terms need Mansoor's sign-off (see below) |
| 3 Information architecture | 9 routes under `app/(site)/`, `docs/design-direction.md` | Done |
| 4 Copy and proof | Pages, `research/positioning-old-vs-new.md`, `research/claim-register.md` | Done — evidence requests open |
| 5 Implementation | Commits on the branch | Done |
| 6 QA gates | `QA-REPORT.md`, `docs/evidence/` | Done locally; preview deploy not done |
| 7 Prospect intelligence | `research/prospect-schema.md`, pilot + batch CSVs, merged `research/prospects.csv` | Pilot validated; list short of 100 (see QA report) |
| 8 Outreach system | `research/outreach-compliance.md`, `research/message-library.md`, `research/suppression-list.csv` | Drafts only; **blocked** on postal address and business mailbox |
| 9 Campaign plan | `research/november-revenue-plan.md`, `research/experiment-log.md`, `research/daily-scorecard.md` | Ready |

## Approval gates (in order)

1. **Copy and terms.** Approve or edit: early-exit at 50% of remaining months; code handover once
   the term is paid; month-to-month after; two business days reply; up to 12 pages; max two builds
   at once; privacy wording. Counsel review recommended for the terms.
2. **Evidence.** Client permission for Oaktown and Bear; confirm Sequoia authorship (currently hidden).
3. **Preview deploy** of this branch (Vercel preview), then smoke test.
4. **Production deploy / merge** — confirm `TURNSTILE_SECRET_KEY` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   are set in production first, or the form will refuse submissions (by design).
5. **Outreach readiness.** Postal address, domain mailbox with SPF/DKIM/DMARC, counsel review.
6. **Each first-touch batch**, approved in writing before sending.

## Next proposed phase
After gate 1–2: preview deploy, re-run `scripts/capture-screenshots.mjs` and `scripts/check-links.mjs`
against the preview URL, then verify licenses for the top 30 prospects and prepare cohort 1 (10 drafts).
