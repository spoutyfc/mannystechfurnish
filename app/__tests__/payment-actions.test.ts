import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const limit = vi.fn()
  const where = vi.fn(() => ({ limit, orderBy: vi.fn() }))
  const db = {
    select: vi.fn(() => ({ from: vi.fn(() => ({ where, orderBy: vi.fn() })) })),
    insert: vi.fn(),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
    delete: vi.fn(() => ({ where: vi.fn() })),
  }
  return {
    db,
    limit,
    getAdminEmail: vi.fn(),
    createSession: vi.fn(),
  }
})

vi.mock('@/lib/db', () => ({ db: mocks.db }))
vi.mock('@/lib/admin-auth', () => ({ getAdminEmail: mocks.getAdminEmail }))
vi.mock('@/lib/stripe', () => ({
  getStripe: () => ({ checkout: { sessions: { create: mocks.createSession } } }),
}))

import {
  createClient,
  createClientCheckoutSession,
  deleteClient,
  getAllClients,
  updateClientPaymentStatus,
} from '@/app/actions/payment'
import { STRIPE_PRICES } from '@/lib/plans'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('admin-only payment actions', () => {
  it.each([
    ['createClient', () => createClient({ name: 'A', email: 'a@b.co', planType: 'option1' })],
    ['getAllClients', () => getAllClients()],
    ['deleteClient', () => deleteClient(1)],
    ['updateClientPaymentStatus', () => updateClientPaymentStatus(1, 'completed')],
  ])('%s rejects an unauthenticated caller before touching the database', async (_name, call) => {
    mocks.getAdminEmail.mockResolvedValue(null)
    await expect(call()).rejects.toThrow('Unauthorized')
    expect(mocks.db.insert).not.toHaveBeenCalled()
    expect(mocks.db.delete).not.toHaveBeenCalled()
    expect(mocks.db.update).not.toHaveBeenCalled()
    expect(mocks.db.select).not.toHaveBeenCalled()
  })

  it('createClient rejects an unknown plan type even for an admin', async () => {
    mocks.getAdminEmail.mockResolvedValue('owner@example.com')
    await expect(
      // @ts-expect-error deliberately invalid plan from a tampered request
      createClient({ name: 'A', email: 'a@b.co', planType: 'free' }),
    ).rejects.toThrow()
    expect(mocks.db.insert).not.toHaveBeenCalled()
  })

  it('updateClientPaymentStatus rejects an arbitrary status string', async () => {
    mocks.getAdminEmail.mockResolvedValue('owner@example.com')
    await expect(
      // @ts-expect-error deliberately invalid status
      updateClientPaymentStatus(1, 'refunded'),
    ).rejects.toThrow()
    expect(mocks.db.update).not.toHaveBeenCalled()
  })
})

describe('createClientCheckoutSession (public)', () => {
  const storedClient = {
    id: 7,
    slug: 'oak-bakery-1a2b3c4d',
    email: 'owner@oak.test',
    planType: 'option1',
    paymentStatus: 'pending',
  }

  it('rejects a malformed slug without querying the database', async () => {
    await expect(createClientCheckoutSession("x' OR 1=1 --", false)).rejects.toThrow()
    expect(mocks.db.select).not.toHaveBeenCalled()
  })

  it('refuses to create a second checkout for an already-paid client', async () => {
    mocks.limit.mockResolvedValue([{ ...storedClient, paymentStatus: 'completed' }])
    await expect(createClientCheckoutSession(storedClient.slug, false)).rejects.toThrow(/already paid/)
    expect(mocks.createSession).not.toHaveBeenCalled()
  })

  it('charges only the server-stored plan prices', async () => {
    mocks.limit.mockResolvedValue([storedClient])
    mocks.createSession.mockResolvedValue({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1' })

    const result = await createClientCheckoutSession(storedClient.slug, true)

    expect(result.url).toContain('checkout.stripe.com')
    const params = mocks.createSession.mock.calls[0][0]
    expect(params.mode).toBe('subscription')
    expect(params.line_items).toEqual([
      { price: STRIPE_PRICES.option1, quantity: 1 },
      { price: STRIPE_PRICES.careplan, quantity: 1 },
    ])
    expect(params.metadata.clientId).toBe('7')
  })
})
