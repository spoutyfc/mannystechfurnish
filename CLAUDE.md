# mannystechfurnish.com — project conventions

Marketing site and back office for Manny's Tech Furnish (Mansoor Arif), positioned as a website
and local search partner for Bay Area engineering and construction firms. One public offer:
AEC Digital Growth Partner, $1,000/month, six-month term.

## Commands
`pnpm typecheck` · `pnpm lint` (zero warnings) · `pnpm test` · `pnpm build`. All four must pass before a commit.
If `pnpm` is not on PATH: `npx pnpm@10.18.3 <script>`.

## Architecture
- `app/(site)/` public marketing pages (server components), shared layout with header/footer.
- `components/site-aec/` marketing components; `lib/site-content.ts` holds all shared copy, the
  offer and case-study facts — change copy there, not in several pages.
- `app/admin`, `app/pay/[slug]`, `app/api/*`, `lib/plans.ts`: back office and existing client
  invoices. Do not change pricing ids or payment logic without explicit approval.
- Design rules: `docs/design-direction.md`. Light drawing-sheet theme, tokens in `app/globals.css` (`.site`).

## Hard rules
- No invented metrics, rankings, testimonials, client counts, awards or scarcity. Every claim must
  appear in `research/claim-register.md` with evidence. Use the `claim-verification` skill.
- Never describe Mansoor or the business as an engineer or as offering engineering services.
- No guarantees of rankings, leads or revenue.
- Never send email, submit forms, contact prospects, deploy to production, change DNS or create
  Stripe prices without Mansoor's explicit approval. Outreach drafts live in
  `research/message-library.md` and are never sent by an agent.
- Server-side validation for every input (`lib/validation.ts`); analytics events never carry personal data.

## Research and prospecting
`research/` holds the audit, market research, capacity model, compliance review, prospect schema
and CSVs, message library, revenue plan, scorecard and decision log. Prospect work follows
`research/prospect-schema.md` and the `prospect-qualification` skill; public, permitted sources only.
