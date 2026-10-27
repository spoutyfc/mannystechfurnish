# Baseline Audit: mannystechfurnish.com (repo + live)

Audit date: 2026-10-27. Auditor: repository / SEO / accessibility reviewer (read-only).
Repo: `mannystechfurnish-aec`, branch `aec/growth-partner` @ `cb342b3`. Live: https://mannystechfurnish.com.
Target positioning: "AEC Digital Growth Partner, $1,000/month, 6-month term" for Bay Area engineering/construction firms.

Labels used: **F** = Fact (verified in code or live fetch), **A** = Assumption/inference, **R** = Recommendation.

---

## 0. The single most important finding

**F** Live production is **not** this repo. The live sitemap `lastmod` is `2026-07-25T12:00:29Z`, which matches
commit `7ac1293` (Merge PR #7, Jul 25 2026). The cleanup commits (`ca3c886` onward, including
`ce3f2e9 Replace unverifiable homepage metrics and testimonials with checkable facts`) exist only on
`polish/2026-10-21` and `aec/growth-partner`, not on `main`/production.

**F** Consequently the live site still shows fabricated-looking metrics and testimonials that the repo has
already removed (see Section 3 and Section 11). Every visitor and every prospect today sees them.

**R** Treat "ship the honest-claims version to production" as a Critical prerequisite before any AEC outreach.

---

## 1. Homepage promise and audience

| | Live (quote) | Repo |
|---|---|---|
| H1 | "Websites that actually convert." | same, `app/page.tsx:218-238` |
| Sub | "Premium, hand-built websites that rank on Google and turn visitors into paying customers. No templates. No fluff. Delivered on time." | "Custom websites built to rank on Google and turn visitors into paying customers. Built for your business, and the code is yours." `app/page.tsx:242-245` |
| Eyebrow | "Web Studio — Est. 2023" | same, `app/page.tsx:215` |
| Title tag | "Manny's Tech Furnish \| Professional Websites for Growing Businesses" | `app/layout.tsx:20` |

**F** Audience is generic ("growing businesses", `app/layout.tsx:20-21`; JSON-LD `areaServed: 'US'`, `app/page.tsx:179`).
No mention of AEC, engineers, contractors, Bay Area, Dublin CA, or any vertical anywhere in metadata or hero.
**F** Portfolio is 3 of 4 AEC firms (Oaktown, Bear, Sequoia) plus one auto dealer (United Flex), so AEC proof exists
but is not framed as a specialty.
**F** Services list includes "Google Ads setup and management" (`app/page.tsx:110`) and marquee "Branding" (`:148`); neither has a portfolio example.
**A** "Est. 2023" has no supporting evidence in repo or on site (no dated case study). Unverifiable rather than false.
**R** New H1/meta must name the audience (Bay Area engineering and construction firms) and the single offer.

---

## 2. Pricing, plans, add-ons, terms, ownership

Source of truth: `lib/plans.ts` (live Stripe Payment Links, `lib/plans.ts:10-27`) and `app/page.tsx:115-133, 472-683`.

| Item | Price | Where |
|---|---|---|
| Complete Digital Asset (one-time) | $1,899 | `app/page.tsx:499`, `lib/plans.ts:33` |
| Managed Website Plan | $900 setup + $159/mo, "3-month minimum — from $1,377 total" | `app/page.tsx:532-538` |
| Code buyout after managed term | $800 | `app/page.tsx:132`, `lib/plans.ts:58` |
| Care plan | **$99/mo** | `app/page.tsx:122`, `lib/plans.ts:19,43` |
| Care plan (FAQ) | **"from $70/mo"** | `components/site/faq.tsx:22` (also live) |
| Priority Care & Analytics add-on | **$49/mo** | `lib/plans.ts:196` |
| Add-ons | Booking $249, Animations $199, 3D/WebGL $349, CMS $249, Multi-language $179 | `lib/plans.ts:86-202` |

**Contradictions (F unless marked):**
1. Three different prices for ongoing care: $99/mo, "from $70/mo", $49/mo. None matches the new $1,000/mo offer.
2. "You own it outright — no monthly fees, ever" (`app/page.tsx:502`) and stat "$0 — Monthly fees on the one-time plan"
   (`:90`) sit next to "Optional $99/mo care plan if you ever want us to manage it" (`:122`).
