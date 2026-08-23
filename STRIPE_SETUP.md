# Stripe Billing Integration Setup

This guide walks you through setting up the Stripe billing system for the B2B Sales Agent platform.

## Prerequisites

- Stripe account (create at https://stripe.com)
- Admin access to your Stripe dashboard

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com
2. Navigate to Settings → API Keys
3. Copy both:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 2: Configure Environment Variables

Add these to your `.env.local`:

```env
# Stripe Keys
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Webhook Secret (get after setting up webhook)
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# Admin initialization key (for initializing plans)
ADMIN_INIT_KEY=your_random_admin_key
```

## Step 3: Set Up Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/billing/stripe-webhook`
4. Select events to listen for:
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Secret** (starts with `whsec_`)
6. Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Step 4: Initialize Database Migrations

Run the Stripe schema migration:

```bash
# Local development with Supabase CLI
supabase migration up

# Or manually run the migration file:
# supabase/migrations/0042_stripe_billing.sql
```

## Step 5: Initialize Pricing Plans

Call the admin endpoint to populate default plans:

```bash
curl -X POST http://localhost:3000/api/admin/init-stripe-plans \
  -H "x-admin-key: your_random_admin_key" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "success": true,
  "message": "Initialized 3 pricing plans",
  "plans": [...]
}
```

## Step 6: Configure Stripe Products (Optional)

For production, you can pre-create Stripe products:

1. Go to https://dashboard.stripe.com/products
2. Create product "Sales Agent Starter" with price `R$ 299/month`
3. Create product "Sales Agent Professional" with price `R$ 699/month`
4. Create product "Sales Agent Enterprise" with price `R$ 1,999/month`
5. Update plan IDs in database or code with the Stripe price IDs

## API Endpoints

### Create Checkout Session

**POST** `/api/billing/checkout`

```json
{
  "userId": "uuid",
  "planId": "price_starter",
  "successUrl": "https://yourdomain.com/success",
  "cancelUrl": "https://yourdomain.com/cancel"
}
```

Response:
```json
{
  "session_id": "cs_live_...",
  "url": "https://checkout.stripe.com/..."
}
```

### Get Active Subscription

**GET** `/api/billing/subscription?userId=uuid`

Response:
```json
{
  "success": true,
  "subscription": {
    "id": 123,
    "stripe_subscription_id": "sub_...",
    "seats_purchased": 5,
    "status": "active",
    "stripe_plans": {
      "name": "Professional",
      "base_price": 69900
    }
  }
}
```

### Update Subscription

**POST** `/api/billing/subscription`

Actions:
- **upgrade**: Change to higher-tier plan
- **downgrade**: Change to lower-tier plan
- **update-seats**: Change number of team seats
- **cancel**: Cancel subscription entirely

```json
{
  "userId": "uuid",
  "action": "update-seats",
  "seats": 10
}
```

### Webhook Handler

**POST** `/api/billing/stripe-webhook`

Automatically handles:
- Subscription status changes
- Invoice payment confirmations
- Failed payment retries
- Subscription cancellations

## Testing

### Test Cards

Use Stripe's test cards for development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Expiry: Any future date (e.g., `12/25`)
CVC: Any 3 digits (e.g., `123`)

### Test Webhook Locally

Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/billing/stripe-webhook

# Trigger test events
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

## Database Schema

### stripe_customers
- Tracks Stripe customer records linked to users
- One customer per user

### stripe_subscriptions
- Active and historical subscriptions
- Tracks plan, seats, status, trial period

### stripe_invoices
- Monthly invoices for billing history
- Includes payment status and PDF URL

### stripe_usage_records
- Performance-based billing metrics
- Leads qualified, messages sent, etc.

### stripe_plans
- Available pricing tiers
- Features, pricing, billing intervals

## Production Checklist

- [ ] Switch to live Stripe keys
- [ ] Test full checkout flow
- [ ] Set up webhook with production URL
- [ ] Configure email notifications
- [ ] Test subscription management (upgrade, downgrade, cancel)
- [ ] Verify RLS policies on database tables
- [ ] Enable 3D Secure for higher-risk transactions
- [ ] Set up tax calculation if needed
- [ ] Configure dunning management for failed payments

## Support

For Stripe API documentation, visit: https://stripe.com/docs/api

For support issues, contact: support@stripe.com or your account manager
