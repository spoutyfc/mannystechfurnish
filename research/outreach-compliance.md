# Outreach and Site Compliance Review: Manny's Tech Furnish

- **Business:** Manny's Tech Furnish, a sole proprietorship run by Mansoor Arif, Dublin, California
- **Site:** mannystechfurnish.com (Next.js, contact form that stores inquiries in Postgres, email through Resend, Cloudflare Turnstile, Vercel Web Analytics, Stripe checkout)
- **Planned activity:** low-volume B2B cold email to architecture, engineering and construction (AEC) firms
- **Prepared:** 2026-10-27, by an automated compliance reviewer. **This is not legal advice.** It flags issues for a qualified California attorney to confirm. Every figure was checked against the primary source listed in the Sources table on the access date.

---

## 0. Summary of findings

| # | Finding | Severity | Owner |
|---|---|---|---|
| F1 | No physical postal address exists for use in commercial email. CAN-SPAM requires one in every outreach email. | **Blocker for outreach** | Mansoor |
| F2 | The site has no privacy policy page (`app/privacy` does not exist). The footer has no privacy link. | High | Dev |
| F3 | The footer shows a personal Gmail address. Outreach sent from `@gmail.com` cannot be authenticated with the business domain's SPF, DKIM and DMARC. | High (deliverability and trust) | Mansoor + Dev |
| F4 | The `testimonials` table defaults `rating` to `5`. A default rating could publish a star rating no client gave. | Medium | Dev |
| F5 | The portfolio names real firms (Oaktown Engineers, plus a geotechnical firm) and links to their sites. Written permission to use their names, logos and descriptions is not on file. | Medium | Mansoor |
| F6 | The copy is already careful: `lib/site-content.ts` lists "Guaranteed rankings, lead counts or revenue" as an exclusion. Two phrases still need review: "keep you ranking" and "ties spend to results". | Low | Dev |
| F7 | Any outreach to engineering firms must avoid protected titles such as "engineer" combined with "civil", "structural", "consulting" and similar, and must not offer engineering services. | Low if wording rules are followed | Mansoor |

---

## 1. CAN-SPAM Act (15 U.S.C. 7701–7713; 16 CFR Part 316)

**It applies to B2B email.** The FTC states: "The law makes no exception for business-to-business email." A one-to-one cold pitch whose primary purpose is promoting a service counts as a commercial message. Replies within an engagement the recipient asked for, such as a quote they requested, are "transactional or relationship" messages and are mostly exempt. Even those must still have accurate headers.

### Requirements, applied to this project

| Requirement | What it means here |
|---|---|
| **1. No false or misleading header information** | The From name must be "Mansoor Arif – Manny's Tech Furnish" or similar. The From and Reply-To addresses must be real mailboxes Mansoor controls. Routing must be honest: no spoofed domains and no lookalike domains. |
| **2. No deceptive subject lines** | The subject must reflect the body. No fake "Re:" or "Fwd:", no "Your invoice" and no "Following up on our call" when there was no call. |
| **3. Identify the message as an ad** | The law requires a clear and conspicuous identification that the message is an advertisement or solicitation (15 U.S.C. 7704(a)(5)(A)(i)). The FTC allows flexibility in how this is done. A plain footer line such as "This is a one-time business solicitation from Manny's Tech Furnish" is a conservative choice. Confirm the wording with counsel. |
| **4. Valid physical postal address** | Every commercial email must include one of three things: a current street address, a P.O. box registered with the USPS, or a private mailbox registered with a commercial mail receiving agency (CMRA) under Postal Service regulations. **REQUIRED EVIDENCE:** Mansoor must choose one and record its type (street, USPS P.O. box or CMRA private mailbox) and the date it was verified. A home address is legally valid, but a P.O. box or CMRA mailbox protects his privacy. **No outreach may be sent until this exists.** |
| **5. Tell recipients how to opt out** | Each email needs a clear, conspicuous explanation of how to stop further email. A working reply address ("Reply 'no thanks' and I won't email again") is a valid mechanism. The mechanism must keep working for at least 30 days after the message is sent (15 U.S.C. 7704(a)(3)). The sender may not charge a fee, ask for any personal information beyond an email address, or require any step other than sending a reply or visiting a single web page. |
| **6. Honor opt-outs promptly** | Stop within **10 business days** (15 U.S.C. 7704(a)(4)). The Gmail and Yahoo rules in section 3 shorten this to about 2 days in practice, so the target is **same day, no later than 48 hours**. Opted-out addresses may not be sold or transferred except to keep complying with the law. |
| **7. Monitor anyone sending for you** | "You can't contract away your legal responsibility." Mansoor stays liable if a VA, agency or tool such as Resend, Instantly or Apollo sends on his behalf. |

