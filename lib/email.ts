import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM = process.env.CONTACT_FROM_EMAIL || 'Manny\'s Tech Furnish <noreply@notify.mannystechfurnish.com>'
const TO = process.env.CONTACT_TO_EMAIL || 'mansoor.buspro@gmail.com'

const PINK = '#FF2D78'

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

function shell(inner: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid #1f1f1f;">
          <span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:-0.02em;">MANNY'S <span style="color:${PINK};">TECH FURNISH</span></span>
        </td></tr>
        ${inner}
        <tr><td style="padding:20px 32px;border-top:1px solid #1f1f1f;">
          <p style="color:#666666;font-size:12px;margin:0;">Manny&#39;s Tech Furnish &mdash; Professional websites that convert.</p>
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
      <td style="padding:14px 32px;border-bottom:1px solid #161616;">
        <p style="color:${PINK};font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">${label}</p>
        <p style="color:#ffffff;font-size:15px;margin:0;line-height:1.5;white-space:pre-wrap;">${value}</p>
      </td>
    </tr>`

  const inner = `
    <tr><td style="padding:28px 32px 8px;">
      <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 4px;">New project inquiry</h1>
      <p style="color:#999999;font-size:14px;margin:0;">Someone just reached out through your website.</p>
    </td></tr>
    ${row('Name', escapeHtml(p.name))}
    ${row('Email', `<a href="mailto:${escapeHtml(p.email)}" style="color:${PINK};text-decoration:none;">${escapeHtml(p.email)}</a>`)}
    ${p.phone ? row('Phone', escapeHtml(p.phone)) : ''}
    ${row('What they need', escapeHtml(p.subject))}
    ${row('Message', escapeHtml(p.message))}
    <tr><td style="padding:24px 32px;">
      <a href="mailto:${escapeHtml(p.email)}" style="display:inline-block;background:${PINK};color:#000000;font-weight:700;font-size:14px;text-decoration:none;padding:12px 24px;border-radius:999px;">Reply to ${escapeHtml(p.name)}</a>
    </td></tr>`

  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: p.email,
    subject: `New inquiry: ${p.subject} — ${p.name}`,
    html: shell(inner),
  })
}

/** Auto-reply confirmation sent to the person who submitted the form. */
export async function sendClientConfirmation(p: ContactPayload) {
  if (!resend) throw new Error('RESEND_API_KEY is not configured')

  const inner = `
    <tr><td style="padding:28px 32px;">
      <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 12px;">Thanks, ${escapeHtml(p.name)}!</h1>
      <p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 16px;">
        I&#39;ve received your message and I&#39;ll get back to you within <strong style="color:#ffffff;">24&ndash;48 hours</strong>.
      </p>
      <p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Here&#39;s a copy of what you sent:
      </p>
      <table role="presentation" width="100%" style="background:#000000;border:1px solid #1f1f1f;border-radius:12px;">
        <tr><td style="padding:16px 20px;">
          <p style="color:${PINK};font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">What you need</p>
          <p style="color:#ffffff;font-size:14px;margin:0 0 12px;">${escapeHtml(p.subject)}</p>
          <p style="color:${PINK};font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px;">Message</p>
          <p style="color:#dddddd;font-size:14px;margin:0;line-height:1.6;white-space:pre-wrap;">${escapeHtml(p.message)}</p>
        </td></tr>
      </table>
      <p style="color:#999999;font-size:14px;line-height:1.6;margin:20px 0 0;">
        In the meantime, feel free to reply to this email or reach me directly at
        <a href="mailto:mansoor.buspro@gmail.com" style="color:${PINK};text-decoration:none;">mansoor.buspro@gmail.com</a>.
      </p>
      <p style="color:#ffffff;font-size:14px;margin:20px 0 0;">&mdash; Mansoor</p>
    </td></tr>`

  return resend.emails.send({
    from: FROM,
    to: p.email,
    subject: 'Thanks for reaching out — Manny\'s Tech Furnish',
    html: shell(inner),
  })
}
