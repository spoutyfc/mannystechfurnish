import { describe, expect, it } from 'vitest'
import { composeInquiryMessage } from '@/lib/inquiry'
import { contactSchema } from '@/lib/validation'

describe('composeInquiryMessage', () => {
  it('returns the message unchanged when no fit-call details are present', () => {
    expect(composeInquiryMessage({ message: 'Hello' })).toBe('Hello')
  })

  it('prefixes firm, discipline and website in a fixed order', () => {
    expect(
      composeInquiryMessage({
        message: 'Our site is from 2016.',
        firm: 'Acme Structural',
        discipline: 'Structural engineering',
        website: 'https://acme.example',
      }),
    ).toBe('Firm: Acme Structural\nDiscipline: Structural engineering\nWebsite: https://acme.example\n\nOur site is from 2016.')
  })

  it('omits details that were left blank', () => {
    expect(composeInquiryMessage({ message: 'Hi', firm: 'Acme' })).toBe('Firm: Acme\n\nHi')
  })
})

describe('contactSchema fit-call fields', () => {
  const base = { name: 'Ada', email: 'ada@example.com', subject: 'Fit call request — Acme', message: 'Hello' }

  it('accepts a request without the optional fields (older form)', () => {
    expect(contactSchema.safeParse(base).success).toBe(true)
  })

  it('turns blank optional fields into undefined', () => {
    const r = contactSchema.parse({ ...base, firm: '   ', website: '' })
    expect(r.firm).toBeUndefined()
    expect(r.website).toBeUndefined()
  })

  it('rejects a discipline that is not one of the listed options', () => {
    expect(contactSchema.safeParse({ ...base, discipline: 'Rocket science' }).success).toBe(false)
  })

  it('adds https:// to a bare domain and rejects non-web schemes', () => {
    expect(contactSchema.parse({ ...base, website: 'acme.com' }).website).toBe('https://acme.com/')
    expect(contactSchema.parse({ ...base, website: 'http://acme.com/x' }).website).toBe('http://acme.com/x')
    expect(contactSchema.safeParse({ ...base, website: 'javascript:alert(1)' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...base, website: 'not a site' }).success).toBe(false)
  })

  it('keeps the name and subject on one line so they are safe in email headers', () => {
    const r = contactSchema.parse({ ...base, name: 'Ada\r\nBcc: x@evil.test', subject: 'Hi\nthere' })
    expect(r.name).toBe('Ada Bcc: x@evil.test')
    expect(r.subject).toBe('Hi there')
  })

  it('rejects an over-long firm name and website', () => {
    expect(contactSchema.safeParse({ ...base, firm: 'x'.repeat(201) }).success).toBe(false)
    expect(contactSchema.safeParse({ ...base, website: 'x'.repeat(501) }).success).toBe(false)
  })
})
