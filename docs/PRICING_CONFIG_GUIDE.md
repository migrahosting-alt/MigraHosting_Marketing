# Using the Centralized Pricing Config

## Overview

All pricing data for the Migra ecosystem is now centralized in:
```
src/config/pricing.ts
```

This single source of truth contains all plan pricing with proper TypeScript types.

---

## Quick Start

### Import pricing data

```typescript
import { hostingPlans, wpPlans, mailPlans, vpsPlans, cloudPlans, storagePlans } from '@/config/pricing';

// Get a specific plan
const starterPlan = hostingPlans.plans.find(p => p.id === "starter");
console.log(starterPlan?.pricing.threeYears); // 1.49

// Get all VPS plans
const allVpsPlans = vpsPlans.plans;
```

---

## Pricing Structure

### Shared Hosting & WordPress
- Billing cycles: `monthly`, `oneYear`, `twoYears`, `threeYears`
- Access: `plan.pricing.monthly`, `plan.pricing.threeYears`, etc.

### Email, VPS, Cloud, Storage
- Billing cycles: `monthly`, `yearly`
- Access: `plan.pricing.monthly`, `plan.pricing.yearly`

---

## Example Usage

### 1. Shared Hosting Pricing Component

```tsx
import React from 'react';
import { hostingPlans, formatPrice } from '@/config/pricing';

export const HostingPricing = () => {
  return (
    <div className="pricing-grid">
      {hostingPlans.plans.map((plan) => (
        <div key={plan.id} className="pricing-card">
          <h3>{plan.name}</h3>
          
          {/* Show 3-year price */}
          <div className="price">
            <span className="amount">{formatPrice(plan.pricing.threeYears)}/mo</span>
          </div>
          
          {/* Show monthly price */}
          <p className="monthly-price">
            ${plan.pricing.monthly}/mo month-to-month
          </p>
          
          <button>Get Started</button>
        </div>
      ))}
    </div>
  );
};
```

### 2. Email Pricing (per mailbox)

```tsx
import { mailPlans } from '@/config/pricing';

export const EmailPricing = () => {
  return (
    <div className="pricing-grid">
      {mailPlans.plans.map((plan) => (
        <div key={plan.id} className="pricing-card">
          <h3>{plan.name}</h3>
          <div className="price">
            <span>${plan.pricing.yearly}/mailbox/mo</span>
            <span className="note">billed annually</span>
          </div>
          <p className="monthly-option">
            ${plan.pricing.monthly}/mo monthly
          </p>
        </div>
      ))}
    </div>
  );
};
```

### 3. VPS/Cloud with Tabs

```tsx
import { vpsPlans, cloudPlans } from '@/config/pricing';

export const VpsCloudPricing = () => {
  const [activeTab, setActiveTab] = useState<'vps' | 'cloud'>('vps');
  
  const plans = activeTab === 'vps' ? vpsPlans.plans : cloudPlans.plans;
  
  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('vps')}>VPS</button>
        <button onClick={() => setActiveTab('cloud')}>Cloud</button>
      </div>
      
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="pricing-card">
            <h3>{plan.name}</h3>
            <div className="price">
              ${plan.pricing.yearly}/mo
            </div>
            <p className="monthly">${plan.pricing.monthly}/mo monthly</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. WordPress Plans

```tsx
import { wpPlans, calculateSavings, formatPrice } from '@/config/pricing';

