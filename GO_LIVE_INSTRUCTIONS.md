# 🚀 Production Deployment Instructions

**Date**: November 23, 2025  
**Status**: Ready for production

---

## ✅ Pre-Deployment Checklist

- [x] Removed test mode from checkout
- [x] Removed OVERRIDE100 promo code
- [x] Full billing form implemented
- [x] Real API integration ready
- [x] Error handling in place
- [ ] mPanel marketing API deployed
- [ ] Environment variable `MARKETING_TEST_MODE=false` set on server

---

## 🔧 Step 1: Deploy mPanel Marketing API

SSH into mPanel server and deploy:

```bash
ssh root@10.1.10.10

cd /opt/mpanel
git stash
git pull origin master
pm2 restart mpanel-backend

# Verify deployment
pm2 logs mpanel-backend --lines 50
curl http://localhost:2271/api/health
```

---

## ⚙️ Step 2: Configure Production Environment

Update mPanel `.env` to disable test mode:

```bash
# On mPanel server
nano /opt/mpanel/.env

# Change this line:
MARKETING_TEST_MODE=false

# Then restart
pm2 restart mpanel-backend
```

---

## 🌐 Step 3: Deploy Marketing Site

From your local machine:

```bash
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site

# Deploy production build
./deploy-to-srv1.sh
```

---

## ✅ Step 4: Verification

### Test the Checkout Flow

1. **Visit**: https://migrahosting.com/pricing
2. **Select a plan** and add to cart
3. **Fill out checkout form** with real billing details
4. **Submit** - should redirect to Stripe checkout
5. **Complete payment** (or use Stripe test cards)
6. **Verify** account created in mPanel

### Check mPanel Logs

```bash
ssh root@10.1.10.10
pm2 logs mpanel-backend --lines 100 | grep marketing
```

### Test API Endpoint

```bash
curl -X POST https://migrapanel.com/api/marketing/checkout-intent \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "planSlug": "shared_starter",
    "billingCycle": "monthly",
    "customer": {
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User"
    }
  }'
```

---

## 🔐 Stripe Test Cards (for testing)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## 🐛 Rollback Plan

If issues occur:

```bash
# Revert mPanel
ssh root@10.1.10.10
cd /opt/mpanel
git stash pop
pm2 restart mpanel-backend

# Re-enable test mode
nano /opt/mpanel/.env
# Set: MARKETING_TEST_MODE=true
pm2 restart mpanel-backend
```

---

## 📊 Monitoring

Watch for:
- ✅ Successful checkouts in mPanel admin
- ✅ Stripe webhook events
- ✅ Account provisioning logs
- ⚠️ API errors in PM2 logs
- ⚠️ Failed payments

---

## 🎯 Success Criteria

- [ ] Customer can complete checkout
- [ ] Stripe payment processes
- [ ] mPanel account created
- [ ] Hosting service provisioned
- [ ] Customer receives welcome email
- [ ] No errors in logs

---

**Ready to go live!** 🚀
