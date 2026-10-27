# Prospect Schema: Bay Area AEC Firms

Owner: Manny's Tech Furnish (Mansoor Arif, Dublin, CA)
Offer: website and local-growth partner for engineering and construction firms, $1,000/month retainer
Version: 1.1 (2026-10-27, revised after the 10-record pilot; see `prospect-pilot-notes.md`)
Data file: `prospects-pilot.csv` (UTF-8, every field quoted, one row per firm)

## 1. Hard rules (apply to every record)

- Research only. Do not contact anyone, submit forms, log in, create accounts or solve CAPTCHAs during research.
- Record only **published business contact routes**: main phone, contact-page URL, and **role-based** emails shown on the firm's own site (info@, contact@, quotes@). Never record a named person's email, even if the site lists one. Never guess an email or a domain.
- Name a principal only if the **firm's own site** lists them. Third-party directories (ZoomInfo, RocketReach and similar) do not count.
- Respect robots.txt and site terms. If a directory blocks automated access (YellowPages and Angi returned HTTP 403 in the pilot), stop using it. Do not work around the block.
- Do not invent anything. If you cannot verify a value, write `unknown` or `unverified` and say why. If sources disagree, record both in `conflicts_notes` and leave the conflict open.
- No paid databases. No personal data beyond what a firm publishes about its own business.

## 2. Field definitions

`Req` means the field must be non-empty. Write `unknown` when you cannot find a value.

| # | Field | Req | Type / allowed values | Definition and rules |
|---|---|---|---|---|
| 1 | `record_id` | Y | `AEC-####` | Stable ID. Never reuse one, even after a record is suppressed. |
| 2 | `business_name` | Y | text | Legal or trading name as shown on the firm's site. Put a DBA or abbreviation in parentheses. |
| 3 | `website_url` | Y | URL | Canonical homepage after redirects. Write `none found` if there is no site. |
| 4 | `identity_verified` | Y | `yes: <evidence>` / `no: <reason>` | **Added after the pilot.** Confirms the domain belongs to this firm: the site shows the same name **and** a matching city, address or phone. Matching on name alone is not enough. |
| 5 | `discipline` | Y | text | Primary discipline(s): structural, civil, geotechnical, land surveying, MEP, general engineering contractor (GEC), design-build, GC. |
| 6 | `pilot_bucket` | Y | enum | `structural/civil`, `geotechnical`, `land surveying`, `general engineering contractor/design-build`, `MEP`. Used to balance batches. |
| 7 | `services_summary` | Y | text | Services as the firm describes them, paraphrased. |
| 8 | `hq_address_as_published` | Y | text | Address as printed on the firm's site. Otherwise `unknown`. |
| 9 | `hq_city` | Y | text | City of the HQ or main office. |
| 10 | `service_area` | Y | text | Service area as stated on the site, or `unknown (not stated)`. |
| 11 | `distance_band_from_dublin` | Y | `0-10 mi`, `10-25 mi`, `25-50 mi`, `>50 mi (exclude)` | Distance from Dublin, CA to the HQ or nearest office. |
| 12 | `distance_method` | Y | text | **Added after the pilot.** How the band was set, e.g. `estimated from city location; not measured` or `measured: Google Maps driving`. |
| 13 | `firm_size_signal` | Y | text | **Added after the pilot.** Staff count or office count from the firm's site. Mark third-party figures `(unverified)`. Use it to exclude large or national firms. |
| 14 | `license_type` | Y | text | e.g. `CSLB A`, `CSLB B`, `BPELSG PE civil`, `BPELSG PLS`. Write `unverified` unless you saw it on an official public page or on the firm's own site. |
| 15 | `license_number` | Y | text | Number, or `unknown`. Mark a third-party number `(third-party; unverified)`. |
| 16 | `license_status` | Y | text | Status from CSLB or BPELSG (`active`, `expired` and so on), or `unverified`. |
| 17 | `license_source` | Y | text | The exact source, e.g. CSLB data-portal file name and date, BPELSG lookup URL, or `none on firm site`. |
| 18 | `principal_publicly_listed` | Y | text | Name and title **only if listed on the firm's site**. Otherwise `not listed on pages checked`. |
| 19 | `contact_main_phone` | Y | text | Main business line published by the firm. |
| 20 | `contact_page_url` | Y | URL | The firm's contact page. |
| 21 | `contact_role_email` | Y | text | Role-based email shown on the site, or `none shown`. Never personal. |
| 22 | `contact_form_present` | Y | `yes` / `no` / `unknown (not checked)` | **Added after the pilot.** Only check whether the form exists. Never submit it. |
| 23 | `website_platform` | Y | text | Platform only when the evidence is clear: WordPress (`/wp-content/`), Wix (`Wix.com Website Builder` generator tag or `static.wixstatic.com`), Squarespace (`Server: Squarespace`), GoDaddy Website Builder (`img1.wsimg.com`), or custom. Otherwise `unknown`. |
| 24 | `platform_evidence` | Y | text | **Added after the pilot.** The specific marker you saw, so the platform claim can be audited. |
| 25 | `mobile_ux` | Y | `good` / `fair` / `poor` / `not visually checked` + note | Check in a browser at 375px: viewport meta tag, layout width vs. scroll width (horizontal overflow), body text size, tap-to-call link. |
| 26 | `performance_technical` | Y | text | Time to first byte (TTFB), HTTPS, `<title>`, meta description, H1, structured data, obvious errors. Lab metrics only, labelled as approximate. |
| 27 | `service_page_coverage` | Y | `none` / `weak` / `good` / `strong` + note | Does each core service have its own page? |
| 28 | `project_case_study_quality` | Y | `none` / `weak` / `medium` / `strong` + note | Named projects, photos, location, scope, dates, outcomes. |
| 29 | `local_search_gbp_observations` | Y | text | Only what is visible without logging in. Write `not checked` if you did not open Maps. Never infer review counts or rankings. |
| 30 | `accessibility_trust_issues` | Y | text | Missing alt text (count), placeholder or template text, stale copyright, missing credentials, broken links or scripts. |
| 31 | `trigger_event` | Y | text | Hiring, rebrand, new office, merger, new service, site relaunch, award. Give the evidence, or write `none found`. |
| 32-36 | `score_niche_fit`, `score_digital_gap`, `score_ability_to_benefit`, `score_active_business`, `score_contactability` | Y | integer 0-5 | See the rubric in section 3. |
| 37 | `score_total` | Y | integer 0-25 | Sum of the five scores. Calculated, never typed by hand. |
| 38 | `value_hypothesis` | Y | one sentence | One specific, evidence-based claim about what Manny could improve and why it matters to this firm's buyers. No hype words. |
| 39 | `confidence` | Y | text | **Added after the pilot.** `high`, `medium` or `low`, plus which parts are weak. |
| 40 | `date_checked` | Y | `YYYY-MM-DD` | The day the sources were read. Re-check any record older than 90 days before outreach. |
| 41 | `source_urls` | Y | URLs separated by ` \| ` | Every page used to support the record. Firm pages first, then official, then third-party. |
| 42 | `contact_status` | Y | `not_contacted` (default), `queued`, `contacted`, `replied`, `meeting`, `won`, `lost` | Research never changes this field. |
| 43 | `opt_out` | Y | `no` (default) / `yes` | `yes` the moment a firm asks not to be contacted. Permanent. |
| 44 | `suppressed` | Y | `no` (default) / `yes` | `yes` for opt-outs, existing clients, conflicts, large or national firms, or failed identity checks. Suppressed rows stay in the file so the dedup check still catches them. |
| 45 | `conflicts_notes` | Y | text | Disagreements between sources, ambiguous identity, bucket-fit caveats. Start each conflict with `CONFLICT:`. |

