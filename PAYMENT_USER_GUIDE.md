# Complete Payment System - User Guide

## Overview

Your payment system is fully built and ready to deploy. It supports two pricing options with unique client payment links, intake forms, and real-time payment tracking.

## Quick Start

### 1. Set Environment Variables

In Vercel project settings, add:

```bash
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_key
DATABASE_URL=postgresql://your_db_url
NEXT_PUBLIC_APP_URL=https://your-domain.com
BETTER_AUTH_SECRET=your_secret_key
```

### 2. Generate Client Links (Admin Dashboard)

Navigate to: **https://your-domain.com/admin/clients**

- Fill in client name, email, phone
- Enter company name and website
- Add project description and timeline
- Select plan: Option 1 or Option 2
- Click "Generate Payment Link"
- Copy the URL and share with client

### 3. Client Completes Payment

Client receives: **https://your-domain.com/pay/{unique-slug}**

- Fills in project intake form
- Selects payment plan
- Option 1: Can add optional $70/mo care plan
- Clicks "Proceed to Checkout"
- Completes Stripe payment
- Sees success confirmation

### 4. Payment Processed

- Webhook confirms payment
- Database updated with status "completed"
- Stripe subscription created (if Option 2)
- Client redirected to success page

## Pricing Plans

### Option 1: Complete Digital Asset
- **One-time cost**: $1,299
- **What's included**:
  - Custom full-stack website
  - Complete codebase ownership
  - Advanced SEO & Analytics
  - Fully responsive design
- **Optional add-on**: $70/month care plan for updates & security

### Option 2: Managed Website Plan
- **Initial cost**: $700 (build fee)
- **Monthly cost**: $120/month (minimum 3 months)
- **What's included**:
  - Website build & hosting
  - Ongoing maintenance
  - Security & updates
  - Monthly check-ins

## Routes

| Route | Purpose |
|-------|---------|
| `/admin/clients` | Generate client payment links |
| `/pay/[slug]` | Client checkout page (unique per client) |
| `/checkout/success` | Payment confirmation page |
| `/api/webhooks/stripe` | Stripe webhook endpoint |

## Database Schema

### clients table

| Column | Type | Purpose |
|--------|------|---------|
| id | UUID | Unique identifier |
| slug | VARCHAR(100) | URL-friendly unique identifier |
| name | VARCHAR(255) | Client name |
| email | VARCHAR(255) | Client email |
| phone | VARCHAR(50) | Client phone |
| companyName | VARCHAR(255) | Company name |
| website | VARCHAR(255) | Current website |
| projectDescription | TEXT | Project details |
| timeline | VARCHAR(100) | Project timeline |
| planType | VARCHAR(50) | 'option1' or 'option2' |
| includeCareplan | BOOLEAN | Care plan selected (Option 1 only) |
| stripeCustomerId | VARCHAR(255) | Stripe customer ID |
| stripeCheckoutSessionId | VARCHAR(255) | Session ID |
| stripeSubscriptionId | VARCHAR(255) | Subscription ID (Option 2) |
| paymentStatus | VARCHAR(50) | 'pending', 'completed', 'failed' |
| createdAt | TIMESTAMP | Creation timestamp |
| updatedAt | TIMESTAMP | Update timestamp |

## Features Implemented

✅ **Unique Client Links**
- Each client gets a unique URL with their slug
- Can be shared via email, text, or social media

✅ **Complete Intake Form**
- Name, email, phone
- Company & website information
- Project description
- Timeline expectations

✅ **Plan Selection**
- Option 1: One-time digital asset
- Option 2: Managed website lease plan
- Clear feature comparison

✅ **Optional Add-ons**
- Care plan checkbox on Option 1
- Automatically added to checkout

✅ **Stripe Integration**
- Secure payment processing
- Webhook handling for confirmations
- Subscription support for Option 2

✅ **Admin Dashboard**
- Easy link generation
- Copy-to-clipboard functionality
- Client data storage

✅ **Success Page**
- Confirmation message
- Session tracking
- Back to home link

## Stripe Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Create new endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Testing Payment Flow

### Test Mode
Use Stripe test credentials (starts with `pk_test_` and `sk_test_`)

### Test Card Numbers
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiration date
- Any CVC

### Test Workflow
1. Go to `/admin/clients`
2. Fill in test client info
3. Generate payment link
4. Open link in incognito window
5. Fill checkout form
6. Use test card 4242 4242 4242 4242
7. Verify database updated in Neon
8. Check Stripe Dashboard for successful payment

## Deployment

### To Vercel
1. Connect GitHub repo to Vercel
2. Add environment variables in Project Settings
3. Deploy (auto-deploys on git push)

### Webhook Configuration
After deployment, register webhook endpoint with Stripe:
- `https://your-domain.com/api/webhooks/stripe`

## Troubleshooting

### Issue: Payment link not working
- Check database connection string in env vars
- Verify Neon database is accessible
- Check browser console for errors

### Issue: Stripe checkout not loading
- Verify `STRIPE_PUBLISHABLE_KEY` is set
- Check Stripe public key is correct
- Ensure HTTPS in production

### Issue: Webhook not triggering
- Verify webhook secret in env vars
- Check Stripe webhook endpoint is registered
- Review Stripe Dashboard webhook logs

### Issue: Payment status not updating
- Verify `STRIPE_SECRET_KEY` is correct
- Check database `DATABASE_URL` connection
- Review server logs for database errors

## Admin Features Available Now

- ✅ Generate unlimited client payment links
- ✅ View client information in database
- ✅ Track payment status per client
- ✅ Copy payment URLs quickly

## Future Enhancements

Consider adding:
- Email notifications on payment completion
- Admin dashboard to view all clients
- CSV export of payments
- Discount code system
- Recurring billing management
- Invoice generation

## Security

- All payments processed through Stripe (PCI compliant)
- Unique slugs prevent URL guessing
- Webhook signatures verified
- Database scoped to user (even though admin-only for now)
- HTTPS only in production

## Support

For Stripe issues: https://support.stripe.com
For Neon database issues: https://neon.tech/docs
For Next.js issues: https://nextjs.org/docs
