# Design direction — AEC Digital Growth Partner

## Visual thesis
Keep the existing Manny's Tech Furnish brand — black, white and hot pink, big uppercase Archivo
headlines, Archivo labels, the WebGL hero field — and apply drawing-set discipline to the
content: numbered sheets, ruled schedules and tables instead of decorative cards. (Owner
direction, 2026-10-27: build on the current site's theme.)

## Content hierarchy
1. Who it is for (engineering and construction firms, Bay Area) and what it does.
2. Proof that is checkable: three AEC client sites, with live URLs and the
   date the facts were checked.
3. Problems principals already recognize.
4. One offer, one price, scope and exclusions in plain sight.
5. What happens in days 1–45 and every month after.
6. Fit / not a fit. Ownership terms. FAQ.
7. One action: book a 20-minute fit call.

## Page intent map
| Route | Intent |
|---|---|
| `/` | Decide in 60 seconds whether this is for my firm, then book a call |
| `/engineering-construction` | Show that the work is specific to each discipline |
| `/work` | Inspect the evidence: what was shipped, where, checked when |
| `/growth-partner` | Read the full offer: scope, exclusions, terms, change orders |
| `/process` | Know exactly what happens and what I have to provide |
| `/about` | Know who I'd be working with |
| `/contact` | Request a fit call; failure and success states are explicit |
| `/privacy`, `/accessibility` | Plain statements, no boilerplate padding |

## Token sheet
| Role | Value | Notes |
|---|---|---|
| background | `#000` | page and footer |
| text | `#fff` | headings, primary text |
| secondary text | `#c7c7c7` | ~12:1 on black |
| rules | `white/15`, `white/32` | hairlines, table headers, input borders |
| accent | `--accent` (oklch 0.7 0.27 350, hot pink) | CTA fill with **black** text, sheet numbers, highlighted headline words |

Type: Archivo 600 uppercase for headings (line-height 0.95), Inter body 17px mobile / 18px desktop,
Archivo uppercase with wide tracking for labels. Buttons are square, uppercase, pink-on-black or
outlined white. Motion: hero WebGL field (frozen under reduced motion) and the discipline marquee
(stops under reduced motion); otherwise colour transitions only.

## References
1. **Construction document sets (title blocks, sheet index, schedules).** Borrow:
   numbered sheets, a strict grid, tabular facts. Avoid: blueprint-blue pastiche,
   fake drawing textures.
2. **Stripe's pricing/legal pages.** Borrow: plain scope tables, terms next to the
   price. Avoid: gradient hero art, product-UI mockups.
3. **Gov.uk service pages.** Borrow: plain language, visible focus, one action per
   page. Avoid: the institutional tone — this is still a one-person practice.

## Forbidden defaults (this project)
- Preloader, scroll-jacking smooth scroll, whole-page scroll blur, autoplaying background video
  (removed for speed and accessibility; can return only with reduced-motion handling and a size budget).
- Vanity counters, "Most popular", "Accepting 2 clients", any scarcity claim.
- Three-card icon rows; low-contrast `white/30–45` text; body text under 16px.
- "Unlock", "seamless", "elevate", "revolutionize", "premium", "world-class".
- Any claim that Manny's Tech Furnish does engineering, or guarantees rankings, leads or revenue.