3. Stat "100% — Code ownership handed to you" (`:91`) and "the code is yours" (`:244`) are unconditional, but the
   Managed plan requires an **$800 buyout** to get the code (`:132`). FAQ concedes this (`faq.tsx:18`). The stat strip is misleading.
4. "Buy out the code anytime after your term" (`:132`) — no term length is defined besides "3-month minimum" (`:538`); no written agreement linked.
5. **"Most Popular"** badge on the $1,899 plan (`app/page.tsx:493-495`): no sales data in repo supports it. **A** likely false or unverifiable.
6. **"Currently accepting 2 new clients this month"** with a pulsing "live" dot (`app/page.tsx:715-721`): hard-coded string,
   never changes. False scarcity. Contact page separately says "Taking on new projects" (`app/contact/page.tsx:114`).
7. "Most upgrades pair with the Managed Plan" (`:581`) — 5 of 6 add-ons are `availability: 'option2'` (Managed only), which
   conflicts with the one-time plan's "own it outright" positioning (you cannot buy a CMS for your owned site).
8. Process step "Clear Proposal — A detailed quote with everything spelled out" (`:137`) and FAQ "I send you a private payment
   link once we agree on scope" (`faq.tsx:30`) contradict public "Pay & get started" buttons that go straight to live Stripe
   checkout for $1,899 before any scope exists (`app/page.tsx:516-523`, `lib/plans.ts:24`). Same for every add-on (`:664-675`).
9. **"I" vs "we":** "We rebuilt / We built / We shipped" (`app/page.tsx:48,68,78`), "want us to manage it" (`:122`),
   "whenever you need us" (`:130`), "Web Studio" (`:215`) vs "What I Do" (`:396`), "I stick around" (`:139`),
   "Why Not An Agency … One dedicated developer" (`why-choose-me.tsx:36,40`). Mixed voice on one page.

**R** Replace the entire pricing block with the single $1,000/mo x 6 offer; retire live Payment Links for old plans
(owner action in Stripe); define ownership terms in writing; delete "Most Popular" and the scarcity line.

---

## 3. Quantitative claims and evidence

### Repo (`aec/growth-partner`)
| Claim | Location | Evidence? |
|---|---|---|
| "4 — Client sites in the work below" | `app/page.tsx:88` | Yes, derived from `clients.length` |
| "$1,899 — Published one-time build price" | `:89` | Yes, price list |
| "$0 — Monthly fees on the one-time plan" | `:90` | True narrowly; undercut by $99 care plan |
| "100% — Code ownership handed to you" | `:91` | Misleading (Managed plan buyout) |
| "10 service and 6 city pages" (Oaktown) | `:49` | Not verified page-by-page; plausible (A) |
| "Most sites ship in weeks, not months" | `why-choose-me.tsx:15` | No dated case studies |
| "Most projects ship in 2–4 weeks" | `faq.tsx:14` | No dated case studies |
| "reply within 24–48 hours" | `contact/page.tsx:143,206,278`; `contact/layout.tsx:5`; `lib/email.ts:100` | Operational promise, untracked |
| "Est. 2023" | `app/page.tsx:215` | None |
| "Currently accepting 2 new clients this month" | `:720` | None (static) |

### Live (production, from JS bundle and HTML)
| Claim (quote) | Evidence |
|---|---|
| Stats: "12+ Projects shipped", "340% Avg traffic lift", "100% Client satisfaction", "Page 1 Google rankings" | None. Only 4 projects shown. SSR renders these as "0" until JS runs. |
| Oaktown: "serving the Bay Area for 10+ years", "500+ projects showcased", "Ranks #1 for "structural engineer Bay Area"", "3x more consults" | "500+ projects" appears on Oaktown's own site as *their* project count. Ranking and 3x: none. |
| United Flex: "200% more inquiries" | None |
| Bear: "serving 12 Bay Area counties", "Ranks across 12 counties" | "12 Counties" is Bear's own service-area claim; "ranks across" is unproven |
| Sequoia: "4.9-star social proof" | Sequoia site shows a 4.9 rating (their reviews, not our result) |

**R** No metric goes back on the site without a dated source (GA4/Search Console export, client permission).

---

## 4. Portfolio proof