**Aggravated violations** (15 U.S.C. 7704(b)(1)) add exposure when addresses come from automated harvesting of websites, or from "dictionary attacks" that generate address permutations such as firstname@, f.lastname@ and similar. This is the legal basis for the "no guessed emails" control in section 3.

**Penalties.** The FTC guide gives "up to $53,088" per separate email in violation. The 2025 inflation-adjusted figure carries into 2026. A notice published in the Federal Register on 2026-09-15 (FR Doc. 2026-18853) says the FTC "will continue to apply the 2025 civil penalty levels" because OMB cancelled the 2026 adjustment (Memorandum M-26-11) after the shutdown delayed the CPI data. Each non-compliant email is a separate violation.

---

## 2. California Business & Professions Code 17529.5 and 17529.4

### 17529.5: false or misleading commercial email

It is unlawful to advertise in a commercial email advertisement sent from or to California that does any of the following:

- (a)(1) contains or is accompanied by a third party's domain name without that party's permission
- (a)(2) contains or is accompanied by falsified, misrepresented or forged header information
- (a)(3) has a subject line likely to mislead a recipient, acting reasonably under the circumstances, about a material fact regarding the contents or subject matter of the message

**Who may sue (b)(1)(A):** the Attorney General, an electronic mail service provider, or **a recipient of an unsolicited commercial email advertisement**. This private right of action makes 17529.5 the main litigation risk for California senders. CAN-SPAM itself has no private right for ordinary recipients.

**Damages (b)(1)(B):** actual damages, or liquidated damages of **$1,000 per unsolicited commercial email** sent in violation, **up to $1,000,000 per incident**, plus reasonable attorney's fees and costs.

**Reduction for due care (b)(2):** If the sender "established and implemented, with due care, practices and procedures reasonably designed to effectively prevent" violations, the court shall reduce liquidated damages to at most **$100 per email** or **$100,000 per incident**. **This is the legal reason to keep the documented pre-send checklist (section 9) and the batch records (section 3).** Written procedures that are actually followed are evidence of due care.

The statute also makes violation a misdemeanor, per section (c). Counsel should confirm.

**Case-law context:**

- *Kleffman v. Vonage Holdings Corp.*, 49 Cal. 4th 334 (2010). The California Supreme Court held that sending ads from multiple, accurately registered domain names to get past spam filters is not, on those facts, "falsified, misrepresented, or forged header information."
- Courts have also held that CAN-SPAM preempts state law except for claims based on falsity or deception. 17529.5 claims therefore survive mainly where headers or subject lines are actually deceptive. The preemption holdings come mainly from Ninth Circuit decisions, which this review did not independently retrieve, so counsel should confirm them.
- **Practical takeaway:** honest headers and honest subject lines remove nearly all 17529.5 exposure. Do not rotate domains to evade filters anyway. It looks evasive and damages deliverability.

### 17529.4: harvesting and automated address generation

It is unlawful to do any of the following when the purpose is to send unsolicited commercial email from or to California:

- (a) collect email addresses posted on the Internet
- (b) use addresses obtained by automated means based on combinations of names, letters or numbers
- (c) use scripts to register multiple email accounts

One reported analysis says CAN-SPAM preempts this section, so treat it as a conservative design rule rather than a confirmed liability. Counsel should confirm. **Rules for this project:**

- Never scrape addresses with tools.
- Never generate addresses through pattern guessing, even with a "verifier."
- Never use multiple throwaway sending accounts.

A human may manually copy a single address that a firm publishes for business contact. That is materially different from automated harvesting, but counsel should confirm the line.

---

## 3. Practical controls for this project

### 3.1 Suppression list

Keep a single source of truth that is never deleted from, for example a `outreach_suppression` table in the same Postgres database, or a CSV under version control in a private repo:

```
email_normalized (lowercased, trimmed) | domain | reason (opt_out | bounce_hard | complaint | do_not_contact_request | role_inbox_declined | legal_hold) | source (reply | form | manual | provider_webhook) | received_at (UTC) | processed_at (UTC) | batch_id | notes
```

- Check the list before every send at both the address level and the domain level. If a firm says "don't contact us," suppress the whole domain.
- Ingest Resend bounce and complaint webhooks automatically. Opt-out replies are added by hand the same day.
- Never sell, share or upload the list to third parties except as needed to suppress sends.

