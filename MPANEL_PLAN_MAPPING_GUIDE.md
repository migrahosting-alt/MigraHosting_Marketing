# mPanel Product Plan Mapping Guide

## Overview

This guide explains how to map marketing site products to mPanel plan IDs for automated provisioning.

## Current Status

❌ **Placeholder IDs**: The mapping file uses placeholder mPanel IDs that need to be updated
✅ **Marketing IDs**: All marketing site product IDs are documented
✅ **Cart Integration**: Products add to cart but use generic IDs

## Files Created

### `apps/website/src/lib/mPanelProductMapping.ts`
Central mapping file that connects marketing site product IDs to mPanel plan IDs.

## Step-by-Step Setup

### 1. Get Your mPanel Plan IDs

Run this command against your mPanel API:

```bash
# Local development
curl http://localhost:2271/api/public/plans | jq

# Production
curl https://migrapanel.com/api/public/plans | jq
```

Example response:
```json
{
  "plans": [
    {
      "id": "plan_abc123",
      "name": "Starter Hosting",
      "monthly_price": 7.95,
      "annual_price": 71.40
    },
    {
      "id": "plan_vps_xyz789",
      "name": "VPS Small",
      "monthly_price": 9.95
    }
  ]
}
```

### 2. Update the Mapping File

Edit `apps/website/src/lib/mPanelProductMapping.ts`:

```typescript
// BEFORE (placeholder)
export const VPS_PLANS: Record<string, ProductPlan> = {
  'vps-small': {
    marketingId: 'vps-small',
    mPanelId: 'plan_vps_small',  // ❌ Placeholder
    productType: 'vps',
    name: 'VPS Small',
    monthlyPrice: 9.95
  }
};

// AFTER (real mPanel ID from API)
export const VPS_PLANS: Record<string, ProductPlan> = {
  'vps-small': {
    marketingId: 'vps-small',
    mPanelId: 'plan_vps_xyz789',  // ✅ Real ID from mPanel
    productType: 'vps',
    name: 'VPS Small',
    monthlyPrice: 9.95
  }
};
```

### 3. Update Product Pricing Components

Modify the pricing sections to use mPanel plan IDs:

#### VPS/Cloud Example:

```typescript
// In VpsCloudPricingSection.tsx
import { getMPanelPlanId } from '../../../apps/website/src/lib/mPanelProductMapping';
import { mpanelClient } from '../../../apps/website/src/lib/mpanel';

const handleGetStarted = async (planId: string, productType: "vps" | "cloud") => {
  const email = prompt('Enter your email:');
  if (!email) return;

  // Get the real mPanel ID
  const mPanelId = getMPanelPlanId(planId, productType);
  if (!mPanelId) {
    alert('Invalid plan selected');
    return;
  }

  try {
    // Create checkout session directly with mPanel
    const session = await mpanelClient.createCheckout(
      mPanelId,           // Real mPanel plan ID
      'monthly',          // or 'annually'
      email
    );
    
    // Redirect to Stripe checkout
    window.location.href = session.url;
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

#### WordPress Example:

```typescript
// In ManagedWpPricingSection.tsx
import { getMPanelPlanId } from '../../../apps/website/src/lib/mPanelProductMapping';
import { mpanelClient } from '../../../apps/website/src/lib/mpanel';

