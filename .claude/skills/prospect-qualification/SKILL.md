---
name: prospect-qualification
description: Research and score Bay Area engineering/construction prospects from public, permitted sources using the project schema. Use when adding rows to research/prospects-*.csv.
---

# Prospect qualification

Follow `research/prospect-schema.md` exactly (columns, rubric anchors, dedup rules).

- Sources: the firm's own site, CSLB and BPELSG public lookups, city/county directories, public
  procurement records, directories whose terms permit use. `research/site-probe.py` is a read-only
  homepage checker.
- Never: contact anyone, submit forms, log in, bypass CAPTCHAs or anti-bot measures, use paid
  databases, download bulk files without approval, record personal emails or guess addresses.
- Contact route = main phone, contact-page URL or a role-based address published on the firm's site.
- Unknown is "unknown". Conflicts go in `conflicts_notes`, never silently resolved.
- Dedupe against every existing CSV and `research/suppression-list.csv` by domain, phone, address
  and business identity before writing a row.
- Defaults: `contact_status=not_contacted`, `opt_out=no`, `suppressed=no`, `date_checked` = today.
- Do not infer revenue or budget.