### 3.2 Sourcing rules

- **No purchased or rented lists.** No data-broker exports and no "enrichment" tools that guess addresses.
- **No guessed addresses** (firstname@, f.lastname@ and similar), even if an SMTP verifier "confirms" them. That is the dictionary-attack pattern covered by 15 U.S.C. 7704(b) and BPC 17529.4.
- **Use only role-based or published business addresses** that the firm itself publishes on its own website or official directory for general or business inquiries, such as info@, hello@ or contact@, or a named principal's address that the firm publishes for business contact.
- **Record provenance** for every row: the URL where the address was published, the date it was seen, and who collected it.
- Skip any site whose page says "no solicitations," and skip addresses published only for careers, permits, RFP submissions, emergencies or accessibility (see section 8).

### 3.3 Approval and volume

- **Mansoor manually approves each first-touch batch.** He reviews the recipient list, the rendered email and the checklist in section 9, and the approval is logged with a batch_id and timestamp.
- **Keep daily volume low:** a suggested ceiling of 20–30 first-touch emails per day from a warmed domain, and at most 2 follow-ups per recipient, spaced at least 4–7 business days apart. Stop all contact after any reply, opt-out or bounce.
- At this volume Mansoor is far below Gmail's bulk-sender threshold of about 5,000 messages per day to personal Gmail accounts. Bulk-sender status is permanent once reached, so stay well clear. Still implement the bulk-sender controls below, because they are cheap and improve deliverability.

### 3.4 Content rules

- **No fake "Re:" or "Fwd:"**, no false familiarity ("as discussed"), no false urgency, and no impersonating a client or a mutual connection.
- **No tracking pixels or click tracking** without a documented review. Pixels are unreliable, can trigger spam filters, and add privacy obligations. Default to off. Plain-text or near-plain-text email is preferred.
- Do not name or describe current clients in outreach unless the client has given written permission (section 5).
- No ranking, traffic or lead guarantees (section 6). No engineering titles or engineering services (section 7).

### 3.5 Sending domain authentication (Gmail and Yahoo rules in force since February 2024)

| Control | All senders | Bulk senders (Gmail: about 5,000+/day to personal Gmail accounts) |
|---|---|---|
| SPF or DKIM | Required (one of them) | **Both** required |
| DMARC | Recommended | Required, `p=none` minimum, **From domain aligned** with SPF or DKIM |
| Forward and reverse DNS (PTR), TLS | Required | Required |
| Spam rate (Postmaster Tools) | Keep **below 0.1%**, never reach 0.3% | Same |
| One-click unsubscribe (RFC 8058 `List-Unsubscribe` + `List-Unsubscribe-Post`) | Recommended | **Required** for marketing and subscribed mail |
| Honor unsubscribe | — | Gmail: within **48 hours**. Yahoo: within **2 days** |

**Recommendation:**

- Send outreach from a dedicated subdomain of the business domain, such as `mail.mannystechfurnish.com` or a separate outreach domain that clearly identifies the business, through Resend.
- Configure SPF, DKIM (Resend provides the records) and DMARC. Start with `p=none` and a reporting address, then move to `quarantine` after 30 days of clean reports.
- Add RFC 8058 one-click unsubscribe headers to outreach email even though Mansoor is not a bulk sender.
- **Stop using `mansoor.buspro@gmail.com` as the public business contact and as the outreach sender.** A consumer Gmail address cannot carry the business domain's DMARC alignment, and it weakens the "accurate header and identity" posture.

### 3.6 Record keeping

Retain the following for at least **4 years**, which roughly matches the federal default statute of limitations for civil penalties. Counsel should confirm the period.

- Batch manifest (batch_id, approver, approval timestamp, recipient count)
- Per-recipient provenance (source URL and date)
- Final rendered email (subject, body, headers including From, Reply-To and List-Unsubscribe)
- Send logs from Resend
- Opt-out log with received and processed timestamps
- The version of this checklist in force at the time

These records are the evidence of "due care" under BPC 17529.5(b)(2).

---

## 4. Contact form and site privacy

### 4.1 CalOPPA (Bus. & Prof. Code 22575–22579)

CalOPPA applies to an "operator" of a commercial website that collects personally identifiable information from consumers residing in California. Its "consumer" definition is narrow: an individual seeking goods or services "for personal, family, or household purposes" (BPC 22577). A purely B2B site may arguably fall outside it. However, the site sells packages through Stripe checkout and has public payment pages, so individuals such as sole proprietors and homeowners could use it. **Treat CalOPPA as applicable.**

