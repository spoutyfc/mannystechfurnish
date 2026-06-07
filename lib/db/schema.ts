import { pgTable, text, timestamp, boolean, integer, varchar } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables for Manny's Tech Furnish -----------------------------------

export const portfolioProjects = pgTable('portfolio_projects', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('imageUrl'),
  projectUrl: text('projectUrl'),
  technologies: text('technologies'), // JSON stringified array
  displayOrder: integer('displayOrder').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const services = pgTable('services', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon: text('icon'),
  displayOrder: integer('displayOrder').default(0),
  stripeProductId: text('stripeProductId'),
  stripePriceId: text('stripePriceId'),
  pricingType: varchar('pricingType', { length: 50 }).default('one-time'), // 'one-time', 'recurring', 'both'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const testimonials = pgTable('testimonials', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  authorName: text('authorName').notNull(),
  authorTitle: text('authorTitle'),
  authorImage: text('authorImage'),
  content: text('content').notNull(),
  rating: integer('rating').default(5),
  displayOrder: integer('displayOrder').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const contactInquiries = pgTable('contact_inquiries', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('new'), // 'new', 'read', 'resolved'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  stripeCheckoutSessionId: text('stripeCheckoutSessionId'),
  stripePaymentIntentId: text('stripePaymentIntentId'),
  serviceIds: text('serviceIds'), // JSON stringified array
  clientName: text('clientName').notNull(),
  clientEmail: text('clientEmail').notNull(),
  totalAmount: integer('totalAmount').notNull(), // in cents
  currency: varchar('currency', { length: 10 }).default('usd'),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'completed', 'failed', 'refunded'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  stripeSubscriptionId: text('stripeSubscriptionId').unique(),
  stripePriceId: text('stripePriceId'),
  clientName: text('clientName').notNull(),
  clientEmail: text('clientEmail').notNull(),
  status: varchar('status', { length: 50 }).default('active'), // 'active', 'paused', 'canceled'
  currentPeriodStart: timestamp('currentPeriodStart'),
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  stripePublishableKey: text('stripePublishableKey'),
  siteName: text('siteName').default('Manny\'s Tech Furnish'),
  heroTitle: text('heroTitle'),
  heroDescription: text('heroDescription'),
  aboutText: text('aboutText'),
  contactEmail: text('contactEmail'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Client Payment Links ---
export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  companyName: varchar('company_name', { length: 255 }),
  website: varchar('website', { length: 255 }),
  projectDescription: text('project_description'),
  timeline: varchar('timeline', { length: 100 }),
  planType: varchar('plan_type', { length: 50 }).notNull(), // 'option1' or 'option2'
  includeCareplan: boolean('include_care_plan').default(false),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeCheckoutSessionId: varchar('stripe_checkout_session_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'), // 'pending', 'completed', 'failed'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
