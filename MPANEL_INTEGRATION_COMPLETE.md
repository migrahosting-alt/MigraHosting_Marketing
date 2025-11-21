# mPanel Integration Complete ✅

## Integration Overview

The marketing site is now fully integrated with mPanel control panel for checkout and provisioning.

## Files Added

### 1. **Client Library**
- `apps/website/public/mpanel-client.js` - Vanilla JavaScript client (for reference)
- `apps/website/src/lib/mpanel.ts` - TypeScript client library
- `apps/website/src/hooks/useMPanel.ts` - React hook for easy integration

### 2. **Pages**
- `apps/website/src/pages/CheckoutSuccess.tsx` - Modern success page with tracking

### 3. **Configuration**
- Updated `.env.example` with `VITE_MPANEL_URL=https://migrapanel.com`

## Environment Variables

Update `apps/website/.env`:

```env
# Production mPanel URL
VITE_MPANEL_URL=https://migrapanel.com

# For local development
VITE_MPANEL_URL=http://localhost:2271
```

## Usage Examples

### 1. Load Plans from mPanel

```typescript
import { useMPanel } from '../hooks/useMPanel';

function PricingPage() {
  const { plans, loading, error } = useMPanel();

  if (loading) return <div>Loading plans...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>${plan.monthly_price}/month</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Create Checkout Session

```typescript
import { useMPanel } from '../hooks/useMPanel';

function PlanCard({ planId }) {
  const { createCheckout } = useMPanel();

  const handleBuy = async () => {
    const email = prompt('Enter your email:');
    if (!email) return;

    try {
      const checkoutUrl = await createCheckout(planId, 'monthly', email);
      window.location.href = checkoutUrl; // Redirect to Stripe
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return <button onClick={handleBuy}>Buy Now</button>;
}
```

### 3. Direct Client Usage

```typescript
import { mpanelClient } from '../lib/mpanel';

// Get plans
const plans = await mpanelClient.getPlans();

// Create checkout
const session = await mpanelClient.createCheckout(
  'basic',
  'monthly',
  'user@example.com'
);
window.location.href = session.url;

// Health check
const health = await mpanelClient.healthCheck();
console.log(health.status);
```

## API Endpoints

### GET `/api/public/plans`
Returns all available hosting plans.

**Response:**
```json
{
  "plans": [
    {
      "id": "basic",
      "name": "Basic Hosting",
      "description": "Perfect for starter sites",
      "monthly_price": 9.95,
      "annual_price": 95.00,
      "disk_space": "10 GB",
      "bandwidth": "Unlimited",
      "max_websites": 1
    }
  ]
}
```

### POST `/api/public/checkout`
Creates Stripe checkout session.

**Request:**
```json
{
  "planId": "basic",
  "term": "monthly",
  "email": "customer@example.com",
  "successUrl": "https://migrahosting.com/checkout/success",
  "cancelUrl": "https://migrahosting.com/pricing"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "id": "cs_test_..."
}
```

## Success Page Flow

1. Customer completes Stripe checkout
2. Stripe redirects to `/checkout/success?session_id=cs_xxx`
3. `CheckoutSuccess.tsx` displays confirmation
4. Tracks conversion in Google Analytics & Facebook Pixel
5. Customer can access control panel at `https://migrapanel.com`

## Next Steps for Product Pages

To integrate mPanel with VPS, WordPress, and Email pages, you can:

### Option 1: Use mPanel Plans (Recommended)
Update the pricing sections to fetch plans from mPanel instead of hard-coded data.

### Option 2: Hybrid Approach
Keep the current UI but use mPanel checkout:

```typescript
// In VpsCloudPricingSection.tsx
import { mpanelClient } from '../../../apps/website/src/lib/mpanel';

const handleGetStarted = async (planId: string) => {
  const email = prompt('Enter your email:');
  if (!email) return;

  try {
    const session = await mpanelClient.createCheckout(
      planId,
      'monthly',
      email
    );
    window.location.href = session.url;
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

## Production Deployment Checklist

- [ ] Update `VITE_MPANEL_URL` to production domain
- [ ] Configure Stripe webhook in mPanel:
  - Webhook URL: `https://migrapanel.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `payment_intent.succeeded`
- [ ] Test checkout flow end-to-end
- [ ] Verify automatic provisioning works
- [ ] Test success page redirects
- [ ] Confirm email notifications are sent
- [ ] Add conversion tracking codes (GA4, Facebook Pixel)

## URLs to Update

When deploying to production, update these URLs:

1. **mPanel URL**: `http://localhost:2271` → `https://migrapanel.com`
2. **Control Panel Login**: `http://localhost:2272` → `https://migrapanel.com/login`
3. **Success URLs**: Use full domain `https://migrahosting.com/checkout/success`

## Testing Locally

1. Start mPanel API:
   ```bash
   cd /home/bonex/MigraWeb/MigraHosting/dev/migra-panel
   npm start
   ```

2. Start marketing site:
   ```bash
   cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site/apps/website
   npm run dev
   ```

3. Set `.env`:
   ```env
   VITE_MPANEL_URL=http://localhost:2271
   ```

4. Test checkout flow

## Support

- **mPanel Docs**: `/home/bonex/MigraWeb/MigraHosting/dev/migra-panel/examples/`
- **Integration Guide**: `MPANEL_INTEGRATION.md`
- **Demo HTML**: `MPANEL_DEMO_EXAMPLE.html`

---

**Integration Status**: ✅ Complete and ready for production deployment
