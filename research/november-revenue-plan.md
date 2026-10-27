# November revenue plan — toward $10,000 MRR

**Target:** 10 retained clients at $1,000/month by 2026-11-30.
**Honest constraint:** the capacity model (`capacity-model.md`) estimates ~52 build hours per client
and ~10 h/month after launch. At an *assumed* 30 h/week, Mansoor can run two builds at once and
serve about six clients well. Ten simultaneous November builds would need ~81 h/week for six weeks.

**So the November goal is defined as:** 10 signed agreements with scheduled kickoff dates, of which
up to 4 have kicked off and paid. MRR counts only paid invoices. Kickoffs follow the queue: at most
two builds in progress, two new kickoffs per two weeks, and a build starts only once the client's
content is in.

No conversion rates are assumed. Every forecast below is filled in from real observations.

## Funnel stages (counts, updated daily in `daily-scorecard.md`)

| Stage | Definition |
|---|---|
| Researched | Row in a prospect CSV with sources and a score |
| Qualified | Score ≥ 18/25, no conflicts open, not suppressed |
| Approved | Mansoor approved this specific first touch |
| Sent | Delivered first touch (email, call or letter) |
| Positive reply | Asked for the recording or a call |
| Call booked / attended | — |
| Proposal sent | Written scope issued |
| Signed | Agreement signed by both sides |
| Paid & kicked off | First invoice paid; only this counts as MRR |

## Schedule

| Week | Work | Gate |
|---|---|---|
| Oct 27–Nov 1 | Approve site copy and terms; fix evidence items; preview deploy; obtain postal address and business mailbox; set up SPF/DKIM/DMARC | Mansoor approval; counsel review of outreach recommended |
| Nov 2–8 | Launch site. Verify top 30 prospects (license lookups, conflicts). Cohort 1: 10 first touches across two message families | Batch approved in writing |
| Nov 9–15 | Cohort 2: 15 touches. Record screen-recording audits for anyone who asked. Calls | Stop any family with a complaint or confused replies |
| Nov 16–22 | Cohort 3: 15–20 touches using the better-performing family. Proposals | — |
| Nov 23–30 | Follow-ups (one only, 5+ business days after first touch), proposals, signatures, first kickoffs | Never more than 2 builds in progress |

Volume stays small and manual: roughly 40–50 first touches in November, each personalized and approved.
That is deliberately far below any bulk-sender threshold.

## How the forecast gets updated

After each cohort, compute observed rates (positive reply / sent, call / positive, proposal / call,
signed / proposal) and write them into `experiment-log.md`. Only after 20+ sends in a family is a
rate worth comparing. Re-estimate how many touches the remaining signatures would need, and if that
exceeds what can be personalized properly, say so instead of sending more.
