# Capacity and Offer Economics — AEC Digital Growth Partner

Prepared 2026-10-27. Offer: $1,000/month, 6-month initial term, billed monthly in advance, standard
website build included within defined scope, managed hosting/care, technical SEO, Google Business Profile
guidance, one growth asset per month after launch, one active request at a time, monthly report,
quarterly review. Goal under test: 10 clients by 2026-11-30.

**Label key.** **[Fact — S#]** sourced (Sources table at bottom); **[Assumption]** must be confirmed
by Mansoor; **[Recommendation]** proposed decision. No conversion rates are assumed anywhere.

> **Mansoor has not confirmed his availability.** Every hour figure below flows from the parameter
> table in Section 2. Change those numbers and re-run the math before relying on the conclusion.

---

## 1. Retainer pricing benchmarks (2025–2026) and where $1,000/month sits

| Benchmark | Range | Date | Label |
|-----------|-------|------|-------|
| Website maintenance packages (budget → enterprise tiers) | $25–$50 / $75–$150 / $200–$400 / $500–$600+ per month | 2025-09-10 | [Fact — S1] |
| FatLab care plans with 0 / 1 / 3 / 8 dev hours | $99 / $199 / $349 / $599 per month | 2025-09-10 | [Fact — S1] |
| Structural-engineering site maintenance: freelancer / local agency / specialist AEC agency | $80–$200 / $150–$400 / $300–$800 per month | 2026-10-17 | [Fact — S2] |
| Structural-engineering premium site build: freelancer / local agency / specialist AEC agency | $7K–$15K / $15K–$35K / $25K–$60K one-time | 2026-10-17 | [Fact — S2] |
| Design retainer | $800–$3,000 per month | 2026-05-19 | [Fact — S3] |
| SEO retainer | $1,500–$5,000 per month | 2026-05-19 | [Fact — S3] |
| Content marketing retainer | $1,000–$8,000 per month | 2026-05-19 | [Fact — S3] |
| Contractor-focused agency: website as monthly fee / SEO | $1,665 / $4,000 per month | 2023-07-30 | [Fact — S4] |
| AEC full-service marketing agency retainer | $3,000–$30,000 per month; $75–$250/hour | undated | [Fact — S5] |
| Low-end contractor site builders | from $24/month | undated | [Fact — S6] |

`studiomaydit.com` was checked; it publishes no retainer prices (quote on request) and its FAQ only
distinguishes fixed-scope work from retainers. **[Fact — S7]**

**Where $1,000/month sits.** **[Recommendation / analysis]**
- Above care-only plans ($99–$800), because it adds a growth asset, GBP guidance and reporting.
- At the low end of design retainers ($800–$3,000), below SEO retainers ($1,500+), below Hook's
  website-only fee ($1,665), and far below AEC agencies ($3,000+).
- Over 6 months the client pays $6,000 for build plus care. A freelancer build alone is benchmarked at
  $7,000–$15,000 in NYC (S2). **The build is underpriced unless it is genuinely produced from a
  reusable component system and scope is held tightly.** The price is competitive for buyers but the
  margin depends on the 7th month onward.

---

## 2. Parameters (edit these first)

| Parameter | Value | Status |
|-----------|-------|--------|
| Total available hours/week | 30 | **ASSUMPTION — must confirm** |
| Non-delivery overhead during selling push (Nov–Dec): sales calls, proposals, admin, own marketing | 8 h/week | ASSUMPTION |
| Non-delivery overhead after selling push | 5 h/week | ASSUMPTION |
| Delivery hours/week (Nov–Dec / later) | 22 / 25 | Derived |
| Safety buffer for incidents, revisions, sick days | 10% of delivery hours | ASSUMPTION / Recommendation |
| Weeks per month | 4.33 | Calendar math |
| Onboarding window | 45 days = 6.43 weeks | From offer |
| Build scope | 8–12 pages from existing component system | From offer |
| Payment method mix | ACH default | Recommendation |

---

## 3. Hours per client

### 3.1 Onboarding and build (first 45 days)

| Task | Low | Base | High | Label |
|------|-----|------|------|-------|
| Kickoff, discovery, access (domain, GBP, analytics) | 2 | 3 | 4 | ASSUMPTION |
| Content collection and editing: services, 4–6 project sheets, team bios, license verification | 8 | 10 | 14 | ASSUMPTION (content gathering is the main schedule risk, S2: 2–4 weeks) |
| Information architecture and design adaptation of component system | 5 | 6 | 8 | ASSUMPTION |
| Build 8–12 pages, portfolio, intake form | 12 | 16 | 20 | ASSUMPTION |
| Technical SEO, schema, sitemap, analytics, GBP guidance session | 4 | 5 | 6 | ASSUMPTION |
| QA: responsive, accessibility, forms, performance | 4 | 5 | 6 | ASSUMPTION |
| Launch, DNS, redirects, handoff walkthrough | 2 | 3 | 3 | ASSUMPTION |
| Project management and client communication | 3 | 4 | 4 | ASSUMPTION |
| **Total build hours** | **40** | **52** | **65** | |
| Average load during 6.43-week window | 6.2 h/wk | **8.1 h/wk** | 10.1 h/wk | Derived |

### 3.2 Recurring per month after launch

| Task | Low | Base | High | Label |
|------|-----|------|------|-------|
| Care: updates, monitoring, backups, uptime/form checks | 1 | 1.5 | 2 | ASSUMPTION |
| One growth asset (project sheet, service-area page, service page) | 3 | 4 | 5 | ASSUMPTION |
| Monthly report | 0.75 | 1 | 1.5 | ASSUMPTION |
| One active request (small edits) | 1.5 | 2 | 3 | ASSUMPTION |
| Communication | 1 | 1 | 1 | ASSUMPTION |
| Quarterly review (1.5 h every 3 months) | 0.5 | 0.5 | 0.5 | ASSUMPTION |
| **Total recurring hours/month** | **7.75 (~8)** | **10** | **13** | |
| Weekly equivalent | 1.8 | **2.31** | 3.0 | Derived |

---

## 4. Costs per client

### 4.1 Software (shared stack, allocated)

| Item | Price (verified) | Allocation assumption | Monthly cost | Label |
|------|------------------|-----------------------|--------------|-------|
| Vercel Pro | $20/month per developer seat incl. $20 usage credit; Hobby is non-commercial only | 1 seat shared by all client sites; low-traffic sites stay in credit | $20 fixed | [Fact — S8]; allocation ASSUMPTION |
| Neon Postgres (only if a site stores form submissions) | Free: 100 CU-hours and 1 GB per project; Launch: $0.106/CU-hour, $0.35/GB-month, no minimum | Free tier per project for typical marketing sites; $0–$3 buffer | $0–$3 per client | [Fact — S9]; usage ASSUMPTION |
| Resend (transactional email for forms) | Free: 3,000/month, 100/day, 3 domains; Pro $20/month, 10 domains | Pro once >3 client domains | $20 fixed | [Fact — S10] |
| UptimeRobot monitoring | Free plan described for hobby/non-profit; Solo $13/month (monthly) for 10 monitors at 60 s | Solo; next tier needed beyond 10 sites (price not checked) | $13 fixed | [Fact — S11] |
| SEO / reporting tools allowance | not researched | ASSUMPTION | $50 fixed | ASSUMPTION |
| Domain registration | **Not included**; registered in the client's name and paid by the client | — | $0 | From offer |
| **Fixed stack** | | | **$103/month** | |

| Clients | Fixed + variable ($3/client) | Per client |
|---------|------------------------------|------------|
| 3 | $103 + $9 = $112 | $37.33 |
| 6 | $103 + $18 = $121 | $20.17 |
| 10 | $103 + $30 = $133 | **$13.30** (model uses $15) |

### 4.2 Payment processing on a $1,000 invoice (Stripe US, verified 2026-10-27)

| Method | Fee formula | Fee per $1,000 | Label |
|--------|-------------|----------------|-------|
| Card + Stripe Billing (pay-as-you-go subscriptions) | 2.9% + $0.30 + 0.7% | $36.30 | [Fact — S12] |
| Card + Stripe Invoicing | 2.9% + $0.30 + 0.4% | $33.30 | [Fact — S12] |
| ACH Direct Debit + Stripe Billing | 0.8% capped at $5 + 0.7% | $12.00 | [Fact — S12] |
| ACH Direct Debit + Stripe Invoicing | 0.8% capped at $5 + 0.4% | **$9.00** | [Fact — S12] |
| International card surcharge | +1.5% (+1% if currency conversion) | n/a for Bay Area clients | [Fact — S12] |

**Recommendation:** default to ACH via Stripe Invoicing; accept cards but do not add a card surcharge
without checking California surcharging rules first.

### 4.3 Gross margin per client per month (before Mansoor's labor)

| | ACH | Card |
|--|-----|------|
| Revenue | $1,000.00 | $1,000.00 |
| Processing | −$9.00 | −$36.30 |
| Software (at 10 clients) | −$15.00 | −$15.00 |
| **Contribution** | **$976.00 (97.6%)** | **$948.70 (94.9%)** |

### 4.4 Effective hourly return (contribution ÷ hours)

| Case | 6-month hours (build + 4.5 recurring months) | 6-month contribution (ACH) | $/hour | Months 7+ $/hour |
|------|------|------|------|------|
| Low hours (40 build, 8/month) | 40 + 36 = 76 | $5,856 | $77.05 | $122.00 |
| **Base (52 build, 10/month)** | 52 + 45 = **97** | $5,856 | **$60.37** | **$97.60** |
| High hours (65 build, 13/month) | 65 + 58.5 = 123.5 | $5,856 | $47.42 | $75.08 |

Interpretation: the initial term earns roughly $47–$77/hour; renewals earn $75–$122/hour. The model
only works well if clients renew past month 6 and the build stays near 40–52 hours. **[Recommendation /
analysis]**

---

## 5. Capacity limits

| Measure | Formula | Result at 30 h/week | Label |
|---------|---------|---------------------|-------|
| Usable delivery hours/week, Nov–Dec | 22 × 0.9 | 19.8 | Derived |
| Usable delivery hours/week, later | 25 × 0.9 | 22.5 | Derived |
| Max simultaneous builds with no retained clients | 19.8 ÷ 8.1 | **2** | Derived |
| Max safe retained clients, steady state (no builds running) | 22.5 ÷ 2.31 | **9** (8 if overhead stays 8 h/wk: 19.8 ÷ 2.31 = 8.6) | Derived |
| Max roster you can actually *reach* while still onboarding (last build + all retained must fit) | n × 2.31 + 8.1 ≤ 19.8 → n ≤ 5 retained + 1 building | **6** | Derived (simulation below) |

### 5.1 Hours needed if 10 clients sign in November and all start at once

| Item | Base | Range |
|------|------|-------|
| Total build hours | 10 × 52 = **520 h** | 400–650 h |
| Weeks available (45-day windows) | 6.43 | — |
| Delivery hours/week required | 520 ÷ 6.43 = **81 h/week** | 62–101 h/week |
| Then recurring load | 10 × 10 = **100 h/month = 23.1 h/week** | 77–130 h/month |

81 delivery hours/week is about 2.7× the assumed 30-hour total. **Not serviceable** as simultaneous
starts.

### 5.2 Staggered queue simulation (base hours, 10% buffer, start a build whenever it fits)

Week 0 = first kickoff (e.g. 2026-12-01). Build windows rounded to 7 weeks.

| Delivery h/week (total h/week approx.) | Build start weeks | Clients reached | Last launch |
|----|----|----|----|
| 18 (≈24 total) | 0, 0, 7, 14 | 4 | week 21 |
| **22 (≈30 total)** | **0, 0, 7, 14, 21, 28** | **6** | **week 35 (~Aug 2027)** |
| 26 (≈31–34 total) | 0, 0, 7, 7, 14, 21, 28 | 7 | week 35 |
| 32 (≈37–40 total) | 0, 0, 0, 7, 7, 14, 14, 21, 28, 35 | 10 | week 42 |
| 36 (≈40–44 total) | 0, 0, 0, 0, 7, 7, 14, 14, 21, 28 | 10 | week 35 |

Key finding: reaching 10 *requires* about 32+ delivery hours/week because the tenth build must fit on top
of nine retained clients (9 × 2.31 + 8.1 = 28.9 h/week before buffer). Steady-state 10 clients alone
needs about 26 delivery h/week (23.1 + buffer). **[Derived from assumptions]**

---

## 6. Conclusion and recommended onboarding queue

**10 clients signed by 2026-11-30 cannot be serviced as 10 active builds at 30 hours/week.** At the
assumed 30 h/week, the safe roster is about **6 clients** (7–8 if sales overhead falls and the buffer is
thinned), and builds must be limited to **2 in progress at a time**. Ten clients becomes serviceable
only with roughly **38–44 total hours/week**, a lighter build (≈40 h), or a subcontractor. **[Derived]**

**Recommendations:**
1. **Redefine the November goal** as "10 signed agreements with scheduled kickoff dates", not 10
   active builds. Billing starts at kickoff, not at signature, so nobody pays for a queue. **[Recommendation]**
2. **Queue rule:** max **2 builds in progress**; a new build starts only when one launches; max 2 kickoffs
   per 2-week period even if capacity frees early. Publish the next available kickoff date on the site.
   **[Recommendation]**
3. **Content-ready gate:** a build slot starts only when the client has delivered the content checklist
   (project list, photos, license numbers, service areas). This attacks the 2–4 week content delay
   noted in S2. **[Recommendation]**
4. **Hard cap** retained clients at the parameter-table result (6 at 30 h/week) until Mansoor confirms
   hours; recompute before signing client 7. **[Recommendation]**
5. **Illustrative calendar at 30 h/week:** 2 kickoffs 2026-12-01; 1 around 2027-01-19; 1 around
   2027-03-09; 1 around 2027-04-27; 1 around 2027-06-15 (holidays will push these out). **[Derived]**
6. If 10 by mid-2027 is the real target, plan for a vetted subcontractor for content and page builds
   (20–40% of build hours) before signing client 7. **[Recommendation]**

---

## 7. Commercial terms

### 7.1 Contract value

| Item | Value |
|------|-------|
| 6-month contract value | 6 × $1,000 = **$6,000** |
| Processing over 6 months | ACH + Invoicing $54; card + Billing $217.80 |
| Software over 6 months (10-client allocation) | $90 |
| Net contribution over 6 months | $5,856 (ACH) / $5,692.20 (card) |

### 7.2 Cancellation and early termination **[Recommendation — needs legal review]**
- After the initial term: month-to-month, cancel with 30 days' written notice.
- Before kickoff: full refund of any advance payment less work actually performed.
- During the initial term, after kickoff: client may terminate with 30 days' notice and pays
  **50% of the remaining initial-term months** as an early-termination fee. This recovers the
  front-loaded build cost (≈52 hours) without penalising a client fully.
- Manny may terminate for non-payment after 15 days past due with written notice; the site stays live
  for 30 days to allow export.
- No refunds for months already started (billed in advance).

### 7.3 Change-order mechanism **[Recommendation]**
- Anything outside the written scope (extra pages beyond 12, portals, CRM migration, rebrand,
  photo/video, ad management, social posting) is quoted **before work begins** in fixed blocks:
  - Small block: 5 hours, $750 (implied $150/hour, inside the $75–$250/hour range in S5).
  - Standard block: 10 hours, $1,400.
- Client approves in writing (email is enough); the block is invoiced in advance; unused hours expire
  after 60 days.
- Unused monthly growth assets do not roll over beyond one month (prevents a backlog that breaks the
  capacity model).
- "One active request at a time" is defined as one open ticket; a request larger than 2 hours becomes
  a change order.

### 7.4 Ownership **[Recommendation — needs legal review]**

| Asset | Owner | When |
|-------|-------|------|
| Domain name (registered in client's name and account) | Client | Always |
| Google Business Profile (client is primary owner; Manny is a manager) | Client | Always |
| Analytics and Search Console properties | Client (Manny added as user) | Always |
| Client-supplied content, photos, project data, logos | Client | Always |
| Copy written by Manny for the client | Client | On payment of the month in which it was delivered |
| Site-specific code and design | Licensed to client for use during the term; **transferred** to client after the initial term is paid in full, or on early-termination buyout | End of term |
| Manny's reusable component system and tooling | Manny; client receives a perpetual, non-exclusive, royalty-free license to use it as part of their transferred site | On transfer |

Simple rule to put on the site: *"You always own your domain, your Google profile, your analytics and your
content. Once your first six months are paid, the site code is yours too."*

---

## Sources

| # | URL | Publisher | Publication date | Accessed | Key evidence | Implication |
|---|-----|-----------|------------------|----------|--------------|-------------|
| S1 | https://fatlabwebsupport.com/blog/website-maintenance/website-maintenance-packages-compared-your-complete-buyers-guide/ | FatLab Web Support | 2025-09-10 | 2026-10-27 | Maintenance tiers $25–$600+; FatLab $99–$599 with 0–8 dev hours | $1,000 sits above care-only plans |
| S2 | https://kolonell.com/en/blog/structural-engineering-consultancy-website-cost-new-york-2026 | Kolonell | 2026-10-17 | 2026-10-27 | Builds $7K–$60K; maintenance $80–$800/month; 8–14 weeks incl. 2–4 weeks content gathering | Build is underpriced; content gate needed |
| S3 | https://taskip.net/retainer-vs-project-based-pricing.md | Taskip | 2026-05-19 (modified 2026-06-23) | 2026-10-27 | SEO $1,500–$5,000; design $800–$3,000; content $1,000–$8,000; unclear scope turns retainers into unlimited access | Price position; strict scope |
| S4 | https://hookagency.com/blog/hook-agency-pricing/ | Hook Agency | 2023-07-30 | 2026-10-27 | Websites $1,665/month; SEO $4,000 | Monthly-fee website precedent for contractors |
| S5 | https://www.prosemedia.com/faqs-groups/aec-prose-knows-aec | Prose | undated | 2026-10-27 | AEC retainers $3K–$30K/month; $75–$250/hour | Upper benchmark; change-order rate sanity check |
| S6 | https://www.b12.io/contractor-website-design/website-cost | B12 | undated | 2026-10-27 | Contractor sites from $24/month | Low-end substitute |
| S7 | https://studiomaydit.com/ | Studio Maydit | undated | 2026-10-27 | No published retainer prices; fixed scope vs retainer guidance only | Requested benchmark not available |
| S8 | https://vercel.com/pricing | Vercel | undated | 2026-10-27 | Pro $20/seat/month incl. $20 credit; Hobby non-commercial | Pro required for client sites |
| S9 | https://neon.com/pricing | Neon | undated | 2026-10-27 | Free 100 CU-h, 1 GB/project; Launch $0.106/CU-h, $0.35/GB-month, no minimum | Near-zero DB cost for marketing sites |
| S10 | https://resend.com/pricing | Resend | undated | 2026-10-27 | Free 3,000/month, 3 domains; Pro $20/month, 10 domains | Fixed $20 once >3 clients |
| S11 | https://uptimerobot.com/pricing/ | UptimeRobot | undated | 2026-10-27 | Free for hobby/non-profit; Solo $13/month, 10 monitors, 60 s | Fixed $13 up to 10 sites |
| S12 | https://stripe.com/pricing | Stripe | undated | 2026-10-27 | Cards 2.9% + 30¢; ACH 0.8% capped $5; Billing 0.7%; Invoicing 0.4%; intl +1.5% | ACH default saves ~$27/month per client |
