# Prospect Pilot Notes: 10 Bay Area AEC Firms

Date: 2026-10-27 | Researcher: agent (web research only, no contact made) | Files: `prospects-pilot.csv`, `prospect-schema.md`, `site-probe.py`

## Result

| ID | Firm | Bucket | City | Score /25 | Tier |
|---|---|---|---|---|---|
| AEC-0001 | Berlogar Stevens & Associates | Geotechnical | Pleasanton | 21 | A |
| AEC-0008 | Platinum Pipeline, Inc. | GEC | Livermore | 21 | A |
| AEC-0010 | BELDEN Consulting Engineers | MEP | Pleasanton | 21 | A |
| AEC-0002 | Romig Engineers, Inc. | Geotechnical | San Carlos | 20 | A |
| AEC-0004 | Structural Engineers, Inc. (SEI) | Structural | Santa Clara | 19 | B |
| AEC-0009 | J.M. O'Neill, Inc. | GC (design-build unconfirmed) | Livermore | 19 | B |
| AEC-0003 | FBA Inc. Structural Engineers | Structural | Hayward | 18 | B |
| AEC-0006 | Carlson, Barbee & Gibson (CBG) | Civil/Survey | San Ramon | 18 | B |
| AEC-0007 | Lea & Braze Engineering | Survey/Civil | Pleasanton/Hayward | 17 | B |
| AEC-0005 | Zenith Engineers | Structural | Pleasanton | 16 | B (calibration; suggest suppress) |

The bucket mix matches the brief: 3 structural/civil, 2 geotech, 2 survey, 2 GEC/design-build, 1 MEP. All 10 are within roughly 30 miles of Dublin. Every row has `contact_status=not_contacted`, `opt_out=no`, `suppressed=no`, source URLs and `date_checked=2026-10-27`. The CSV was written with Python's `csv` module (all fields quoted) and read back to confirm 10 rows by 45 columns.

## What worked

- **Scripted homepage probe** (`site-probe.py`) plus a **375px browser check** produced findings that can be checked again. Examples:
  - Berlogar and SEI lay out at 981px on a phone (no working mobile viewport).
  - Romig has leftover template text, "Your Custom Text Here", on every page.
  - Platinum Pipeline's page title says "Califorina", the copyright is 2018 and TTFB is 1.6s.
  - J.M. O'Neill's "Completed Projects" link goes to a default `/new-page` URL.
  - FBA's leadership page has a heading and no names.
- **Official public lists as activity evidence.** The City of Pleasanton special-inspection agency list (updated August 2026) showed a current listing, and it also exposed a name and address conflict for Berlogar.
- **Phone-based dedup** caught that one phone number is used by two Berlogar entity names.
- **Platform detection** from markup and headers was reliable for WordPress, Wix, Squarespace and GoDaddy. Generic substring checks gave false positives: "divi" matches "individual" and "elementor" over-counts. The probe now uses `themes/divi` and `elementor-`.

## What didn't work

- **Guessing domains wastes time and is risky.** About half of the guessed or search-suggested domains failed DNS, belonged to an unrelated firm, or were parked:
  - `landtechinc.com` is a Massachusetts firm, not Fremont's Landtech Consultants.
  - `hencon.com` is a Dutch company, not the Pleasanton GC.
  - `wheatlandsurveying.com` redirects to KWA Surveying in Carlsbad.
  - `nelsonsurveying.com` is a Wisconsin firm.
  - `alliedconstructionservices.com` is for sale.
  - `bellecci.com` redirects to Sanbell (a rebrand or merger, so not a small-firm target now).

  This is why `identity_verified` is now a required field.
- **Small pure land surveyors are nearly invisible on the web.** The Livermore and Pleasanton surveyors found in directory summaries had no verifiable site:
  - Lamb, Golden Pacific, Quiet River, Hogan (its Livermore office belongs to a Santa Rosa firm) and Alexander & Associates either had no site found or a site that did not respond.
  - Barber Surveying's likely domain is a GoDaddy "Launching Soon" page, but nothing on it confirms it belongs to the Livermore firm.

  Both survey rows are therefore **midsize civil and survey firms** (CBG, Lea & Braze) with smaller gaps. The firms with the biggest gap (no site) are the hardest to verify without a phone call, which this research does not allow.
