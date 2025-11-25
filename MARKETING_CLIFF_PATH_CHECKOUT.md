# MigraHosting – Pricing → Cart → Checkout Cliff Path

This document describes the correct behavior for the **marketing website checkout flow**.

Copilot: use this as the source of truth whenever you touch `/pricing`, `/cart`, `/checkout` in the `migrahosting-marketing-site/` project.

---

## A. Pricing Page – `/pricing`

- Files:
  - `src/pages/pricing.tsx`
  - `src/components/PricingGrid.tsx`
  - `src/products/migrahosting/ui/HostingPricingSection.tsx`
  - `src/context/CartContext.tsx`

### Expected behavior

1. User picks **one** hosting plan:
   - Student / Starter / Premium / Business.
2. User chooses a billing term:
   - Monthly / Annually / Triennially.
3. Optional: toggle **14-day free trial** when available.
4. Buttons:
   - **Add to cart** → puts plan in cart, stays on `/pricing`.
   - **Checkout now** → puts plan in cart and navigates to `/cart`.

### Rules

- Cart must contain **only one hosting base plan** at a time.
- If a hosting plan is already in cart:
  - Adding a different hosting plan **replaces** the existing one instead of adding a second line.
- Other items (domains, addons) may be extra lines.

---

## B. Cart Page – `/cart`

- Files:
  - `src/pages/cart.tsx`
  - `src/context/CartContext.tsx`
  - Shared layout component used by `pricing.tsx` (navbar + footer).

### Expected behavior

1. `/cart` uses the **same layout** as `/pricing`:
   - Top navbar, footer, background, branding.
2. Cart contents:
   - One line for the hosting plan.
   - Optional line for domain.
   - Optional lines for addons.
3. Order summary:
   - Subtotal
   - Discount (if promo applied later)
   - Total due today (respecting 14-day trial = $0 today when active).
4. Button:
   - **Continue to Checkout** → navigate to `/checkout`.

### Rules

- Do not show duplicate hosting plan rows; there should be at most one `type === 'hosting'` item.
- Cart data must be read from `CartContext`.

---

## C. Checkout Page – `/checkout`

- Files:
  - `src/pages/checkout.tsx`
  - Any `CheckoutForm`/validation helper components
  - Validation schema (Yup/Zod/etc.)

### Expected behavior

1. `/checkout` is wrapped in the **same global layout** (navbar + footer).
2. Form sections:
   - Personal info (first name, last name, email, phone).
   - Billing address.
   - Panel password.
   - Optional domain name.
   - Promo code.
3. Promo code:
   - `WELCOME10` must apply **10% off the entire subtotal**.
4. On submit:
   - Validate all required fields.
   - Build a payload and call the mPanel API:
     - `POST /api/checkout/create-session`
   - If `{ success: true, url }`:
     - Redirect browser to `url` (Stripe Checkout session).
   - Do **not** go directly to a "thank you" page without Stripe.

### Payload shape (to backend)

```ts
{
  planId: cart.hostingPlan.code,
  billingCycle: cart.hostingPlan.billingCycle,
  trialActive: cart.hostingPlan.trialActive,
  addonIds: cart.addons.map(a => a.code),
  couponCode: appliedCoupon, // e.g. "WELCOME10" or null
  customer: {
    name: firstName + " " + lastName,
    email,
  },
  domain: {
    mode: domain ? "new-or-transfer" : "later",
    value: domain || "",
  }
}
```

### Rules

- Fix validation so "Missing required fields" only appears when something is actually empty.
- Ensure discount math is correct: total = subtotal * 0.9 for WELCOME10.
- Remove any logic that navigates to a success page without going through Stripe.

---

## D. Stripe Redirect & Success

After Stripe payment, user is redirected to:

```
https://migrahosting.com/checkout/success?session_id=...
```

The success page:

- Calls mPanel backend:
  - `GET /api/checkout/session/:sessionId`
- Shows subscription status + instructions to log into mPanel.

---

If any of these behaviors are missing or broken, update the components in this project until they match this document.
