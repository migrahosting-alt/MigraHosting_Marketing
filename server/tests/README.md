# Testing Guide

Complete testing suite for the Stripe subscription flow.

## Prerequisites

1. **Backend server running**:
   ```bash
   cd server
   node index.js
   # Should be running on http://localhost:4242
   ```

2. **Environment variables set** (`.env`):
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   DATABASE_URL="file:./dev.db"
   ```

3. **Database migrated**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Test Scripts

### 1. Database Schema Test

Tests that all tables exist with correct columns and relationships.

```bash
node server/tests/schema.test.js
```

**What it tests**:
- ✓ Customer, Subscription, Invoice, PaymentMethod tables
- ✓ SubscriptionItem, ProvisioningLog, WebhookEvent tables
- ✓ Foreign key relationships
- ✓ CRUD operations

**Expected output**:
```
🧪 Testing Database Schema

Testing table: Customer
  ✓ Table exists
  ✓ Found 7 columns
  ✓ All expected columns present
  
Testing relationships and data integrity
  ✓ Created test customer
  ✓ Created test subscription
  ✓ Queried customer with 1 subscription(s)
  ✓ Created test invoice
  ✓ Cleaned up test data

✅ Schema tests completed!
```

---

### 2. Checkout API Test

Tests the checkout session creation and polling endpoints.

```bash
node server/tests/checkout-api.test.js
```

**What it tests**:
- ✓ `POST /api/checkout` - Single price ID
- ✓ `POST /api/checkout` - Multiple line items
- ✓ `GET /api/marketing/checkout-session/:sessionId` - Session polling
- ✓ Locale support (EN, ES, FR, etc.)
- ✓ Trial period configuration
- ✓ Error handling (missing fields)

**Expected output**:
```
🧪 Testing Marketing Checkout API

Test 1: POST /api/checkout - Create Checkout Session
  Status: 200
  ✓ Checkout URL: https://checkout.stripe.com/c/pay/cs_test_...
  ✓ Session ID: cs_test_...

Test 2: GET /api/marketing/checkout-session/:sessionId
  Status: 200
  Response: {
    "success": true,
    "session": { ... },
    "subscription": null
  }

✅ All tests completed!
```

---

### 3. Webhook Handler Test

Simulates Stripe webhook events being sent to your webhook endpoint.

```bash
# Development (no signature verification)
USE_SIGNATURE=false node server/tests/webhook.test.js

# Production (with signature - will fail unless you use real Stripe signature)
node server/tests/webhook.test.js
```

**What it tests**:
- ✓ `checkout.session.completed` - Subscription creation
- ✓ `customer.subscription.updated` - Status updates
- ✓ `invoice.paid` - Invoice recording
- ✓ Idempotency (duplicate event handling)
- ✓ Database writes

**Expected output**:
```
🧪 Testing Stripe Webhooks

📍 Webhook URL: http://localhost:4242/webhooks/stripe
🔐 Signature Verification: Disabled

Test 1: checkout.session.completed
  ✓ Status: 200
  ✓ Response: {"received":true}

Test 2: customer.subscription.updated
  ✓ Status: 200
  ✓ Response: {"received":true}

✅ All tests completed!
```

---

## Testing with Real Stripe

### Using Stripe CLI

1. **Install Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop install stripe
   ```

2. **Forward webhooks to local**:
   ```bash
   stripe listen --forward-to localhost:4242/webhooks/stripe
   ```
   
   This will give you a webhook secret like `whsec_...` - add it to your `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Trigger test events**:
   ```bash
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   stripe trigger invoice.paid
   ```

4. **Check your database**:
   ```bash
   npx prisma studio
   # Opens GUI at http://localhost:5555
   ```

---

## Integration Test Flow

Full end-to-end test of the subscription flow:

```bash
# 1. Start backend
cd server && node index.js

# 2. Run schema test
node server/tests/schema.test.js

# 3. Create a checkout session
curl -X POST http://localhost:4242/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_test_123",
    "mode": "subscription",
    "success_url": "http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    "cancel_url": "http://localhost:5173/pricing"
  }'

# 4. Simulate webhook (copy session ID from step 3)
USE_SIGNATURE=false node server/tests/webhook.test.js

# 5. Poll session status
curl http://localhost:4242/api/marketing/checkout-session/cs_test_...

# 6. Check database
npx prisma studio
```

---

## Debugging

### Enable Verbose Logging

```bash
# In server/index.js or webhook handler
console.log('[DEBUG] Event:', JSON.stringify(event, null, 2));
```

### Check Database State

```bash
# SQLite CLI
sqlite3 dev.db "SELECT * FROM Subscription ORDER BY createdAt DESC LIMIT 5;"

# Or use Prisma Studio (GUI)
npx prisma studio
```

### Common Issues

1. **Webhook signature verification fails**:
   - Set `USE_SIGNATURE=false` for local testing
   - Or use Stripe CLI: `stripe listen --forward-to localhost:4242/webhooks/stripe`

2. **Database locked**:
   - Close Prisma Studio
   - Restart backend server

3. **Module not found errors**:
   - Run `npm install` or `yarn install`
   - Run `npx prisma generate`

---

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run Database Schema Tests
  run: node server/tests/schema.test.js

- name: Run Checkout API Tests
  run: node server/tests/checkout-api.test.js
  env:
    API_URL: http://localhost:4242
```

---

## Next Steps

- [ ] Add Jest/Mocha for more comprehensive unit tests
- [ ] Add Supertest for HTTP assertions
- [ ] Add test coverage reporting (Istanbul/nyc)
- [ ] Add Stripe webhook signature verification tests
- [ ] Add provisioning service integration tests