All four sites fetched 2026-10-27; all return HTTP 200.

| Client | Live? | Credits MTF? | Missing for a case study |
|---|---|---|---|
| Oaktown Engineers (oaktownengineers.com) | Yes | **Yes**: footer "Website by MTF, Manny's Tech Furnish" linking mannystechfurnish.com | Launch date, scope/role split, before/after, metrics with source, written permission, quote |
| United Flex Auto (unitedflexauto.com) | Yes | **Yes**: "Website by" link to mannystechfurnish.com | Same; also not AEC, so weak for new positioning |
| Bear Geotechnical (beargeotech.com) | Yes | **Yes**: link to mannystechfurnish.com in footer | Same |
| Sequoia Remodeling (sequoiaremodel.com) | Yes | **No** credit found; page has `<meta name="generator" content="v0.app">` | Attribution, role (A: built with v0 by Manny, unconfirmed), permission |

**F** Repo cards link whole card to client site (`app/page.tsx:323-331`) and label the section "( Case Studies )" (`:317`),
but there are no case-study pages; each "case study" is a 1-sentence description plus 2-3 bullets.
**F** Screenshot images are 0.8-1.7 MB PNGs (`public/images/work-*.png`) served unoptimized (`next.config.mjs` `images.unoptimized: true`).
**R** Build 3 AEC case-study pages (Oaktown, Bear, Sequoia) with date, scope, role, before/after screenshots and written permission;
confirm Sequoia authorship before claiming it.

---

## 5. Testimonials

**F Repo:** removed; only an empty comment remains (`app/page.tsx:388`).
**F Live:** three testimonials, first-name + initial only, no company, no photo, no link:
"David R. — Structural Engineering Firm" ("…ranking #1 on Google within months. Consults tripled."),
"Marcus T. — Auto Dealership" ("…leads are up 200%."), "Priya S. — Local Service Business". The heading says
"( Real results, real businesses )". **A** Names do not match any credited contact and cannot be verified; FTC
endorsement-guide risk if not genuine.
**R** Ship the repo version now; re-add only attributable, permissioned quotes.

---

## 6. Navigation and IA

**F** Routes: `/`, `/contact`, `/demo/booking`, `/checkout/success`, `/pay/[slug]`, `/admin*`. Redirects `/services`→`/#services`,
`/portfolio`→`/#work` (`next.config.mjs`).
**F** Nav: Work, Services, Pricing, phone (not a link), "Get Started" (`components/site/site-nav.tsx:18-22, 69-81`).
Footer adds Add-ons, Contact, GitHub (`app/page.tsx:762-786`). No FAQ link, no About, no Privacy, no case-study pages.
**F** Single long page; everything SEO-relevant lives on `/`. No service or location pages despite selling "local SEO" to clients.
**F** `/demo/booking` has no own metadata (title is the homepage title), is not in the sitemap, and its SSR HTML shows
build-time dates ("Mon Jul 27 …") until hydration (`app/demo/booking/page.tsx:39-47`). Booking is simulated with a
900 ms timeout (`:73-74`), labelled "( This is a demo — no real email was sent )" (`:331`). Honest, but the add-on card
promises "Syncs to your Google / Apple calendar" (`lib/plans.ts:97`) with no implementation in repo.
**F** Nav phone `(925) 278-9059` is plain text, not `tel:` (`site-nav.tsx:69-71`; also `app/page.tsx:745, 760`).

---

## 7. UX and performance (from code)