A conspicuously posted policy must:

1. Identify the **categories of PII collected**, and the **categories of third parties** it may be shared with.
2. Describe any process for a consumer to **review and request changes** to their PII, if one is offered.
3. Describe how the operator **notifies consumers of material changes**.
4. State its **effective date**.
5. Disclose **how the site responds to browser "Do Not Track" signals** or similar mechanisms. This can be satisfied by a clear link to a description of an opt-out program the operator follows.
6. Disclose **whether other parties may collect PII about a consumer's online activities over time and across sites** when they use this site.

Non-compliance becomes a violation only if the operator fails to post a compliant policy **within 30 days after being notified**. Posting one now removes the issue.

### 4.2 CCPA/CPRA applicability

A for-profit business is covered only if it meets any of these:

- annual gross revenue over **$26,625,000** (CPI-adjusted figure effective January 1, 2025, per the CPPA; the next adjustment is due in January 2027)
- buys, sells or shares personal information of **100,000 or more** California consumers or households
- derives **50% or more** of annual revenue from selling or sharing personal information

A solo web studio meets none of these, so **CCPA is very likely not applicable.** Mansoor should confirm his revenue and that he does not sell or share data. Note that the B2B and employee exemptions expired on December 31, 2022, so if the business ever crosses a threshold, B2B contact data will be covered.

**Recommendation regardless:** publish a plain-language privacy notice that covers CalOPPA and goes slightly beyond it.

### 4.3 What the privacy page should say, mapped to the actual stack

