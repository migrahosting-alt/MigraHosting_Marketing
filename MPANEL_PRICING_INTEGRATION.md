# ✅ mPanel Pricing Components Integration

Successfully copied pricing configuration and components from migra-panel examples.

## 📁 Files Copied

### Configuration Files
```
✅ apps/website/src/config/
   ├── pricingConfig.ts (existing - already updated with your specs)
   ├── pricingConfig.migrapanel.ts (reference from migra-panel)
   └── pricingConfig.migrapanel.js (JavaScript version)
```

### Pricing Components
```
✅ apps/website/src/components/pricing/
   ├── HostingPricingComponent.tsx
   ├── WordPressPricingComponent.tsx
   └── SimplePricingComponents.tsx
      ├── EmailPricingComponent
      ├── VPSPricingComponent
      ├── CloudPricingComponent
      └── StoragePricingComponent
```

### Documentation
```
✅ docs/integrations/
   ├── PRICING_README.md
   ├── PRICING_COMPONENTS_GUIDE.md
   └── INTEGRATION_QUICK_START.md
```

## 🔄 What You Already Have vs. What Was Copied

### Your Existing `pricingConfig.ts` (KEEP THIS)
- ✅ Updated with your exact pricing
- ✅ Has mPanel ID fields for integration
- ✅ Includes helper functions: `getPlanById()`, `getMPanelIdFromPlan()`
- ✅ Production-ready structure

### Reference `pricingConfig.migrapanel.ts` (COMPARE)
- Similar structure from migra-panel examples
- Use this to see additional helper functions you might want
- Has `getBillingCycleLabel()`, `getMonthsForCycle()`, `getPriceWithSavings()`

## 🎯 Next Steps

### 1. Merge Helper Functions (Optional)

Your existing config is great! But you might want these extra helpers from the migra-panel version:

```typescript
// Add these to your existing pricingConfig.ts:

export function getBillingCycleLabel(cycle: HostingBillingCycle | SimpleBillingCycle): string {
  const labels = {
    monthly: "Monthly",
    yearly: "Yearly",
    oneYear: "1 Year",
    twoYears: "2 Years",
    threeYears: "3 Years",
  };
  return labels[cycle] || cycle;
}

export function getMonthsForCycle(cycle: HostingBillingCycle | SimpleBillingCycle): number {
  const months = {
    monthly: 1,
    yearly: 12,
    oneYear: 12,
    twoYears: 24,
    threeYears: 36,
  };
  return months[cycle] || 1;
}

export function getPriceWithSavings(monthlyPrice: number, totalPrice: number, months: number) {
  const regularTotal = monthlyPrice * months;
  const savings = regularTotal - totalPrice;
  const savingsPercent = Math.round((savings / regularTotal) * 100);
  return { savings, savingsPercent };
}
```

### 2. Update Pricing Component Imports

The copied components import from `./pricingConfig`. Update the paths:

```tsx
// In HostingPricingComponent.tsx, WordPressPricingComponent.tsx, etc.
// Change:
import { hostingPlans } from './pricingConfig';

// To:
import { hostingPlans } from '../../config/pricingConfig';
```

### 3. Integrate mPanel Checkout

Update the "Get Started" button handlers in each component:

```tsx
import { mpanelClient } from '../../lib/mpanel';
import { getMPanelIdFromPlan } from '../../config/pricingConfig';

const handleGetStarted = async (planId: string) => {
  const email = prompt('Enter your email:'); // Or use a form
  const mPanelId = getMPanelIdFromPlan(planId);
  
  if (!mPanelId) {
    alert('Plan not found');
    return;
  }

  try {
    const session = await mpanelClient.createCheckout(
      mPanelId,
      billingCycle, // 'monthly', 'yearly', etc.
      email,
      'https://migrahosting.com/checkout/success',
      'https://migrahosting.com/pricing'
    );
    window.location.href = session.url;
  } catch (error) {
    console.error('Checkout failed:', error);
    alert('Failed to create checkout session');
  }
};
```

### 4. Use Components in Your Pages

Replace existing pricing sections:

```tsx
// apps/website/src/pages/Hosting.tsx
import HostingPricingComponent from '../components/pricing/HostingPricingComponent';

// Replace HostingPricingSection with:
<HostingPricingComponent />
```

```tsx
// apps/website/src/pages/ManagedWordPress.tsx
import WordPressPricingComponent from '../components/pricing/WordPressPricingComponent';

// Replace ManagedWpPricingSection with:
<WordPressPricingComponent />
```

