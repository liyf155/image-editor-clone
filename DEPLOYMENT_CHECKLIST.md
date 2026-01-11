# Production Deployment Checklist

## 🔴 Critical - Must Complete Before Deployment

### 1. Environment Variables
Create `.env.production` with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key

# Creem Payment (Production)
CREEM_API_KEY=your_production_creem_api_key
CREEM_WEBHOOK_SECRET=your_production_webhook_secret
CREEM_API_URL=https://api.creem.io  # NOT test-api.creem.io!

# Product IDs
CREEM_PRODUCT_ID_BASIC=your_basic_product_id
CREEM_PRODUCT_ID_PRO=your_pro_product_id
CREEM_PRODUCT_ID_MAX=your_max_product_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Database Setup
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify `subscriptions` table exists
- [ ] Verify `checkout_mappings` table exists
- [ ] Check RLS policies are enabled
- [ ] Test database connection

### 3. Creem Configuration
- [ ] Switch from test API to production API
- [ ] Configure production webhook URL: `https://yourdomain.com/api/payment/webhook`
- [ ] Test webhook endpoint is accessible
- [ ] Verify product IDs match production environment

### 4. Security Checks
- [ ] Debug page only accessible in development ✅
- [ ] Remove any console.log statements (optional, for production)
- [ ] Verify HTTPS is enabled
- [ ] Check CORS settings if needed
- [ ] Test authentication flow

## 🟡 Important - Should Complete

### 5. Functionality Testing
- [ ] Google Sign In / Sign Out flow
- [ ] Pricing page loads correctly
- [ ] Payment flow works end-to-end
- [ ] Webhook receives and processes payments
- [ ] Subscription status updates correctly
- [ ] Image generation works after subscription
- [ ] All buttons and links work

### 6. Performance
- [ ] Build production bundle: `npm run build`
- [ ] Test production build locally: `npm run start`
- [ ] Check bundle size is reasonable
- [ ] Test on mobile devices
- [ ] Test on different browsers

### 7. SEO & Analytics
- [ ] Update meta tags in `app/layout.tsx`
- [ ] Add analytics (if using any)
- [ ] Set up favicon
- [ ] Verify page titles
- [ ] Check Open Graph tags

## 🟢 Optional - Nice to Have

### 8. Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up logging service
- [ ] Monitor webhook failures
- [ ] Track payment success rate

### 9. Content
- [ ] Review all copy for typos
- [ ] Update contact information
- [ ] Add terms of service
- [ ] Add privacy policy
- [ ] Add refund policy

### 10. Backup & Recovery
- [ ] Database backup strategy
- [ ] Disaster recovery plan
- [ ] Customer support process
- [ ] Known issues document

## 🚀 Deployment Steps

### Option A: Vercel (Recommended for Next.js)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard
```

### Option B: Docker
```bash
# Build
docker build -t nano-banana .

# Run
docker run -p 3000:3000 --env-file .env.production nano-banana
```

### Option C: VPS (DigitalOcean, AWS, etc.)
```bash
# Build
npm run build

# Start
npm run start

# Or use PM2
pm2 start npm --name "nano-banana" -- start
```

## ✅ Pre-Launch Final Checks

1. **Test Payment Flow**
   - Create test account
   - Go through full purchase flow
   - Verify subscription activates
   - Test image generation
   - Test customer support contact

2. **Test Admin Functions**
   - Access `/debug/subscription` (should be blocked in production)
   - Check database for subscriptions
   - Verify webhook logs

3. **Load Testing**
   - Test with multiple concurrent users
   - Check image generation performance
   - Monitor API response times

4. **User Acceptance Testing**
   - Have someone else test the flow
   - Get feedback on UI/UX
   - Fix any critical issues

## 📞 Emergency Contacts

Prepare these before launch:
- Creem support contact
- Supabase support contact
- Hosting provider support
- Emergency rollback plan

## 🎯 Success Metrics

Track these after launch:
- User registration rate
- Payment conversion rate
- Image generation usage
- Webhook success rate
- Error rate
- Page load times

---

## ⚠️ Common Issues & Solutions

### Issue: Webhook not receiving events
**Solution**:
- Verify webhook URL is accessible from internet
- Check Creem dashboard webhook logs
- Test with tools like webhook.site

### Issue: Subscription not activating
**Solution**:
- Check `/api/payment/check-subscription` logs
- Verify database tables exist
- Use `/debug/subscription` in dev mode to manually add

### Issue: Payment succeeds but no subscription
**Solution**:
- Webhook likely failed
- Check server logs for webhook errors
- Manually add subscription via debug tool

### Issue: Creem API returns 404
**Solution**:
- Verify using production API (not test-api)
- Check API key is correct
- Verify product IDs exist in Creem

---

## 🎉 You're Ready to Launch!

Once all critical items are checked off, you're ready to deploy!

Remember to:
- Monitor logs for first 24 hours
- Have rollback plan ready
- Respond quickly to any issues

Good luck with your launch! 🚀