| Data / processor | What is collected | Purpose | Disclosure |
|---|---|---|---|
| Contact form → Postgres | Name, email, optional phone, subject, message, timestamp | Respond to the inquiry | Stored in the site database. Not sold or shared for marketing. |
| Resend | Email address and message content of replies and notifications | Send email | Service provider |
| Cloudflare Turnstile | IP address, TLS fingerprint, User-Agent, site key/origin (per Cloudflare's Turnstile addendum, effective 2025-06-18) | Bot and spam prevention ("strictly necessary") | Cloudflare acts as processor for bot detection, and as controller for improving its bot models |
| Vercel Web Analytics | Page URL, referrer, filtered query parameters, coarse geolocation (country/region/city), OS, browser, device type. No cookies. Visitors are identified by a request hash that is discarded after 24 hours. | Aggregate traffic statistics | Vercel states the data is anonymous and not tied to any individual or IP address |
| Stripe (checkout and payment pages) | Name, email, payment details collected directly by Stripe | Payment processing | Stripe's own privacy policy applies. The site stores only order metadata and the client's name and email. |
| Hosting logs (Vercel) | IP address and request metadata | Security and operations | Service provider |

The page must also include:

- **Do Not Track:** an honest statement, for example: "The site does not use cross-site tracking. It does not change its behavior in response to DNT signals because no cross-site tracking occurs." Vercel Analytics is cookieless and does not track across sites.
- **Third-party tracking across sites:** state that none is used. This must stay true: adding a Meta pixel, Google Ads tag or GA4 would require updating the policy and reconsidering consent.
- **Access, correction and deletion:** offer them by email to the business address, with a target response time of 30 days.
- **Policy changes:** describe how changes are notified (a revised effective date at the top of the page).
- **Contact:** the business email and the postal address from F1.

### 4.4 Consent banner

Vercel's documentation says Web Analytics works "without using any third-party cookies." Visitors are identified by a hash of the incoming request. The visitor session "is automatically discarded after 24 hours," and recorded data points are anonymous and not tied to an individual or IP address. Turnstile's signals are described as "strictly necessary" for bot detection.

**Conclusion:** no US law requires a cookie consent banner for this configuration, and none is recommended, because a banner adds friction without legal benefit. Re-evaluate if any of the following happens:

- an advertising pixel or Google Analytics is added
- the site targets EU or UK visitors (GDPR, ePrivacy)
- Vercel changes its method

Also use Vercel's `beforeSend` hook to strip query parameters that could carry personal data. The contact form currently does not put PII in URLs, and that should stay true.

### 4.5 Retention (suggested)

- **Contact inquiries that never become clients:** delete or anonymize 24 months after the last contact.
- **Spam or bot submissions:** delete within 30 days.
- **Client records and orders:** keep as long as tax and accounting law requires. IRS guidance is generally 3–7 years, so confirm with an accountant.
- **Outreach suppression list:** keep indefinitely. It exists to honor opt-outs, and it holds the minimum data: the address and the reason.
- **Outreach batch records:** 4 years (section 3.6).
- **Mechanism:** a scheduled job, or a documented quarterly manual purge, with the purge date logged. State these periods in the privacy notice.

---

## 5. Endorsements, testimonials, case studies and logos

### FTC Endorsement Guides (16 CFR Part 255, revised and announced June 29, 2023)

- Endorsements must reflect the **honest opinions and actual experience** of the endorser. The advertiser is liable for misleading endorsements it uses.
- **Results:** an endorsement describing a consumer's experience on a key attribute "will likely be interpreted as representing that the endorser's experience is representative of what consumers will generally achieve" (255.2(b)). Mansoor needs substantiation that a result is typical. Otherwise he must clearly disclose the generally expected result, and substantiate that disclosure too. For example, "Client X's inquiries doubled" implies typical results.
- **Material connections** must be disclosed clearly and conspicuously, close to the endorsement. These include discounts, free work, friendship, family ties, referral fees, and a testimonial given in exchange for a reduced price.
- **Editing:** reviews may not be edited, selected or presented in a way that distorts what reviewers actually said.

### FTC Consumer Reviews and Testimonials Rule (16 CFR Part 465, effective October 21, 2024)

The rule prohibits:

- fake or false reviews and testimonials, including ones attributed to people who do not exist or who had no actual experience
- buying reviews with incentives conditioned on positive sentiment
- undisclosed insider reviews
- company-controlled "independent" review sites
- review suppression through threats or false accusations
- fake social-media indicators

Courts can impose **civil penalties for knowing violations**. Under FTC Act section 5(m)(1)(A), the current maximum is **$53,088 per violation**.

### Implications for mannystechfurnish.com

1. **Written permission from each client** (email is fine; keep it) before showing any of the following:
   - (a) the client's name or logo
   - (b) a screenshot of or link to their site presented as Mansoor's work
   - (c) a testimonial, with the exact wording approved
   - (d) any metric about their business

   This applies to the Oaktown Engineers and geotechnical-firm entries in `app/page.tsx` and `lib/site-content.ts`. Permission to show work is separate from permission to quote the client.
2. **No invented, composite or paraphrased testimonials.** The homepage testimonials section is currently empty (`app/page.tsx` around line 388 has only the section comment). Keep it empty until real, approved quotes exist.
3. **Remove the default `rating: 5`** from the `testimonials` table (`lib/db/schema.ts`). A star rating may be shown only if the client actually gave it.
4. **Results claims** such as "more calls" or "ranked on page 1" need the client's permission, dated before-and-after evidence kept on file, and context or a disclosure that results vary and are not typical. Prefer process facts such as "rebuilt the site with service and city pages generated from structured data" over outcome claims.
5. **Disclose material connections** where they exist, for example "Client received a discounted rate" or "Family business."

---

## 6. Advertising claims: no guaranteed rankings

- Google: "**No one can guarantee a #1 ranking on Google.** Beware of SEOs that claim to guarantee rankings, allege a 'special relationship' with Google, or advertise a 'priority submit' to Google" (Search Central, *Do you need an SEO?*, updated 2026-06-05).
- Google Business Profile: "There's no way to request or pay for a better local ranking on Google." Local ranking depends on relevance, distance and prominence.
- **The same Google page warns:** "Be wary of SEO firms and web consultants or agencies that email you out of the blue." AEC prospects may have read this. Cold email therefore needs to be visibly specific, honest and easy to decline. Do not use generic "I can get you to #1" pitches.
- Unsubstantiated performance claims also risk liability under FTC Act section 5 and California's false advertising law (BPC 17500). Counsel should confirm the scope.

**Site copy check:**

- `lib/site-content.ts` already lists "Guaranteed rankings, lead counts or revenue" as an exclusion. Keep it.
- `app/page.tsx` line 131 says "Regular SEO check-ins to keep you ranking." Suggested change: "Regular SEO check-ins on indexing, rankings and search visibility."
- Line 110 says "ties spend to results." This is acceptable as a description of reporting, not a promise.

**Safe outreach phrasing:** "I build fast, well-structured sites and set up Search Console so you can see how you're found. I can't promise rankings; no one honestly can."

---

## 7. Engineering titles: California BPELSG

- **Practice:** under BPC 6730, anyone who "practices, or offers to practice, civil engineering, electrical engineering or mechanical engineering" must be licensed. **Offering** engineering services counts, not just performing them. BPC 6787 makes unlicensed practice, and unlicensed use of protected titles, a **misdemeanor**.
- **Titles:**
  - BPC 6732 and 6787(g), (i) and (j) restrict "Professional Engineer," "Licensed Engineer," "Registered Engineer," "Consulting Engineer," and the branch titles: Civil, Electrical, Mechanical, Structural, Geotechnical/Soil(s), Agricultural, Chemical, Control System, Fire Protection, Industrial, Metallurgical, Nuclear, Petroleum and Traffic Engineer, plus combinations and abbreviations such as "P.E."
  - The BPELSG *Guide for Local Officials* states: "The word 'engineer' by itself is considered generic and is not regulated."
  - "Software engineer" is therefore probably lawful, but it is **not recommended** in AEC outreach. The audience is licensed engineers, and the term invites confusion about qualifications.

**Rules for Mansoor:**

1. Never describe himself as an engineer of any kind in outreach or on the site, and never use "P.E.", "engineering consultant" or "consulting engineer."
2. Never offer, or appear to offer, engineering services. That includes structural checks, code compliance opinions, calculations, "engineering-grade" deliverables, or reviewing a client's technical content for accuracy.
3. When writing site copy about an engineering client's services, state that technical claims are supplied and approved by the client's licensed engineers.
4. Do not show a client's PE seal, license number or stamped documents unless the client provides them and approves their use.

**Safe wording:**

- "Web developer for architecture, engineering and construction firms."
- "I build websites for engineering firms; I am not an engineer and don't provide engineering services. All technical content is written or approved by your licensed staff."
- Avoid: "engineering web solutions," "your web engineer," "site engineering."

---

## 8. Do not pitch through channels not meant for solicitation

Do not send pitches to any of the following, even when it is the only address found:

- careers or HR addresses and job-application portals
- permit, plan-check, RFP/RFQ submission or bid portals; procurement inboxes for public agencies (these have formal vendor processes)
- emergency, after-hours, "24/7 response" or safety lines
- **accessibility or ADA accommodation channels** (misusing them harms disabled users and is reputationally severe)
- privacy, legal or abuse inboxes, and data-request channels
- client-portal or support-ticket systems for existing customers
- website contact forms whose page or terms say "no solicitations" or "vendors do not use this form." Submitting through a form whose terms prohibit it may also breach the site's terms of use.
- social DMs to personal accounts of employees

**Where no suitable published general or business address exists, skip the firm.** Log the reason in the batch record.

---

## 9. Pre-send checklist (one page; complete for every batch and file with the batch record)

**Batch ID:** ______  **Date:** ______  **Approver:** Mansoor Arif  **Recipients:** ____ (≤ daily cap)

**Identity and infrastructure**

- [ ] Sent from the business domain or outreach subdomain (not @gmail.com). SPF, DKIM and DMARC pass on a test send (check "Show original" in Gmail).
- [ ] From name = "Mansoor Arif, Manny's Tech Furnish". Reply-To is a monitored mailbox.
- [ ] RFC 8058 one-click `List-Unsubscribe` + `List-Unsubscribe-Post` headers present, and the endpoint tested.

**Recipients**

- [ ] Every address was published by the firm itself for general or business contact. Source URL and date are recorded.
- [ ] No purchased, scraped, enriched or pattern-guessed addresses.
- [ ] No careers, permit, RFP, emergency, accessibility, legal or privacy channels, and no "no solicitation" forms.
- [ ] Every address and domain checked against the suppression list today.
- [ ] No recipient has already had 3 touches, and nobody who replied, bounced or opted out is included.

**Content**

- [ ] The subject line accurately describes the email. No "Re:"/"Fwd:", no false familiarity, no false urgency.
- [ ] The body identifies the message as a business solicitation.
- [ ] A valid physical postal address (street, USPS P.O. box or CMRA private mailbox) is in the footer.
- [ ] A clear opt-out sentence is included ("Reply 'no thanks' or use the unsubscribe link; I won't email again").
- [ ] No ranking, traffic, lead or revenue guarantees.
- [ ] No "engineer" titles, no engineering services, no PE references.
- [ ] Any client name, logo, quote or metric used is backed by written permission on file, and results claims carry context.
- [ ] No tracking pixel or link tracking, unless a review is documented.
- [ ] Links point only to mannystechfurnish.com. No link shorteners.

**After send**

- [ ] Opt-outs are suppressed the same day (≤ 48 h; legal maximum 10 business days).
- [ ] Bounces and complaints are suppressed automatically, and the spam rate is checked in Postmaster Tools (< 0.1%).
- [ ] Batch manifest, rendered email, send log and approval are archived for 4 years.

---

## 10. Open items for Mansoor or counsel

| # | Item | Who |
|---|---|---|
| 1 | **Choose and record a physical postal address** for commercial email: street, USPS P.O. box or CMRA private mailbox. Required before any outreach. | Mansoor |
| 2 | Set up a business-domain mailbox and an outreach sending domain/subdomain in Resend with SPF, DKIM and DMARC. Replace the Gmail address in the site footer. | Mansoor (DNS/credentials) + Dev |
| 3 | Approve a privacy policy page (`/privacy`) based on section 4.3, with a footer link and an effective date. | Dev drafts, Mansoor approves; counsel review optional |
| 4 | Collect written permission from Oaktown Engineers and the geotechnical-firm client to use their names, links, screenshots and descriptions. Collect separate permission for any quotes or metrics. | Mansoor |
| 5 | Remove the `rating` default of 5 from the testimonials schema, or the rating field entirely, through a generated migration. | Dev |
| 6 | Confirm that annual revenue is under $26,625,000 and that no personal data is sold or shared (CCPA inapplicability). | Mansoor |
| 7 | Counsel to confirm: the exact ad-identification wording; CAN-SPAM preemption of BPC 17529.4 and the limits of 17529.5 claims; whether manually copying a published address could be treated as "collecting" under 17529.4(a); record-retention period; and whether any outreach target state other than California (for example, other states' anti-spam laws) needs review. | Counsel |
| 8 | Decide the retention periods in section 4.5 and implement a purge job or a documented manual purge. | Mansoor + Dev |
| 9 | Re-run this review if any of these are added: ad pixels, GA4, email open tracking, SMS outreach (TCPA, a separate and stricter regime), LinkedIn automation, or targeting outside the US. | Dev |

---

## Sources

All sources were accessed on 2026-10-27.

| URL | Publisher | Date | Key evidence | Implication |
|---|---|---|---|---|
| https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business | FTC | Undated guide; penalty reflects 2025 level | 7 requirements; "no exception for business-to-business email"; penalties "up to $53,088"; postal address may be a USPS P.O. box or CMRA private mailbox; opt-out honored within 10 business days; "can't contract away your legal responsibility" | Every outreach email needs an ad identifier, a postal address and an opt-out. B2B is covered. |
| https://public-inspection.federalregister.gov/2026-18853.pdf | FTC / Federal Register | Publication 2026-09-15 | FTC civil penalty amounts "will remain unchanged during 2026"; 2025 levels continue (OMB M-26-11) | $53,088 per violation is the current figure. |
| https://www.law.cornell.edu/uscode/text/15/7704 | Cornell LII (US Code) | Current | (a)(3) 30-day functioning opt-out; (a)(4) 10 business days, no transfer of addresses; (a)(5) ad identifier, opt-out notice, postal address; (b)(1) harvesting and dictionary attacks are aggravated | Basis for no-guessing and no-scraping controls |
| https://www.shouselaw.com/ca/defense/business-professions-code/17529-5/ | Shouse California Law Group (quoting statute) | Current | 17529.5(a)(1)–(3) prohibitions; recipient private right of action; $1,000 per email up to $1,000,000 per incident; reduced to $100 / $100,000 with due-care procedures | Documented procedures reduce exposure. Official leginfo returned HTTP 403, so counsel should verify the text on leginfo. |
| https://california.public.law/codes/ca_bus_and_prof_code_section_17529.4 | California Public Law (statute text) | Current | Bans collecting posted addresses, automated address generation and scripted account creation for unsolicited commercial email | No scraping, no guessing, no throwaway accounts |
| https://scocal.stanford.edu/opinion/kleffman-v-vonage-33863 | Stanford Law SCOCAL (Cal. Supreme Court opinion) | 2010-06-21 | Multiple accurately registered domains are not "misrepresented header information" under 17529.5(a)(2) | 17529.5 liability turns on actual deception in headers and subjects |
| https://support.google.com/mail/answer/81126 | Google (Gmail Help) | Current | All senders: SPF or DKIM, PTR, TLS, spam rate < 0.3%. Bulk (5,000+/day): SPF + DKIM + DMARC with alignment, one-click unsubscribe | Configure authentication and add one-click unsubscribe anyway |
| https://support.google.com/mail/answer/14229414 | Google (Gmail Help FAQ) | Current | Spam rate target < 0.1%; honor unsubscribe within 48 hours; bulk status is permanent; stronger enforcement from November 2025 | Opt-out target of ≤ 48 h; stay low-volume |
| https://senders.yahooinc.com/best-practices/ | Yahoo | Current | Bulk senders: SPF + DKIM, DMARC p=none minimum, RFC 8058 one-click unsubscribe, honor within 2 days, spam rate < 0.3% | Matches the Gmail controls |
| https://california.public.law/codes/ca_bus_and_prof_code_section_22575 | California Public Law (statute text) | Current | CalOPPA required contents (PII categories, third parties, review process, change notice, effective date, DNT, third-party tracking); 30-day cure | Build /privacy with these elements |
| https://california.public.law/codes/ca_bus_and_prof_code_section_22577 | California Public Law (statute text) | Current | "Consumer" means personal, family or household purposes; definitions of operator and PII | CalOPPA arguably narrower for B2B; post a policy anyway |
| https://www.cppa.ca.gov/regulations/cpi_adjustment.html | California Privacy Protection Agency | Effective 2025-01-01 | Revenue threshold $26,625,000 (from $25M); adjusted every odd year | CCPA very likely not applicable to Manny's Tech Furnish |
| https://oag.ca.gov/privacy/ccpa | California Attorney General | Current | Thresholds: revenue, 100,000 consumers or households, 50% revenue from selling; B2B and employee exemptions expired 2022-12-31 | Confirm inapplicability; B2B data would be covered above the thresholds |
| https://vercel.com/docs/analytics/privacy-policy | Vercel | Updated 2026-06-26 | No third-party cookies; request-hash identification; session discarded after 24 h; anonymous data points; list of collected fields; `beforeSend` redaction | No consent banner needed for the current setup; disclose in the privacy notice |
| https://www.cloudflare.com/turnstile-privacy-policy/ | Cloudflare | Effective 2025-06-18 | Processes IP, TLS fingerprint, User-Agent, site key; "strictly necessary" for bot detection; processor and controller roles | Disclose Turnstile in the privacy notice |
| https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements | FTC | 2023-06-29 | Endorsement Guides revised; covers review manipulation, incentivized and employee reviews, "clear and conspicuous," advertiser and intermediary liability | Applies to testimonials and case studies on the site |
| https://www.law.cornell.edu/cfr/text/16/255.2 | Cornell LII (CFR) | Current | 255.2(b): consumer endorsements imply typical results; need substantiation or a disclosure of generally expected results | Results claims need evidence and context |
| https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking | FTC | Current | Honest opinions; disclose material connections clearly and near the endorsement | Disclose discounts, relationships and other material connections |
| https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers | FTC | Rule effective 2024-10-21 | 16 CFR 465 bans fake or false testimonials, conditioned incentives, insider reviews, review suppression and fake indicators; civil penalties for knowing violations | No invented testimonials or default ratings; written client permission |
| https://developers.google.com/search/docs/fundamentals/do-i-need-seo | Google Search Central | Updated 2026-06-05 | "No one can guarantee a #1 ranking on Google"; "Be wary of SEO firms and web consultants or agencies that email you out of the blue" | No ranking guarantees; cold email must be specific and honest |
| https://support.google.com/business/answer/7091 | Google Business Profile Help | Current | Local ranking depends on relevance, distance and prominence; "no way to request or pay for a better local ranking" | No local-pack guarantees |
| https://california.public.law/codes/ca_bus_and_prof_code_section_6730 | California Public Law (statute text) | Current | License required to practice or **offer to practice** civil, electrical or mechanical engineering | Never offer engineering services |
| https://california.public.law/codes/ca_bus_and_prof_code_section_6732 | California Public Law (statute text) | Current | Restricted engineer titles | Never use protected titles |
| https://california.public.law/codes/ca_bus_and_prof_code_section_6787 | California Public Law (statute text) | Current | Unlicensed title use and practice are misdemeanors (subsections g, i, j) | Criminal exposure; strict wording rules |
| https://www.bpelsg.ca.gov/pubs/local_officials_guide.pdf | California BPELSG | Current edition | "The word 'engineer' by itself is considered generic and is not regulated"; list of restricted titles | "Software engineer" probably lawful but avoid it in AEC outreach |