export const WordPressPricing = () => {
  return (
    <div className="pricing-grid">
      {wpPlans.plans.map((plan) => (
        <div key={plan.id} className="pricing-card">
          <h3>{plan.name}</h3>
          
          {/* Best price (3-year) */}
          <div className="price">
            {formatPrice(plan.pricing.threeYears)}/mo
          </div>
          
          {/* Show savings */}
          <div className="savings">
            Save {calculateSavings(plan.pricing.monthly, plan.pricing.threeYears)}%
          </div>
          
          {/* Billing options */}
          <div className="billing-options">
            <p>1-year: ${plan.pricing.oneYear}/mo</p>
            <p>2-year: ${plan.pricing.twoYears}/mo</p>
            <p>Monthly: ${plan.pricing.monthly}/mo</p>
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## Utility Functions

### formatPrice(price: number)
Formats a price for display. Returns "Free" for $0.00, otherwise returns formatted price.

```typescript
formatPrice(0);      // "Free"
formatPrice(7.95);   // "$7.95"
formatPrice(1.49);   // "$1.49"
```

### calculateSavings(monthly: number, discounted: number)
Calculates the percentage saved between monthly and discounted price.

```typescript
calculateSavings(7.95, 1.49);  // 81 (percent)
calculateSavings(11.95, 6.95); // 42 (percent)
```

### calculateTotal(monthlyRate: number, months: number)
Calculates total cost for a billing period.

```typescript
calculateTotal(1.99, 12);  // 23.88 (one year total)
calculateTotal(1.49, 36);  // 53.64 (three year total)
```

---

## Type Definitions

### HostingBillingCycle
```typescript
type HostingBillingCycle = "monthly" | "oneYear" | "twoYears" | "threeYears";
```

### SimpleBillingCycle
```typescript
type SimpleBillingCycle = "monthly" | "yearly";
```

---

## Complete Plan Structure

```typescript
// Hosting & WordPress Plans
{
  id: string;
  name: string;
  type: string;
  pricing: {
    monthly: number;
    oneYear: number;
    twoYears: number;
    threeYears: number;
  };
  notes?: string; // Optional, e.g., "Requires academic verification"
}

// Email, VPS, Cloud, Storage Plans
{
  id: string;
  name: string;
  pricing: {
    monthly: number;
    yearly: number;
  };
}
```

---

## Refactoring Guide

### Tell Copilot:

> "Refactor all pricing components to pull their prices from `src/config/pricing.ts` instead of hardcoded values. Use `hostingPlans`, `wpPlans`, `mailPlans`, `vpsPlans`, `cloudPlans`, and `storagePlans` imports. Replace hardcoded prices with values from the config."

### Example Refactor

**Before:**
```tsx
const plans = [
  { name: "Starter", monthlyPrice: "7.95", yearlyPrice: "1.99" }
];
```

**After:**
```tsx
import { hostingPlans } from '@/config/pricing';

const plans = hostingPlans.plans;
// Access: plan.pricing.monthly, plan.pricing.oneYear, etc.
```

---

## Benefits

1. ✅ **Single source of truth** – Update prices in one place
2. ✅ **Type safety** – TypeScript catches errors at compile time
3. ✅ **No magic strings** – Proper object structure with autocomplete
4. ✅ **Utility functions** – Reusable price formatting & calculations
5. ✅ **Consistent naming** – `oneYear`, `twoYears`, `threeYears` instead of mixed conventions
6. ✅ **Easy to find** – All plans use `.find(p => p.id === "plan-id")`

---

**Last updated**: November 16, 2025

```tsx
import React from 'react';
import { SHARED_HOSTING_PLANS, formatPrice, calculateSavings } from '@/config/pricing';

export const HostingPricing = () => {
  return (
    <div className="pricing-grid">
      {SHARED_HOSTING_PLANS.map((plan) => (
        <div key={plan.id} className="pricing-card">
          <h3>{plan.name}</h3>
          <p>{plan.tagline}</p>
          
          {/* Show 3-year price prominently */}
          <div className="price">
            <span className="amount">{formatPrice(plan.pricing.triennially || plan.pricing.monthly)}/mo</span>
            {plan.pricingTotals?.triennially && (
              <span className="total">
                ${plan.pricingTotals.triennially} billed every 3 years
              </span>
            )}
          </div>
          
          {/* Show savings */}
          {plan.pricing.triennially && plan.pricing.monthly !== plan.pricing.triennially && (
            <div className="savings">
              Save {calculateSavings(plan.pricing.monthly, plan.pricing.triennially)}%
            </div>
          )}
          
          <button>Get Started</button>
        </div>
      ))}
    </div>
  );
};
```

### 3. Email pricing (per mailbox)

```tsx
import { EMAIL_PLANS, EMAIL_PRICING_NOTE } from '@/config/pricing';

export const EmailPricing = () => {
  return (
    <div>
      <div className="pricing-grid">
        {EMAIL_PLANS.map((plan) => (
          <div key={plan.id} className="pricing-card">
            <h3>{plan.name}</h3>
            <div className="price">
              <span>${plan.pricing.annually}/mailbox/mo</span>
              <span className="note">billed annually</span>
            </div>
          </div>
        ))}
      </div>
      <p className="pricing-note">{EMAIL_PRICING_NOTE}</p>
    </div>
  );
};
```

### 4. VPS/Cloud with tabs

```tsx
import { VPS_PLANS, CLOUD_PLANS } from '@/config/pricing';

export const VpsCloudPricing = () => {
  const [activeTab, setActiveTab] = useState<'vps' | 'cloud'>('vps');
  
  const plans = activeTab === 'vps' ? VPS_PLANS : CLOUD_PLANS;
  
  return (
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('vps')}>VPS</button>
        <button onClick={() => setActiveTab('cloud')}>Cloud</button>
      </div>
      
      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="pricing-card">
            <h3>{plan.name}</h3>
            <div className="price">
              ${plan.pricing.annually}/mo
            </div>
            {plan.popular && <span className="badge">Most Popular</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5. Utility functions

**Get a specific plan:**
```typescript
const starterPlan = getPlanById('starter');
console.log(starterPlan?.pricing.triennially); // "1.49"
```

**Get the popular plan from a category:**
```typescript
const popularWP = getPopularPlan(WORDPRESS_PLANS);
console.log(popularWP?.name); // "WP Growth"
```

**Format prices:**
```typescript
formatPrice("0.00");    // "Free"
formatPrice("7.95");    // "$7.95"
formatPrice("1.49");    // "$1.49"
```

**Calculate savings:**
```typescript
calculateSavings("7.95", "1.49"); // 81 (percent)
```

---

## Quick Pricing Highlights (for Home Page)

```tsx
import { QUICK_PRICING_HIGHLIGHTS } from '@/config/pricing';

export const PricingHighlights = () => {
  return (
    <div className="highlights">
      <div>Hosting from ${QUICK_PRICING_HIGHLIGHTS.hosting.startingAt}/mo</div>
      <div>WordPress from ${QUICK_PRICING_HIGHLIGHTS.wordpress.startingAt}/mo</div>
      <div>Email from ${QUICK_PRICING_HIGHLIGHTS.email.startingAt}/mailbox/mo</div>
      <div>VPS from ${QUICK_PRICING_HIGHLIGHTS.vps.startingAt}/mo</div>
      <div>Storage from ${QUICK_PRICING_HIGHLIGHTS.storage.startingAt}/mo</div>
    </div>
  );
};
```

---

## Component Refactoring Checklist

To migrate existing components to use the centralized config:

### ✅ Shared Hosting
- [ ] Update `apps/website/src/pages/Hosting.tsx`
- [ ] Update `products/migrahosting/ui/HostingPricingSection.tsx`
- [ ] Replace hardcoded prices with `SHARED_HOSTING_PLANS`
- [ ] Use `formatPrice()` for price display

### ✅ WordPress
- [ ] Update `products/migrawp/ui/ManagedWpPricingSection.tsx`
- [ ] Replace JSON import with `WORDPRESS_PLANS`
- [ ] Use `getPopularPlan()` to mark popular plan

### ✅ Email
- [ ] Update `products/migramail/ui/MigraMailPricingSection.tsx`
- [ ] Replace JSON import with `EMAIL_PLANS`
- [ ] Add `EMAIL_PRICING_NOTE` below pricing table

### ✅ VPS/Cloud
- [ ] Update `products/migravps/ui/VpsCloudPricingSection.tsx`
- [ ] Replace JSON import with `VPS_PLANS` and `CLOUD_PLANS`
- [ ] Use tab state to switch between arrays

### ✅ Storage
- [ ] Update `products/migrastorage/ui/StoragePricingSection.tsx`
- [ ] Replace JSON import with `STORAGE_PLANS`
- [ ] Add `STORAGE_PRICING_NOTE` below table

### ✅ Home Page
- [ ] Create/update `apps/website/src/pages/Home.tsx`
- [ ] Use `QUICK_PRICING_HIGHLIGHTS` for pricing section
- [ ] Use `getPopularPlan()` for each product category

---

## Benefits of Centralized Pricing

1. **Single source of truth** – Update prices in one place
2. **Type safety** – TypeScript interfaces ensure consistency
3. **Utility functions** – Reusable price formatting & calculations
4. **No JSON parsing** – Direct TypeScript imports
5. **Easy testing** – Mock pricing data in tests
6. **Version control** – Track pricing changes in git

---

## Migration Example

**Before** (using JSON file):
```tsx
import sharedPlans from '../../../../products/migrahosting/shared-hosting/plans/shared-plans.json';

// Error-prone: JSON might be out of sync
const price = sharedPlans.plans[0].pricing.monthly;
```

**After** (using centralized config):
```tsx
import { SHARED_HOSTING_PLANS, formatPrice } from '@/config/pricing';

// Type-safe and always in sync
const price = formatPrice(SHARED_HOSTING_PLANS[0].pricing.monthly);
```

---

## Next Steps

1. **Refactor existing components** to use `src/config/pricing.ts`
2. **Remove or deprecate** individual JSON plan files (they're now redundant)
3. **Update Copilot briefs** to reference centralized config
4. **Test all pricing pages** to ensure correct display
5. **Document any custom pricing logic** (e.g., Windows Server add-ons)

---

**Tell Copilot:**

> "Refactor the entire site to read all prices from `src/config/pricing.ts`. Update all pricing components to import from this centralized config instead of individual JSON files. Use the utility functions (`formatPrice`, `calculateSavings`, `getPopularPlan`) where appropriate."

---

**Last updated**: November 16, 2025
