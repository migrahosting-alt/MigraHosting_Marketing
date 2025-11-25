# Product Pages Fix Implementation Plan

## Current Status
- Commit: c2fe6f9 (homepage working, 3 product pages blank)
- Blank pages: /managed-wordpress, /vps-cloud, /email
- Root cause: Custom pricing sections import CartContext with broken paths

## Solution Strategy
Instead of fixing the broken pricing sections in products/ folder, we'll:
1. Create simple inline pricing sections directly in each page component
2. Use the working CartContext from apps/website/src/context/CartContext.tsx
3. Add proper cart items with metadata for each product family

## Implementation Steps

### Step 1: Fix ManagedWordPress.tsx
- Remove import of ManagedWpPricingSection
- Create inline pricing grid
- Wire to CartContext with proper metadata
- Test page renders

### Step 2: Fix VpsCloud.tsx  
- Same approach as WordPress
- Add VPS-specific metadata

### Step 3: Fix Email.tsx
- Same approach
- Add Email-specific metadata

### Step 4: Test & Deploy
- Build and verify all pages render
- Test add to cart functionality
- Deploy to production

## Cart Item Structure for Each Product

### WordPress Hosting
```typescript
{
  id: 'wp-starter-yearly',
  type: 'simple',
  priceId: 'wp-starter-yearly',
  quantity: 1
}
```

### VPS/Cloud
```typescript
{
  id: 'vps-basic-monthly',
  type: 'simple', 
  priceId: 'vps-basic-monthly',
  quantity: 1
}
```

### Email
```typescript
{
  id: 'email-basic-yearly',
  type: 'simple',
  priceId: 'email-basic-yearly', 
  quantity: 1
}
```