### Permanent exclusions (always suppressed)
Oaktown Engineers, Bear Geotechnical, Sequoia Remodeling (existing clients), and any firm that is clearly large or national. Large or national means any of: more than about 150 staff, more than 5 offices, offices in multiple states, or ENR-ranked. Examples from discovery that were excluded: ENGEO, Miyamoto International, Kier & Wright, Kleinfelder.

## 3. Scoring rubric (each dimension 0-5, total out of 25)

Score from evidence in the record only. Scores 1, 2 and 4 fall between the anchors below.

**Niche fit**: how closely the firm matches the offer and the existing proof (structural, geotech, design-build)
- 0: Not AEC, or outside 50 miles, or large/national.
- 3: AEC-adjacent, or the right discipline with a mostly non-local or B2B-only buyer (e.g. a national contractor-facing engineer, or a pipeline GEC that wins public bids).
- 5: Small or midsize structural, civil, geotech, survey or design-build firm within 25 miles that serves local owners, architects and contractors.

**Visible digital gap**: how much is visibly wrong, judged only from public evidence
- 0: Modern, fast, mobile-good site with strong service and project pages and no defects found.
- 3: Works, but with clear basics missing: no H1 or meta description, thin project proof, small mobile issues, or stale copyright.
- 5: No site, a placeholder site, a desktop-only layout on mobile, broken or template text, or a site that is years stale.

**Ability to benefit**: whether better web presence and local growth would change this firm's revenue
- 0: Pipeline is fully contract- or bid-driven with no web influence, or the firm has an in-house marketing team.
- 3: Some buyers research online (architects, developers, recruits). Moderate upside.
- 5: Buyers clearly search and compare locally (homeowners, small developers, architects choosing a geotech or structural engineer), the firm is small enough that a $1,000/month partner is material, and the gap blocks visible work.

**Evidence of active business**: whether the firm is operating now
- 0: Site down, license expired or revoked, or signs the firm has closed.
- 3: Site and listing exist but nothing is dated within about 2 years. An auto-updating copyright year does not count.
- 5: Current-year evidence: open hiring post, an official 2026 listing, a recent project or news item, or a recently updated office address.