```tsx
// apps/website/src/pages/Email.tsx
import { EmailPricingComponent } from '../components/pricing/SimplePricingComponents';

// Replace MigraMailPricingSection with:
<EmailPricingComponent />
```

## 📚 Documentation Reference

### Quick Integration
See: `docs/integrations/INTEGRATION_QUICK_START.md`

### Component Customization
See: `docs/integrations/PRICING_COMPONENTS_GUIDE.md`

### Framework Examples
See: `docs/integrations/PRICING_README.md`

## 🔑 Key Benefits

### Single Source of Truth
```typescript
// Update price once in pricingConfig.ts
hostingPlans.plans[1].pricing.monthly = 7.95;

// Changes propagate to:
// ✅ Hosting page
// ✅ Pricing comparison
// ✅ Cart calculations
// ✅ Checkout flow
// ✅ mPanel API calls
```

### Type Safety
```typescript
// TypeScript catches errors at compile time
const plan = getPlanById(hostingPlans.plans, 'typo'); // Error!
const price: number = plan.pricing.monthly; // Type-safe
```

### mPanel Integration
```typescript
// Automatic mapping to mPanel plan IDs
const marketingId = 'starter'; // Your marketing site ID
const mPanelId = getMPanelIdFromPlan(marketingId); // 'plan_starter_hosting'

// Direct checkout
await mpanelClient.createCheckout(mPanelId, 'monthly', email);
```

## ⚡ Quick Commands

### Compare Configs
```bash
# See differences between your config and migra-panel reference
diff apps/website/src/config/pricingConfig.ts \
     apps/website/src/config/pricingConfig.migrapanel.ts
```

### Test Import
```bash
# In WSL
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site/apps/website
node -e "import('./src/config/pricingConfig.js').then(m => console.log(m.hostingPlans))"
```

### Check Component Imports
```bash
# Find all import statements in pricing components
grep -r "import.*pricingConfig" apps/website/src/components/pricing/
```

## 🎨 Customization Tips

### Styling
The components use Tailwind CSS classes. Adjust to match your design:
- Colors: `bg-blue-600` → `bg-purple-600`
- Spacing: `p-6` → `p-8`
- Borders: `rounded-lg` → `rounded-xl`

### Features
Add/remove features from the components:
- **Savings badges**: Already included
- **Popular plan highlight**: Add `plan.featured` flag
- **Feature comparison**: Add `plan.features` array
- **Add-ons**: Create separate component

### API Integration
Choose your checkout flow:
1. **Direct to Stripe** (fastest): `mpanelClient.createCheckout()`
2. **Via Cart** (multi-product): `addItem()` then checkout from cart
3. **Hybrid**: Direct for single plans, cart for bundles

## 🚨 Important Notes

1. **Keep Your Config**: Your `pricingConfig.ts` is already perfect. The `.migrapanel.ts` is just reference.

2. **Update Import Paths**: Components import from `./pricingConfig` - update to `../../config/pricingConfig`

3. **Real mPanel IDs**: Replace placeholder IDs in your config:
   ```bash
   curl https://migrapanel.com/api/public/plans | jq '.[] | {id, name}'
   ```

4. **Test Checkout Flow**: Use Stripe test mode before production

## 📊 File Structure After Integration

```
apps/website/
├── src/
│   ├── config/
│   │   ├── pricingConfig.ts ← YOUR MAIN CONFIG (use this!)
│   │   ├── pricingConfig.migrapanel.ts ← Reference only
│   │   └── pricingConfig.migrapanel.js ← Reference only
│   ├── components/
│   │   └── pricing/
│   │       ├── HostingPricingComponent.tsx ← 4 hosting plans
│   │       ├── WordPressPricingComponent.tsx ← 4 WP plans
│   │       └── SimplePricingComponents.tsx ← VPS, Cloud, Email, Storage
│   ├── lib/
│   │   └── mpanel.ts ← Already created
│   └── pages/
│       ├── Hosting.tsx ← Use HostingPricingComponent
│       ├── ManagedWordPress.tsx ← Use WordPressPricingComponent
│       ├── Email.tsx ← Use EmailPricingComponent
│       └── VpsCloud.tsx ← Use VPSPricingComponent + CloudPricingComponent
└── docs/
    └── integrations/
        ├── PRICING_README.md
        ├── PRICING_COMPONENTS_GUIDE.md
        └── INTEGRATION_QUICK_START.md
```

---

**Status**: ✅ Files copied and ready for integration
**Next**: Update component imports and add mPanel checkout handlers
**Docs**: See `docs/integrations/` for detailed guides