const handleGetStarted = async (planId: string) => {
  const email = prompt('Enter your email:');
  if (!email) return;

  const mPanelId = getMPanelPlanId(planId, 'wordpress');
  if (!mPanelId) {
    alert('Invalid plan selected');
    return;
  }

  try {
    const session = await mpanelClient.createCheckout(mPanelId, 'monthly', email);
    window.location.href = session.url;
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

#### Email Example:

```typescript
// In MigraMailPricingSection.tsx
import { getMPanelPlanId } from '../../../apps/website/src/lib/mPanelProductMapping';
import { mpanelClient } from '../../../apps/website/src/lib/mpanel';

const handleGetStarted = async (planId: string) => {
  const email = prompt('Enter your email:');
  if (!email) return;

  const mPanelId = getMPanelPlanId(planId, 'email');
  if (!mPanelId) {
    alert('Invalid plan selected');
    return;
  }

  try {
    const session = await mpanelClient.createCheckout(mPanelId, 'monthly', email);
    window.location.href = session.url;
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
```

### 4. Alternative: Bypass Cart, Go Direct to Checkout

Instead of adding to cart, you can go directly to Stripe checkout:

```typescript
// Skip cart entirely
const handleBuyNow = async (planId: string) => {
  const email = prompt('Enter your email:');
  if (!email) return;

  const mPanelId = getMPanelPlanId(planId, 'vps');
  
  try {
    // Create Stripe session directly
    const session = await mpanelClient.createCheckout(
      mPanelId,
      'monthly',
      email,
      window.location.origin + '/checkout/success',
      window.location.href
    );
    
    // Immediate redirect to Stripe
    window.location.href = session.url;
  } catch (error) {
    alert('Checkout failed: ' + error.message);
  }
};
```

## Product ID Reference

### Shared Hosting
- `starter` → `plan_starter_hosting`
- `premium` → `plan_premium_hosting`
- `business` → `plan_business_hosting`
- `student` → `plan_student_hosting`

### VPS
- `vps-small` → `plan_vps_small`
- `vps-medium` → `plan_vps_medium`
- `vps-large` → `plan_vps_large`
- `vps-xlarge` → `plan_vps_xlarge`

### Cloud
- `cloud-small` → `plan_cloud_small`
- `cloud-medium` → `plan_cloud_medium`
- `cloud-large` → `plan_cloud_large`

### WordPress
- `starter` → `plan_wp_starter`
- `growth` → `plan_wp_growth`
- `business` → `plan_wp_business`

### Email
- `basic` → `plan_email_basic`
- `pro` → `plan_email_pro`
- `business` → `plan_email_business`

## Automated Provisioning Flow

```
1. User clicks "Get Started" on VPS Small plan
   ↓
2. Marketing site gets mPanel ID: 'vps-small' → 'plan_vps_xyz789'
   ↓
3. POST /api/public/checkout with plan_vps_xyz789
   ↓
4. mPanel creates Stripe checkout session
   ↓
5. User pays on Stripe
   ↓
6. Stripe webhook → mPanel /api/webhooks/stripe
   ↓
7. mPanel provisions VPS automatically
   ↓
8. Customer receives credentials via email
   ↓
9. Service appears in control panel
```

## Testing Checklist

- [ ] Get real plan IDs from mPanel API
- [ ] Update all placeholder IDs in `mPanelProductMapping.ts`
- [ ] Test VPS checkout flow
- [ ] Test WordPress checkout flow
- [ ] Test Email checkout flow
- [ ] Verify Stripe webhook receives correct plan ID
- [ ] Confirm automated provisioning triggers
- [ ] Check customer receives credentials email
- [ ] Verify service appears in mPanel

## Helper Functions Available

```typescript
// Get mPanel plan ID
const mPanelId = getMPanelPlanId('vps-small', 'vps');

// Get full plan details
const plan = getProductPlan('vps-small', 'vps');
console.log(plan.name, plan.monthlyPrice);

// Validate plan exists
if (isPlanValid('vps-small', 'vps')) {
  // Plan exists
}

// Get all plans of a type
const allVpsPlans = getPlansByType('vps');
```

## Notes

- **Placeholder IDs**: All `plan_*` IDs in the mapping file are placeholders
- **Real IDs**: Must be fetched from your mPanel `/api/public/plans` endpoint
- **Sync Required**: When you add/remove plans in mPanel, update this mapping file
- **Cart vs Direct**: You can either add to cart first OR go directly to Stripe checkout
- **Terms**: Currently supporting 'monthly' and 'annually' - adjust per your pricing

## Production Deployment

Before going live:

1. ✅ Fetch all real plan IDs from production mPanel
2. ✅ Update mapping file with production IDs
3. ✅ Test checkout with Stripe test mode
4. ✅ Verify webhook provisioning works
5. ✅ Switch to Stripe live mode
6. ✅ Test end-to-end with real payment
7. ✅ Monitor first few orders for issues

---

**Status**: Mapping structure ready, needs real mPanel plan IDs