**Contactability**: whether a published business route exists (never personal)
- 0: No phone, no form, no role email.
- 3: One route only (a phone **or** a form), or contact details hidden on a single page.
- 5: Main phone **and** (a role email **or** a contact form) **and** a principal named on the site.

**Priority bands**: 20-25 is Tier A (research deeper and draft a teardown); 16-19 is Tier B (nurture); 15 or below is Tier C (do not pursue now). A record with `confidence = low` cannot be Tier A.

## 4. Deduplication rules

Run these checks before adding a record, in this order. Any match means you update the existing record and do not create a new one.

1. **Domain**: compare the registrable domain after redirects, lower-cased, ignoring `www.` (e.g. `sfandb.com` redirects to `sfbengineering.com`, so key on `sfbengineering.com`). Record the old domain in `conflicts_notes`.
2. **Phone**: normalize to 10 digits. A match on the main phone is a duplicate, even if the name differs. This catches renamed firms (the pilot found Berlogar Stevens & Associates and "Berlogar Geotechnical Consultants" sharing one number).
3. **Address**: normalize the street number, street name and suite (`Pkwy` = `Parkway`, `Ste` = `Suite`, `#`). The same street address plus suite with a similar name is a duplicate. The same building with a different suite and a different name is **not** a duplicate.
4. **Business identity**: if the CSLB license number or the BPELSG license of a named principal matches an existing record, it is a duplicate. Treat parent/subsidiary and rebrands (e.g. Bellecci & Associates becoming Sanbell) as one entity under the current name. Put the former name in `conflicts_notes`.
5. Suppressed and opted-out rows are always included in the dedup check. Never delete them.

## 5. Source list (permitted, public)

| Source | Use | Notes |
|---|---|---|
| Firm website | Primary for everything | Read the homepage, contact, about, services and projects pages. Respect robots.txt (all pilot sites allowed normal pages). |
| CSLB data portal: https://www.cslb.ca.gov/onlineservices/dataportal/ | Contractor license number, class and status, in bulk | Public bulk license files. Downloading them is a file download, so the owner approves it once per refresh. Then match by business name and address offline. |
| CSLB license check: https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/ | Single-license check | Needs a search-form submission. During research, do not submit it; the owner (or an agent with approval) can run the check by hand. |
| BPELSG license lookup: https://www.bpelsg.ca.gov/consumers/lic_lookup | PE, SE, GE and PLS licenses for named principals | Same rule: it is a search form. Owner runs it, or record `unverified`. |
| City and county public documents | Activity evidence, addresses | e.g. the City of Pleasanton "Recognized Special Inspection & Testing Agencies" list (Aug 2026). |
| Business-park and chamber news (e.g. hacienda.org) | History, moves, triggers | Good for spotting rebrands and relocations. |
| Search-engine results | Discovery only | Never the only source for a field. |
| Third-party data sites (ZoomInfo, Datanyze, prelien.co, BuildZoom) | Size or license hints only | Always marked `(unverified)`. Never used for contact data. |
| YellowPages, Angi, Yelp | Do not use for automated reads | Returned HTTP 403 to automated fetches in the pilot. A human may browse them manually for discovery. |

## 6. Repeatable research workflow

| Step | Action | Target time |
|---|---|---|
| 1. Discover | Search by discipline and city: "<discipline> <city> CA" for Dublin, Pleasanton, Livermore, San Ramon, Danville, Hayward, Fremont, Walnut Creek, Concord, San Jose, Santa Clara, San Mateo. Also mine official lists (city special-inspection lists, CSLB bulk file filtered by class and county). Write candidates to a queue with discovery source. | 2-3 min per kept record (about half of candidates are rejected) |
| 2. Dedup and exclusions | Apply section 4 against the master file and the exclusion list. | 0.5 min |
| 3. Verify identity | Open the candidate site. Confirm the name **and** a matching city, phone or address. Reject domain lookalikes (the pilot found a Massachusetts LandTech, a Dutch Hencon, a Wisconsin Nelson Surveying and a domain redirecting to a Carlsbad survey firm). | 1-2 min |
| 4. Technical probe | Run the scripted probe (see notes): HTTP status, redirects, robots.txt, platform markers, title, meta description, H1, image alt counts, schema, phone and mailto links, TTFB. | 1 min |
| 5. Mobile check | Browser at 375px: layout width vs. scroll width, body font size, tap-to-call. Screenshot the worst finding. | 1-2 min |
| 6. Content read | Read the about, services, projects and contact pages: principals listed, services, project depth, dates, role email, form present. | 3-4 min |
| 7. License | Match against the CSLB bulk file (contractors) or record `unverified` (engineers and surveyors) until the owner runs BPELSG. | 1-2 min |
| 8. Score and hypothesis | Apply the rubric. Write one value hypothesis. Fill `conflicts_notes`. | 2 min |
| 9. Validate | Run the CSV build script: required fields, score ranges, calculated total, defaults, quoting. | batch, under 1 min |

**Time per record:** about **12-16 minutes** for a verified record once tooling is in place, plus 2-3 minutes of discovery overhead per kept record. See the pilot notes for actual figures.
