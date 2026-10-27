---
name: truthful-case-study
description: Turn verified project evidence into a case study entry in lib/site-content.ts without fabricating outcomes. Use when adding or expanding a client case study.
---

# Truthful case study

Required before publishing anything beyond name + live URL:
- Written client permission to be named and shown.
- Discipline, location, date range, and Mansoor's exact role.
- Scope actually shipped (checkable on the live site).

Optional, only with client-supplied data and approval: before/after Search Console or GA4 figures
for stated date ranges; a quote with full name and title.

Steps:
1. Collect evidence; log each fact in `research/claim-register.md`.
2. Countable facts from the live site (pages, profiles) go in `evidence` with the `checked` date.
3. Write the summary in plain language from the client's point of view; no adjectives the evidence
   doesn't support.
4. Run the `claim-verification` skill, then `pnpm test` and `pnpm build`.
