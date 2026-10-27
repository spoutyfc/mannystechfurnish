import { track } from '@vercel/analytics'

/**
 * Conversion events. Vercel Web Analytics is cookieless and stores no personal
 * data; event names are fixed here so reports stay consistent. Properties must
 * never contain form contents, names, emails or phone numbers.
 */
export type SiteEvent =
  | 'cta_click'
  | 'phone_click'
  | 'email_click'
  | 'form_start'
  | 'form_submit_success'
  | 'form_submit_error'

export function trackEvent(name: SiteEvent, props?: Record<string, string>) {
  try {
    track(name, props)
  } catch {
    // Analytics must never break a page or a form.
  }
}