| Item | Location | Observation |
|---|---|---|
| Preloader | `components/site/preloader.tsx` | Full-screen z-100 overlay, locks body scroll (`:17-24`), ~1.9 s count + 0.35 s + 1 s exit ≈ 3.2 s before content is usable. Reduced motion: 300 ms (`:28-30`). Hurts LCP/INP perception. Hard-coded `fuchsia-500` (`:84,91`). |
| Lenis smooth scroll | `smooth-scroll.tsx` | Skipped under reduced motion (`:8`). Hijacks anchor clicks (`:25-38`). Forbidden-default per studio rules ("scroll hijacking"). |
| WebGL orb (ogl) | `hero-orb.tsx` | rAF loop runs forever (`:163-175`), even under reduced motion (only freezes time, still renders every frame) and when off-screen; no IntersectionObserver / visibilitychange pause. Battery cost on mobile. |
| Scroll blur | `scroll-blur.tsx` | CSS `filter: blur()` on the whole page wrapper during scroll, `will-change: filter` permanently (`:77`). Reduced motion respected (`:19`). Expensive repaint on low-end phones. |
| Videos | `public/videos/*.mp4` = 5.7 MB, 6.6 MB, 3.7 MB | `VideoBackdrop` lazy-mounts via IO (good) but has **no reduced-motion check**; `why-choose-me.tsx:48-56` autoplay loop also ignores reduced motion. Videos are decorative stock (A). |
| Framer motion | `components/site/motion.tsx` | `FadeUp`, `AnimatedHeading`, `ClipReveal`, `Tilt`, `Magnetic`, `Parallax` do **not** check reduced motion (only `CountUp` does, `:152`). No `MotionConfig reducedMotion="user"`. `FadeUp`/`AnimatedHeading` re-hide content when scrolled out (not `once`). SSR HTML ships content at `opacity:0`/blur; without JS, most page text is invisible. |
| Images | `next.config.mjs` | `images.unoptimized: true` → ~4.8 MB of PNGs at full size on the homepage. |
| Whole page is a client component | `app/page.tsx:1` | `'use client'` on the root page; JSON-LD and all content shipped in the JS bundle as well. |

**R** Remove preloader and scroll blur, gate all motion on `useReducedMotion`/`MotionConfig`, pause WebGL off-screen,
re-enable image optimization (after upgrading Next, see Section 10), compress or drop stock videos.

---

## 8. WCAG 2.2 AA risks (code-level)