- **YellowPages and Angi return HTTP 403** to automated fetches. They can only be used by a person browsing manually.
- **License verification failed for all 10.** The CSLB single-license check and the BPELSG lookup both need a search-form submission, which this research does not allow. The CSLB bulk data files need an approved download. Platinum Pipeline's CSLB #877073 (class A) comes only from a third-party site and is marked unverified.
- **Google Business Profile was not checked** for any firm (Maps was not opened). The only GBP evidence is a Maps place link on Belden's own site. Local-search scoring is therefore based on site signals only.
- **Search-engine summaries sometimes conflated firms** (FBA's old address, Lea & Braze's HQ, J.M. O'Neill being "design-build"). Treat them as leads, never as facts.

## Schema changes made after the pilot (v1.0 to v1.1)

1. Added `identity_verified` (required): the domain must show the same name plus a matching city, address or phone.
2. Added `firm_size_signal`, used to enforce the large/national exclusion. Zenith (40 engineers, 3 offices), CBG (75+ engineers) and Lea & Braze (5 offices) were all close to the limit.
3. Added `distance_method`. Bands are estimates until measured.
4. Split the license field into `license_type`, `license_number`, `license_status` and `license_source`, with a `(third-party; unverified)` marker.
5. Added `platform_evidence` so platform claims can be audited, and `contact_form_present`, which records whether a form exists without submitting it.
6. Added `confidence`. A low-confidence record cannot be Tier A.
7. Added `pilot_bucket` for batch balancing, and `hq_address_as_published` so the site address is kept separate from third-party addresses.
8. Rubric clarifications:
   - An auto-updating copyright year is not evidence of activity (FBA shows 2026).
   - For contactability, a single route scores 3 and phone plus email or form plus a named principal scores 5.
   - Bid-driven GECs cap at 3 on ability-to-benefit unless they serve private local clients.

## Time per record (pilot actuals)

The pilot took about 3.5 hours for 10 kept records and about 15 rejected candidates, or roughly **20 minutes per kept record**. That includes building and debugging the probe script, which accounts for about 40 minutes. Discovery and rejection took about 35% of the rest.

Steady-state estimate with the probe and workflow in place: **12-16 minutes per verified record**, plus 2-3 minutes of discovery overhead. A full hand-off-quality record is about **15 minutes**.

## Recommendation for scaling to 100

1. **Change discovery first.** Seed candidates from official lists instead of search engines:
   - Contractors: with owner approval, download the CSLB bulk license file once and filter to classes A and B in Alameda, Contra Costa, Santa Clara and San Mateo counties. That also solves license verification for contractors.
   - Geotech and testing firms: city special-inspection and testing lists from Pleasanton, Livermore, San Ramon, Fremont and San Jose.
   - Engineers and surveyors: membership directories (SEAONC, CLSA East Bay chapter, ACEC California), browsed by hand within their terms.
2. **Ask the owner to run BPELSG checks** for the Tier A firms only (about 20-25 of 100). At roughly 1 minute each, that is the cheapest way to fill license fields without breaking the no-form-submission rule.
3. **Batch in 20s by bucket**, keeping the pilot ratio (30/20/20/20/10). Run the probe on all candidates first, then do mobile and content checks only for candidates that pass identity and size filters. That avoids about 40% of the manual time on rejects.
4. **Do a manual GBP pass** (a person, in a normal browser, about 1 minute each) for Tier A firms before any outreach, and record only what is visible.
5. **Re-check before outreach.** Records go stale after 90 days. Recompute scores whenever `date_checked` is refreshed.
6. **Expected yield:** about 40% Tier A, based on 4 of 10 in the pilot. A 100-record build should take about 25-28 hours of research, or about 18-20 hours if CSLB bulk data and directory seeding replace search-engine discovery.

## Open items for the owner

- Approve a one-time download of the CSLB bulk license data (public data portal) to verify contractor licenses.
- Run BPELSG lookups for Berlogar, Romig and Belden principals before any teardown is sent.
- Decide whether to suppress Zenith (calibration record, national focus) and whether midsize survey firms (CBG, Lea & Braze) are in scope.
