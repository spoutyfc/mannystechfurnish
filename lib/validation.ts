import { z } from 'zod'

/**
 * Server-side input schemas. Client-side checks in the forms are a convenience;
 * these are the controls. Every public route and server action parses its
 * input through one of these before touching the database, Stripe or Resend.
 */

/** Empty strings from HTML forms become `undefined` so optional columns stay NULL. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined))

const email = z.string().trim().toLowerCase().email().max(254)

export const planTypeSchema = z.enum(['option1', 'option2'])

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email,
  phone: optionalText(40),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  /** Honeypot field. Real users never see or fill it. */
  company: z.string().optional(),
  turnstileToken: z.string().max(4096).optional().nullable(),
})
export type ContactInput = z.infer<typeof contactSchema>

export const createClientSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email,
  phone: optionalText(40),
  companyName: optionalText(200),
  website: optionalText(500),
  projectDescription: optionalText(5000),
  timeline: optionalText(200),
  planType: planTypeSchema,
  includeCareplan: z.boolean().optional().default(false),
})
export type CreateClientInput = z.input<typeof createClientSchema>

/** Slugs are generated server-side as lowercase words + a random suffix. */
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

export const checkoutRequestSchema = z.object({
  slug: slugSchema,
  includeCareplan: z.boolean(),
})

export const submissionStatusSchema = z.enum(['new', 'read', 'resolved'])

export const clientIdSchema = z.number().int().positive()

export const paymentStatusSchema = z.enum(['pending', 'completed', 'failed'])

export const adminSetupSchema = z.object({
  email,
  password: z.string().min(12).max(200),
})

/**
 * New admin passwords. bcrypt only reads the first 72 bytes, and the upper bound
 * keeps an attacker from making the server hash megabyte-sized strings.
 */
export const newPasswordSchema = z.string().min(12).max(200)

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(200),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: newPasswordSchema,
})