Contrast computed against pure black (#000):

| Token | Effective color | Ratio | Where | Result |
|---|---|---|---|---|
| `text-white/30` (placeholders) | #4d4d4d | ~2.5:1 | `contact/page.tsx:311,324,338,352` | Fail 1.4.3 |
| `text-white/40` | #666 | ~3.7:1 | `app/page.tsx:533` ("+"), `contact/page.tsx:210` icons, sheet "Menu" label `site-nav.tsx:120` | Fail for text |
| `text-white/45` | #737373 | ~4.4:1 | `app/page.tsx:649` (10px), `:793`; `contact/page.tsx:185` (11px) | Fail (just under 4.5) |
| `text-neutral-500` | #737373 | ~4.4:1 | preloader `:100` (10px) | Fail |
| `text-white/50`, `/55`, `/60` | | 5.3, 6.2, 7.3:1 | many | Pass |
| `text-white/15` index numerals | | ~1.4:1 | `app/page.tsx:358,412` | Decorative; acceptable only if `aria-hidden` |

Other risks:
- **Tiny text:** `text-[10px]` badges/labels (`app/page.tsx:347,493,607,623,649`; `site-nav.tsx:120`), `text-[11px]` form labels and helper text (`contact/page.tsx:185,212,251,303,315,330,343`). Below studio 16px body rule; uppercase + wide tracking reduces legibility.
- **Form labels not associated (1.3.1, 4.1.2):** `<Label>` has no `htmlFor`, inputs have no `id` (`contact/page.tsx:303-353`). Inputs rely on placeholder for name. Recent commit `cb342b3` fixed admin/booking forms, **not** the contact form.
- **No skip link (2.4.1)** and **no `<main>` landmark** on `/` or `/contact` (only `demo/booking` and `pay` have `<main>`).
- **Focus visibility (2.4.7 / 2.4.11):** contact inputs use `focus-visible:ring-0` with only a 1px border color change (`:311` etc.). Raw `<a>` CTAs have no explicit focus style (browser default only; global `outline-ring/50` at `globals.css:121`). Fixed nav (`site-nav.tsx:39`) can obscure focused elements when Lenis scrolls (2.4.11 Focus Not Obscured).
- **Nested interactive:** `<Link><Button>` renders `<button>` inside `<a>` (`site-nav.tsx:73-81, 142-146`).
- **Whole-card links:** each portfolio card is one `<a>` wrapping image, h3, paragraph and list (`app/page.tsx:323-382`); accessible name is the entire card text; opens new tab with no warning (3.2.5 advisory).
- **AnimatedHeading** splits headings into per-word spans with `\u00A0` (`motion.tsx:42-56`) — some screen readers read word-by-word; blur/translate ignore reduced motion (2.3.3 AAA, plus studio rule).
- **Error messaging:** contact error box is not `role="alert"`/`aria-live` (`contact/page.tsx:282-286`); success state not announced.
- **Honeypot** correctly `aria-hidden` + `tabIndex=-1` (`:289-299`). Icon-only buttons have sr-only labels (`site-nav.tsx:89,114`; `scroll-to-top.tsx:22`). Good.
- **Lang** set (`app/layout.tsx:67`). Good.

---

## 9. Metadata, canonical, robots, sitemap, schema

| Item | Status |
|---|---|
| Title/description | Generic, no location or vertical (`app/layout.tsx:20-21`). Keywords meta (`:22`) is ignored by Google. |
| Canonical | `/` and `/contact` set (`layout.tsx:25-27`, `contact/layout.tsx:6-8`). Live renders `https://mannystechfurnish.com` (no trailing slash) — fine. `/demo/booking` inherits root canonical `/` (A: Next applies root `alternates` to child routes without their own metadata) → demo page canonicalizes to home. |
| OG / Twitter | Present; `public/og-image.png` exists (276 KB, served 200). Alt says "Websites that actually convert". |
| robots | `app/robots.ts`: allow `/`, disallow `/admin`, `/admin-login`, `/api/`. Live matches. `/pay/*` and `/checkout/success` not disallowed and have no `noindex` (A: check pages). |
| Sitemap | Only `/` and `/contact` (`app/sitemap.ts`); `lastModified: new Date()` changes every build (not a real lastmod). |
| JSON-LD | `ProfessionalService` in `app/page.tsx:164-189`. Issues: (1) **personal Gmail** `mansoor.buspro@gmail.com` (`:175`) — also hard-coded in 8+ places; (2) **`sameAs` lists client websites** (`:181-186`) — `sameAs` must point to pages that identify *this* entity (GBP, LinkedIn, GitHub), so this is incorrect and could confuse entity resolution; (3) no `address`, `telephone`, `geo`, `areaServed` is "US" not Bay Area; (4) no `Person` page for founder; (5) rendered inside a client component with `suppressHydrationWarning`. |
| Security headers | Live response has HSTS only; no CSP, X-Frame-Options/frame-ancestors, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (no `headers()` in `next.config.mjs`). |

**R** New metadata per route; `LocalBusiness`/`ProfessionalService` with Dublin CA address (if owner approves publishing), phone, `areaServed` Bay Area counties, `sameAs` = owner's own profiles only; add `Service`/`Offer` for the $1,000/mo plan; business email on own domain.

---

## 10. Contact form and API

Files: `app/contact/page.tsx`, `app/api/public/contact/route.ts`, `lib/validation.ts`, `lib/turnstile.ts`, `lib/rate-limit.ts`, `lib/email.ts`.

| Control | Status |
|---|---|
| Server validation | zod `contactSchema` (`lib/validation.ts:22-31`): name ≤200, email ≤254, subject ≤200, message ≤5000. Good. |
| Honeypot | `company` field; server returns fake success if filled (`route.ts:23-25`). Good. |
| Turnstile | Server verifies (`route.ts:43-49`). **Fails open** when `TURNSTILE_SECRET_KEY` is unset (`notConfigured` bypass, `:44`; `lib/turnstile.ts:28`). Live site key is configured (`0x4AAAAAADgSHyPn5y0RLCAW` in bundle; public by design). If secret were missing in prod, protection silently disappears. |
| Client Turnstile edge | If site key missing, widget shows public text "Bot protection not configured" (`components/site/turnstile.tsx:82-87`) and submit is impossible (client requires token, `contact/page.tsx:59-62`). |
| Token reuse | After a server error the single-use token is not reset (`contact/page.tsx:79-84`), so a retry will fail verification. |
| Rate limit | 5 per 10 min per IP via Upstash, in-memory fallback (`lib/rate-limit.ts:8,62-71`). IP from Vercel headers, shared bucket otherwise (`lib/request.ts`). Good. Rate limit runs **after** Turnstile; fine. |
| Persistence | Inserts into `contact_inquiries` under a system user (`route.ts:60-75`). Admin read API checks session server-side (`app/api/admin/submissions/route.ts:8`). Good. |
| Emails | Owner notification + **auto-confirmation to the submitted address echoing subject/message** (`lib/email.ts:~100-124`). HTML is escaped (`lib/email.ts:22`). A: can be abused to send branded mail to arbitrary addresses (limited by Turnstile + rate limit). |
| Success/failure UI | Success panel "Message sent" (`:270-279`); generic fallback error with Gmail address (`:80-84`). No `aria-live`. |
| Privacy disclosure | **None.** No privacy policy page (`/privacy` → 404 live), no notice near the form, no mention that data is stored, emailed via Resend, or that Cloudflare Turnstile and Vercel Analytics run. **A** CCPA/CPRA notice-at-collection risk for a California business collecting personal data. |
| Analytics events | Only `<Analytics />` page views in production (`app/layout.tsx:70`). **No conversion events** for form submit, SMS click, tel/mailto click, or Stripe click. Lead attribution is impossible. |
| SMS CTA | `sms:` link with prefilled brief (`contact/page.tsx:28-40`) — good mobile pattern; desktop users get a broken/no-op link (A). |

---

## 11. Security and dependency notes

**F** `pnpm audit --prod` (run in sibling `C:\Users\Dev\Projects\github-polish\mannystechfurnish`, read-only; its lockfile
differs slightly from the worktree): **35 vulnerabilities — 5 critical, 18 high, 11 moderate, 1 low.**
- `next@16.2.6` (`package.json:29`): 5 critical (RCE in Image Optimization AVIF/SVG, Windows-hosted servers, next/og, `use cache`),
  high incl. "Middleware / Proxy bypass in App Router … Turbopack" (<16.2.11), SSRF in Server Actions/rewrites, DoS. Patched ≥16.4.1 for all listed.
  Mitigation today: `images.unoptimized: true` sidesteps the image optimizer; admin API routes re-check the session server-side
  so a middleware bypass alone does not expose data (A: admin page components should be verified too).
- Transitive: `sharp`, `postcss`, `nanoid`, `browserslist`, `source-map-js` (high), `zod@3` (high, memory exhaustion; patched in 4.6.6).
**F** Positive: bcrypt passwords, zod input, admin rate limit, atomic Stripe transitions (commit history), escaped email HTML.
**F** No security headers beyond HSTS (Section 9).
**F** Personal Gmail and phone are hard-coded across components rather than one config module.
**R** Upgrade Next to latest patched 16.x, regenerate lockfile, add security headers; independent `security-reviewer` pass after.

---

## 12. Trust problems, ranked

1. **Live site shows unsupported metrics** ("340% Avg traffic lift", "12+ Projects shipped", "100% Client satisfaction", "Ranks #1", "3x more consults", "200% more inquiries"). Highest legal and credibility risk; engineers verify claims.
2. **Live testimonials** with unverifiable initials-only names repeating those metrics.
3. **False scarcity** "Currently accepting 2 new clients this month" (static).
4. **"Most Popular"** badge with no data.
5. **Ownership contradiction**: "100% code ownership" / "no monthly fees, ever" vs $800 buyout and $99/$70/$49 care fees.
6. **Pay-before-scope**: live Stripe checkout buttons contradict "Clear Proposal" and "private payment link" copy.
7. **Personal Gmail** as the business contact and in schema; no business address, no privacy policy, no About/founder page.
8. **"Web Studio" + "we"** vs one-person "I"; reads as inflated.
9. **Sequoia** credited in portfolio but not crediting back; generator v0.app (authorship unclear).
10. **Generic audience**: nothing says AEC or Bay Area, undermining the new specialist offer.

---

## 13. Live vs repo discrepancies

| Area | Live (production, ≈ `7ac1293`, Jul 25) | Repo (`aec/growth-partner`, `cb342b3`) |
|---|---|---|
| Hero subhead | "Premium, hand-built websites … No templates. No fluff. Delivered on time." | "Custom websites built to rank on Google … the code is yours." |
| Stats | 12+ / 340% / 100% satisfaction / Page 1 (render "0" in SSR) | 4 clients / $1,899 / $0 / 100% ownership (server-rendered real values) |
| Oaktown copy | "10+ years", "500+ projects showcased", "Ranks #1…", "3x more consults" | Admin CMS, "10 service and 6 city pages", GA4/Search Console |
| United Flex | "premium … at scale", "200% more inquiries" | Pleasant Hill, VIN-decoding admin |
| Bear | "12 Bay Area counties", "Ranks across 12 counties" | Data-driven pages, inquiry inbox |
| Sequoia | "4.9-star social proof" | Removed |
| Testimonials | 3 (David R., Marcus T., Priya S.) | Removed (`app/page.tsx:388`) |
| "No Bloat" card | "No page-builder junk." | "No page-builder bloat." |
| Footer | No GitHub link | GitHub link (`app/page.tsx:778-785`) |
| Security/infra | Pre-hardening code | zod validation, fail-closed login limit, atomic payments, Docker, CI |
| Unchanged in both | "Most Popular", "accepting 2 new clients", "Est. 2023", $99 vs "from $70" vs $49 care, $800 buyout, Gmail in JSON-LD, client-site `sameAs`, no privacy page, preloader, Lenis, WebGL, scroll blur |

---

## 14. Prioritized fix list

### Critical
1. Deploy a version without unsupported metrics and testimonials (or at minimum hotfix live copy) before any AEC outreach. (R; production deploy needs owner approval.)
2. Remove "Currently accepting 2 new clients this month" and "Most Popular". (`app/page.tsx:493-495, 714-722`)
3. Upgrade `next` to latest patched 16.x (≥16.4.1) and regenerate lockfile; re-run tests/build. (`package.json:29`)
4. Replace old pricing/add-ons/Payment Links with the single "$1,000/month, 6-month term" offer and a written ownership/term statement; owner deactivates old live Stripe links. (`lib/plans.ts`, `app/page.tsx:115-133, 472-683`, `faq.tsx`)
5. Add a privacy policy page and a notice at the contact form (data stored, Resend, Turnstile, Vercel Analytics, retention, contact). (R; legal wording needs owner review.)

### High
6. Reposition metadata, H1, JSON-LD for Bay Area AEC; fix `sameAs`; use a domain email instead of Gmail; add phone/`areaServed`. (`app/layout.tsx:19-56`, `app/page.tsx:164-189`)
7. Contact form a11y: `htmlFor`/`id`, `aria-live` errors, visible focus ring, reset Turnstile after failure. (`app/contact/page.tsx:282-358`)
8. Make Turnstile fail closed in production when the secret is missing. (`route.ts:44`)
9. Conversion tracking: form submit success, tel/sms/mailto clicks, booking CTA. (`app/layout.tsx:70`)
10. Real AEC case-study pages with dates, role, before/after, permission; confirm Sequoia authorship. (`app/page.tsx:42-83`)
11. Reduced-motion coverage for all framer components, videos and WebGL loop; pause WebGL off-screen. (`motion.tsx`, `video-backdrop.tsx`, `why-choose-me.tsx:48-56`, `hero-orb.tsx:163-175`)
12. Remove preloader and scroll-blur; reconsider Lenis anchor hijack. (`preloader.tsx`, `scroll-blur.tsx`, `smooth-scroll.tsx`)
13. Add skip link and `<main>` landmark; fix `<a><button>` nesting. (`app/page.tsx`, `contact/page.tsx`, `site-nav.tsx:73-81,142-146`)

### Medium
14. Raise low-contrast text (`/30`, `/40`, `/45`, `neutral-500`) to ≥ `/55`; raise 10-11px labels to ≥12px and body to ≥16px.
15. Unify voice ("I" + named founder) and drop "Web Studio"/"Est. 2023" unless evidenced.
16. Security headers (CSP, frame-ancestors, nosniff, Referrer-Policy, Permissions-Policy) via `next.config.mjs` `headers()`.
17. Re-enable image optimization after Next upgrade or pre-compress PNGs to WebP/AVIF; compress/drop stock videos (16 MB total).
18. Sitemap: add case-study/service pages, stable `lastModified`; give `/demo/booking` its own metadata or `noindex`; `noindex` `/pay/*` and `/checkout/success`.
19. Make phone numbers `tel:` links site-wide; centralize contact details in one config module.
20. Portfolio cards: link only the title/CTA, not the whole card; announce new-tab behavior.
