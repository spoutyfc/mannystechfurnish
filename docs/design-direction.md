# Design direction — AEC Digital Growth Partner

## Visual thesis
A drawing-sheet site: light, ruled, exact. It should read like a well-organized
set of construction documents — numbered sheets, title blocks, schedules — so a
structural or geotechnical principal recognizes the habits of their own work.

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
| `paper` | `#F5F5F2` | page background (cool off-white, not cream) |
| `surface` | `#FFFFFF` | tables, form |
| `ink` | `#15181B` | primary text, dark bands |
| `graphite` | `#4A5058` | secondary text — 7.6:1 on paper |
| `rule` | `#D3D6D2` | hairlines |
| `rule-strong` | `#8E949A` | table header rules, input borders (3:1+ non-text) |
| `signal` | `#B93A0B` | single accent: CTA fill, sheet markers — 5.6:1 with white |

Type: Archivo 600 for headings (sentence case, tight tracking), Inter for body
(18px / 1.6 desktop, 17px mobile), IBM Plex Mono 13px uppercase for sheet labels
and table headers only. Scale: 14 · 17 · 18 · 20 · 24 · 32 · 44 · 60.

Spacing: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Section padding 64 mobile / 112 desktop.
Radii: 2px everywhere. Shadows: none — separation comes from rules.
Motion: colour and underline transitions ≤150 ms only. No entrance animations,
no smooth-scroll library, no WebGL, no background video. Reduced motion
disables the remaining transitions.

Signature element: every section opens with a sheet label (`S-03 · The offer`)
on a rule, and evidence is shown as schedules (tables) rather than cards.

## References
1. **Construction document sets (title blocks, sheet index, schedules).** Borrow:
   numbered sheets, a strict grid, tabular facts. Avoid: blueprint-blue pastiche,
   fake drawing textures.
2. **Stripe's pricing/legal pages.** Borrow: plain scope tables, terms next to the
   price. Avoid: gradient hero art, product-UI mockups.
3. **Gov.uk service pages.** Borrow: plain language, visible focus, one action per
   page. Avoid: the institutional tone — this is still a one-person practice.

## Forbidden defaults (this project)
- The previous black/magenta theme, WebGL orb, background videos, preloader,
  Lenis smooth scroll, scroll blur, tilt/magnetic hovers and marquee.
- Vanity counters, "Most popular", "Accepting 2 clients", any scarcity claim.
- Three-card icon rows; giant uppercase hero type that says little.
- Purple/blue gradients, glass, glow, gradient text, emoji icons.
- Body text under 16px; low-contrast `white/45`-style text.
- "Unlock", "seamless", "elevate", "revolutionize", "premium", "world-class".
- Any claim that Manny's Tech Furnish does engineering, or guarantees rankings,
  leads or revenue.
