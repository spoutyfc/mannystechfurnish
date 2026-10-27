import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.CONTACT_FROM_EMAIL || 'Manny\'s Tech Furnish <noreply@notify.mannystechfurnish.com>'
const TO = process.env.CONTACT_TO_EMAIL || 'mansoor.dvc@gmail.com'

const PINK = '#FF2D78'
// A bold, high-impact font stack. Email clients ignore @font-face widely, so we
// lead with premium system display faces that render crisp everywhere.
const DISPLAY_FONT = `'Helvetica Neue', 'Arial Black', Helvetica, Arial, sans-serif`
const BODY_FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`

type ContactPayload = {
  name: string
  email: string
  subject: string
  message: string
  phone?: string | null
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function shell(inner: string, preheader = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="dark" /></head>
<body style="margin:0;padding:0;background:#050505;font-family:${BODY_FONT};">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0b0b0b;border:1px solid #1c1c1c;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:30px 36px;background:#000000;border-bottom:2px solid ${PINK};">
          <span style="color:#ffffff;font-family:${DISPLAY_FONT};font-size:22px;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;">MANNY&#39;S <span style="color:${PINK};">TECH FURNISH</span></span>
        </td></tr>
        ${inner}
        <tr><td style="padding:24px 36px;border-top:1px solid #1c1c1c;background:#000000;">
          <p style="color:#777777;font-size:12px;margin:0 0 6px;line-height:1.5;">Manny&#39;s Tech Furnish &mdash; Websites and local search for engineering and construction firms.</p>
          <p style="color:#555555;font-size:12px;margin:0;">(925) 278-9059 &nbsp;&bull;&nbsp; mansoor.buspro@gmail.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/** Notification email sent to the business owner. */
export async function sendOwnerNotification(p: ContactPayload) {
  if (!resend) throw new Error('RESEND_API_KEY is not configured')

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:18px 36px;border-bottom:1px solid #161616;">
        <p style="color:${PINK};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;margin:0 0 6px;">${label}</p>
        <p style="color:#ffffff;font-size:16px;margin:0;line-height:1.55;white-space:pre-wrap;font-weight:500;">${value}</p>
      </td>
    </tr>`

  const inner = `
    <tr><td style="padding:34px 36px 10px;">
      <p style="color:${PINK};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 10px;">New Lead</p>
      <h1 style="color:#ffffff;font-family:${DISPLAY_FONT};font-size:30px;font-weight:900;line-height:1.05;margin:0 0 8px;text-transform:uppercase;letter-spacing:-0.01em;">Project Inquiry</h1>
      <p style="color:#9a9a9a;font-size:15px;margin:0;line-height:1.5;">Someone just reached out through your website.</p>
    </td></tr>
    ${row('Name', escapeHtml(p.name))}
    ${row('Email', `<a href="mailto:${escapeHtml(p.email)}" style="color:${PINK};text-decoration:none;font-weight:600;">${escapeHtml(p.email)}</a>`)}
    ${p.phone ? row('Phone', escapeHtml(p.phone)) : ''}
    ${row('What they need', escapeHtml(p.subject))}
    ${row('Message', escapeHtml(p.message))}
    <tr><td style="padding:28px 36px;">
      <a href="mailto:${escapeHtml(p.email)}" style="display:inline-block;background:${PINK};color:#000000;font-weight:800;font-size:14px;text-transform:uppercase;letter-spacing:0.04em;text-decoration:none;padding:14px 28px;border-radius:999px;">Reply to ${escapeHtml(p.name)}</a>
    </td></tr>`

  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: p.email,
    subject: `New inquiry: ${p.subject} — ${p.name}`,
    html: shell(inner, `New inquiry from ${p.name}: ${p.subject}`),
  })
}

/** Auto-reply confirmation sent to the person who submitted the form. */
export async function sendClientConfirmation(p: ContactPayload) {
  if (!resend) throw new Error('RESEND_API_KEY is not configured')

  const inner = `
    <tr><td style="padding:34px 36px;">
      <p style="color:${PINK};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 10px;">Message Received</p>
      <h1 style="color:#ffffff;font-family:${DISPLAY_FONT};font-size:30px;font-weight:900;line-height:1.05;margin:0 0 16px;text-transform:uppercase;letter-spacing:-0.01em;">Thanks, ${escapeHtml(p.name)}!</h1>
      <p style="color:#cfcfcf;font-size:16px;line-height:1.65;margin:0 0 16px;">
        I&#39;ve received your request and I&#39;ll reply within <strong style="color:#ffffff;">two business days</strong> to set a time.
      </p>
      <p style="color:#9a9a9a;font-size:14px;line-height:1.6;margin:0 0 20px;">
        If you didn&#39;t send this request, you can ignore this email.
      </p>
      <p style="color:#9a9a9a;font-size:14px;line-height:1.6;margin:22px 0 0;">
        In the meantime, feel free to reply to this email or reach me directly at
        <a href="mailto:mansoor.buspro@gmail.com" style="color:${PINK};text-decoration:none;font-weight:600;">mansoor.buspro@gmail.com</a>.
      </p>
      <p style="color:#ffffff;font-size:15px;margin:22px 0 0;font-weight:700;">&mdash; Mansoor</p>
    </td></tr>`

  return resend.emails.send({
    from: FROM,
    to: p.email,
    subject: 'Thanks for reaching out — Manny\'s Tech Furnish',
    // The visitor's message is deliberately not echoed back: an auto-reply that
    // repeats arbitrary text to any address can be abused to send spam.
    html: shell(inner, `Thanks ${p.name} — I'll reply within two business days.`),
  })
}

/**
 * Custom email composed by the admin and sent to a client. Plain-text body is
 * wrapped in the branded shell with strong hierarchy. Returns the Resend result.
 */
export async function sendCustomEmail(opts: {
  to: string
  subject: string
  heading?: string
  body: string
}) {
  if (!resend) throw new Error('RESEND_API_KEY is not configured')

  // Preserve paragraph breaks from the textarea.
  const paragraphs = opts.body
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="color:#dcdcdc;font-size:16px;line-height:1.7;margin:0 0 18px;">${escapeHtml(
          para,
        ).replace(/\n/g, '<br />')}</p>`,
    )
    .join('')

  const inner = `
    <tr><td style="padding:34px 36px;">
      ${
        opts.heading
          ? `<h1 style="color:#ffffff;font-family:${DISPLAY_FONT};font-size:28px;font-weight:900;line-height:1.1;margin:0 0 20px;text-transform:uppercase;letter-spacing:-0.01em;">${escapeHtml(
              opts.heading,
            )}</h1>`
          : ''
      }
      ${paragraphs}
      <p style="color:#ffffff;font-size:15px;margin:24px 0 0;font-weight:700;">&mdash; Mansoor, Manny&#39;s Tech Furnish</p>
    </td></tr>`

  return resend.emails.send({
    from: FROM,
    to: opts.to,
    replyTo: TO,
    subject: opts.subject,
    html: shell(inner, opts.subject),
  })
}
