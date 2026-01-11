# Subscription System Setup Guide

This document explains how to set up the subscription system for Nano Banana.

## Prerequisites

- Supabase project with authentication enabled
- Creem account with API credentials
- Database migration access

## Database Setup

### 1. Run the Migration

Execute the SQL migration file in your Supabase SQL editor:

```bash
# Connect to your Supabase project
# Go to SQL Editor
# Run the contents of: supabase/migrations/001_create_subscriptions.sql
```

Or run it directly in the Supabase Dashboard SQL Editor:

```sql
-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('Basic', 'Pro', 'Max')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  product_id TEXT,
  order_id TEXT,
  checkout_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create checkout_mappings table
CREATE TABLE IF NOT EXISTS checkout_mappings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checkout_mappings_request_id ON checkout_mappings(request_id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can insert their own checkout mappings"
  ON checkout_mappings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all checkout mappings"
  ON checkout_mappings
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Creem Payment Configuration
CREEM_API_KEY=your_creem_api_key_here
CREEM_WEBHOOK_SECRET=your_creem_webhook_secret_here
CREEM_API_URL=https://api.creem.io  # or https://test-api.creem.io for testing

# Product IDs (get these from your Creem dashboard)
CREEM_PRODUCT_ID_BASIC=prod_basic_monthly
CREEM_PRODUCT_ID_PRO=prod_pro_monthly
CREEM_PRODUCT_ID_MAX=prod_max_monthly

# App URL (used for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production URL
```

## Creem Webhook Setup

### 1. Configure Webhook in Creem Dashboard

1. Go to your Creem dashboard
2. Navigate to Webhooks settings
3. Add a new webhook with URL: `https://yourdomain.com/api/payment/webhook`
4. Select events to listen for:
   - `payment.succeeded`
   - `checkout.completed`
5. Copy the webhook secret to your `.env.local` as `CREEM_WEBHOOK_SECRET`

### 2. Test the Webhook

Use Creem's webhook testing feature or make a test payment to verify:
- Signature verification works
- Subscription is created in database
- User can access image generation after payment

## How It Works

### User Flow

1. **User visits pricing page** → Must be signed in to subscribe
2. **User clicks "Subscribe"** → Creates checkout session with user ID mapping
3. **User completes payment** → Redirected to success page
4. **Creem sends webhook** → Creates subscription record in database
5. **User can now generate images** → System verifies active subscription

### Authentication Check

The image generation function (`/app/page.tsx`) checks:
1. User is authenticated (`user` state)
2. User has active subscription (`hasSubscription` state)

If either check fails, user is redirected to pricing page with appropriate message.

### API Endpoints

- `POST /api/payment/create-checkout` - Creates Creem checkout session (requires auth)
- `GET /api/payment/check-subscription?user_id=X` - Checks if user has active subscription
- `POST /api/payment/webhook` - Handles Creem webhook events
- `GET /api/payment/verify-payment` - Verifies payment signature (for success page)

## Testing

### 1. Test Authentication

```javascript
// In browser console
await supabase.auth.signInWithOAuth({ provider: 'google' })
```

### 2. Test Subscription Check

```bash
curl "http://localhost:3000/api/payment/check-subscription?user_id=USER_ID"
```

### 3. Test Webhook Locally

Use a tool like ngrok to expose your local server:

```bash
ngrok http 3000
# Use the ngrok URL in Creem webhook settings
```

## Troubleshooting

### "User not authenticated" Error
- Ensure user is signed in before subscribing
- Check Supabase session is valid

### "Failed to save subscription" Error
- Check database tables exist
- Verify RLS policies allow service role access
- Check Supabase logs for detailed errors

### Subscription Not Activating After Payment
- Verify webhook is receiving events from Creem
- Check webhook signature matches `CREEM_WEBHOOK_SECRET`
- Look at server logs for webhook processing errors

### Images Can't Be Generated
- Verify `checkSubscription` is being called on page load
- Check user has `status: 'active'` in subscriptions table
- Ensure `expires_at` is in the future

## Security Notes

- Webhook signature verification prevents fake payment notifications
- RLS policies ensure users can only access their own subscription data
- Service role key required for webhook to update subscriptions
- Checkout mappings prevent unauthorized subscription claims
