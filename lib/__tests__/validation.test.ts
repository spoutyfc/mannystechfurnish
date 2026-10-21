import { describe, expect, it } from 'vitest'
import {
  adminSetupSchema,
  checkoutRequestSchema,
  contactSchema,
  createClientSchema,
  slugSchema,
  submissionStatusSchema,
} from '@/lib/validation'

const validContact = {
  name: 'Ada Lovelace',
  email: 'Ada@Example.com ',
  subject: 'New website',
  message: 'I need a site for my bakery.',
}

describe('contactSchema', () => {
  it('accepts a valid inquiry and normalises the email', () => {
    const parsed = contactSchema.parse(validContact)
    expect(parsed.email).toBe('ada@example.com')
    expect(parsed.phone).toBeUndefined()
  })

  it('turns an empty phone into undefined so the column stays NULL', () => {
    expect(contactSchema.parse({ ...validContact, phone: '' }).phone).toBeUndefined()
  })

  it.each([
    ['missing name', { ...validContact, name: '' }],
    ['whitespace-only message', { ...validContact, message: '   ' }],
    ['invalid email', { ...validContact, email: 'not-an-email' }],
    ['message over 5000 chars', { ...validContact, message: 'x'.repeat(5001) }],
    ['subject over 200 chars', { ...validContact, subject: 'x'.repeat(201) }],
    ['non-string name', { ...validContact, name: { $ne: '' } }],
  ])('rejects %s', (_label, input) => {
    expect(contactSchema.safeParse(input).success).toBe(false)
  })

  it('accepts the 5000-char boundary', () => {
    expect(contactSchema.safeParse({ ...validContact, message: 'x'.repeat(5000) }).success).toBe(true)
  })
})

describe('createClientSchema', () => {
  const base = { name: 'Oak Bakery', email: 'owner@oak.test', planType: 'option1' }

  it('defaults includeCareplan to false and drops empty optional fields', () => {
    const parsed = createClientSchema.parse({ ...base, phone: '', companyName: '' })
    expect(parsed.includeCareplan).toBe(false)
    expect(parsed.phone).toBeUndefined()
    expect(parsed.companyName).toBeUndefined()
  })

  it('rejects an unknown plan type', () => {
    expect(createClientSchema.safeParse({ ...base, planType: 'free' }).success).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(createClientSchema.safeParse({ ...base, email: 'oak' }).success).toBe(false)
  })
})

describe('slugSchema', () => {
  it.each(['oak-bakery-1a2b3c4d', 'client-abc12'])('accepts %s', (slug) => {
    expect(slugSchema.safeParse(slug).success).toBe(true)
  })

  it.each(['', 'Oak', '../etc', 'a--b', '-lead', 'x'.repeat(101)])('rejects %j', (slug) => {
    expect(slugSchema.safeParse(slug).success).toBe(false)
  })
})

describe('checkoutRequestSchema', () => {
  it('requires a real boolean for includeCareplan', () => {
    expect(checkoutRequestSchema.safeParse({ slug: 'a-1', includeCareplan: 'true' }).success).toBe(false)
    expect(checkoutRequestSchema.safeParse({ slug: 'a-1', includeCareplan: true }).success).toBe(true)
  })
})

describe('submissionStatusSchema', () => {
  it('only allows the three dashboard states', () => {
    expect(submissionStatusSchema.options).toEqual(['new', 'read', 'resolved'])
    expect(submissionStatusSchema.safeParse('deleted').success).toBe(false)
  })
})

describe('adminSetupSchema', () => {
  it('requires a password of at least 12 characters', () => {
    expect(adminSetupSchema.safeParse({ email: 'a@b.co', password: 'short' }).success).toBe(false)
    expect(adminSetupSchema.safeParse({ email: 'a@b.co', password: 'twelve-chars' }).success).toBe(true)
  })
})
