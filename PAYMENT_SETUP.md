# Manny's Tech Furnish - Payment System Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Setup (Already Configured)

### Products Created:
1. **Option 1 - Complete Digital Asset ($1,299 one-time)**
   - Price ID: `price_1TdITWK40rUg2ebUcW26SvsI`

2. **Advanced Care Plan ($70/mo)**
   - Price ID: `price_1TdITeK40rUg2ebUTHW0nMVf`

3. **Option 2 - Build Fee ($700 one-time)**
   - Price ID: `price_1TdITeK40rUg2ebU93d0nMVp`

4. **Option 2 - Monthly Plan ($120/mo)**
   - Price ID: `price_1TdITeK40rUg2ebUNNrJLJHS`

## Database Schema

Three tables created in Neon:
- `clients` - Stores client info and payment status
- `orders` - Legacy table (kept for compatibility)
- Other tables from Better Auth schema

## File Structure

```
app/
  admin/
    clients/page.tsx          # Generate unique client payment links
  checkout/
    success/page.tsx          # Success page after payment
  pay/
    [slug]/page.tsx           # Client checkout page
  api/
    webhooks/
      stripe/route.ts         # Webhook handler
  actions/
    payment.ts                # Server actions for payments
  components/
    checkout-form.tsx         # Checkout form component
lib/
  db.ts                       # Database client
  db/schema.ts                # Database schema
  stripe.ts                   # Stripe client
```

## How It Works

### For Admin (You):
1. Go to `/admin/clients`
2. Fill in client details and select plan
3. Click "Generate Payment Link"
4. Copy the unique URL and share with client

### For Clients:
1. Receive unique URL: `your-domain.com/pay/{client-slug}`
2. Fill in project details
3. Select plan and optional add-ons (care plan for Option 1)
4. Complete Stripe checkout
5. Receive success page and confirmation email

### Payment Flow:
1. Client fills checkout form
2. Creates Stripe checkout session
3. Client completes payment on Stripe
4. Webhook confirms payment
5. Client payment status updated to "completed"
6. Redirect to success page

## Next Steps

1. Set your environment variables in Vercel
2. Add your webhook endpoint to Stripe: `https://your-domain.com/api/webhooks/stripe`
3. Test with a client using a test payment link
4. Customize email confirmations (optional)

## Key Features

- ✅ Unique payment links per client
- ✅ Full intake form during checkout
- ✅ Option 1: One-time payment with optional care plan
- ✅ Option 2: Build fee + recurring monthly subscription
- ✅ Stripe webhook integration
- ✅ Payment status tracking
- ✅ Admin dashboard for link generation
