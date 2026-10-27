# QA report — branch `aec/growth-partner`

Date: 2026-10-27. Production build (`next build` + `next start`) on localhost:3110. Nothing deployed.

## Gates

| Gate | Command | Result |
|---|---|---|
| Studio release gate | `pwsh scripts/release-check.ps1 -ProjectDir <worktree>` (Claudian Dev) | **PASS** — env-example, typecheck, lint, test, build, secret scan. Skipped: format, e2e, a11y, links, deps-audit, preview-smoke (no scripts / no preview URL). Log: `docs/evidence/release-check.md` |
| Typecheck | `pnpm typecheck` | pass |
| Lint (0 warnings) | `pnpm lint` | pass |
| Unit/integration tests | `pnpm test` | **117 passed** in 11 files (was 95). New: fit-call field validation, URL normalization, header-injection stripping, stored message composition, unknown discipline → 400, production without Turnstile → 503 |
| Build | `pnpm build` | pass; all marketing routes static |
| Links | `node scripts/check-links.mjs` | All internal routes 200, all 14 external links OK. The only "failures" are canonical URLs to `mannystechfurnish.com/<new page>`, which 404 until launch (`docs/evidence/links.log`) |
| Dependencies | `pnpm audit --prod` | 35 → **1** advisory. Next 16.2.6 → 16.4.3; transitive build tools pinned via `pnpm.overrides`. Remaining: zod 3 memory exhaustion on oversized *collections* — no public schema validates arrays; fix requires zod 4 migration (`docs/evidence/audit.log`) |

## Browser checks

| Check | Result |
|---|---|
| Screenshots, 9 routes × 375/768/1440, full page | `docs/evidence/screenshots/*.png` via `scripts/capture-screenshots.mjs` (exact device widths) |
| Horizontal overflow | None at any width (`capture-report.json`) |
| One H1 per page, image alt text, canonicals, unique titles, descriptions ≤ 160 chars | Pass on all 9 routes |
| Keyboard | Skip link is first tab stop with visible 2px focus outline; mobile menu opens with Enter, focus moves to Close, Escape closes and returns focus to the trigger; FAQ uses native `<details>` |
| Reduced motion | No entrance animations exist; remaining colour transitions are disabled under `prefers-reduced-motion` |
| Form — empty submit | Error summary receives focus, lists each problem with links; fields get `aria-invalid` + `aria-describedby` |
| Form — real submission, server failure | POST `/api/public/contact` → 500 (no database on this machine); visitor sees a 5xx message with phone and email; entered answers are kept; Turnstile resets for retry |
| Form — success | Covered by route tests (stores, emails, composed message); not exercised end-to-end because no database/Resend credentials were used locally |
| Console | No errors on primary routes |
| Structured data | WebSite + ProfessionalService (home), Service with monthly UnitPriceSpecification (offer), BreadcrumbList (inner pages). No review schema. `<` escaped in JSON-LD |

## Measured performance (lab, `scripts/measure-vitals.mjs`)
375px, 4× CPU slowdown, ~1.6 Mbps / 150 ms latency, cache disabled.

| Route | LCP | CLS | Transfer |
|---|---|---|---|
| `/` new | 988 ms | 0 | 328 KB |
| `/work` new | 956 ms | 0 | 442 KB |
| `/growth-partner` new | 1,084 ms | 0 | 312 KB |
| `/contact` new | 944 ms | 0 | 308 KB |
| `/` **live today** | 6,916 ms | 0.006 | 526 KB |
| `/contact` **live today** | 4,116 ms | 0 | 544 KB |

Caveat: the new build was measured on localhost and the live site over the internet, so the gap is
partly network. Re-measure on the Vercel preview before quoting numbers. No Lighthouse score is claimed.

## Reviews
- **Design director** (independent): 2 critical, 3 high, 8 medium, 5 low. All critical/high and most medium fixed (cropped evidence screenshots, visible "bot protection not configured" text, process table scroll on phones, stretched case-study image box, I/we voice, scarcity-sounding lines). Open: no photo of Mansoor on `/about`; personal Gmail address.
- **Red team**: 3 critical, 4 high. Fixed: early-exit and code-handover terms now explicit; Turnstile fails closed in production and the auto-reply no longer echoes visitor text; Sequoia case study hidden until authorship is confirmed; scope vs. case-study size explained; reply-time wording unified; privacy retention promise made accurate; JSON-LD escape bug; header-injection and URL validation. Open: business decisions listed below.
- **Security reviewer** (independent): no Critical/High. One Medium fixed — Turnstile now fails closed in any production build (Docker/self-hosted too), with an explicit `ALLOW_UNVERIFIED_CONTACT=1` opt-out for local runs; 9 security tests added (`app/__tests__/contact-security.test.ts`). Low: auto-reply greets with the visitor's name (escaped).

## Theme
After owner review the site was re-skinned in the existing brand theme (black, hot pink, uppercase
Archivo, logo, WebGL hero, discipline marquee). Content, structure and fixes are unchanged. Screenshots
in `docs/evidence/screenshots/` are from the rethemed build; no horizontal overflow at 375/768/1440.

## Prospects
`research/prospects.csv`: 68 researched firms (pilot 10 + three regional batches), every row sourced and
dated, 2 flagged as possible duplicates, 47 scoring ≥ 18/25. Short of the 100 target because each
research agent hit its web-search limit; rejected weak or out-of-area firms rather than padding.
Licenses are all unverified pending CSLB/BPELSG lookups. Several firms compete with existing clients
(Oaktown, Bear) and are flagged for an owner decision.

## Remaining limitations
- Not deployed; preview smoke test not run.
- Personal Gmail and no postal address (credibility; blocks outreach).
- Oaktown's own site shows "500+ / 10+ / 100%" counters in the screenshot; that is the client's claim, not this site's, but a careful reader may notice.
- Conversion events need Vercel Web Analytics custom events (Pro plan) to be visible.
- Owner notification email falls back to a hard-coded address if `CONTACT_TO_EMAIL` is unset (`lib/email.ts`).
- `/demo/booking` still uses the old dark theme (noindex, unlinked).

## Post-launch monitoring
Search Console: index coverage for the 9 URLs, queries by page. Vercel Analytics: `cta_click`,
`form_start`, `form_submit_success`/`error`, `phone_click`. Weekly: admin inbox vs. analytics form
completions (they should match). Monthly: re-run the three scripts and the release gate.
