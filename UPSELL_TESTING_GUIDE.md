# Upsell System Testing Guide

## Quick Test Flow

### 1. Test Cart Page Add-ons

**Steps:**
1. Navigate to pricing page
2. Select any hosting plan (e.g., Premium)
3. Click "Get Started"
4. Cart page should display
5. Scroll down to see "Enhance Your Hosting" section
6. Verify 6 add-on cards are displayed with:
   - Icon
   - Name
   - Badge (e.g., "Popular", "Essential")
   - Description
   - Price with interval
   - "Add to Order" button

**Test Actions:**
- Click "Add to Order" on Premium SSL
- Verify button changes to "In Cart" (disabled)
- Check cart items list includes SSL with price $9.99/yr
- Add 2-3 more add-ons
- Verify all appear in cart with correct pricing

### 2. Test Checkout Page Toggles

**Steps:**
1. From cart, click "Continue to Checkout"
2. Verify checkout page shows all items (plan + add-ons)
3. Scroll to "Add Premium Features" section
4. Verify toggle switches for all 6 add-ons

**Test Actions:**
- Toggle OFF an add-on that was already in cart
  - Verify it's removed from order summary
  - Verify total decreases
- Toggle ON an add-on that wasn't in cart
  - Verify it's added to order summary
  - Verify total increases
- Toggle multiple add-ons rapidly
  - Verify cart updates correctly
  - No UI glitches

### 3. Test Order Summary Calculations

**Test Cases:**

**Case 1: Monthly add-ons**
- Plan: Premium ($39/month)
- Add-ons: Daily Backups ($4.99/mo), Priority Support ($19.99/mo)
- Expected Due Today: $63.98
- Expected Recurring: $63.98/month

**Case 2: Mixed intervals**
- Plan: Starter ($19/month)
- Add-ons: Premium SSL ($9.99/year), Monitoring ($3.99/month)
- Expected Due Today: $32.98 (first month + yearly SSL)
- Expected Recurring: $22.99/month

**Case 3: Maximum add-ons**
- Add all 6 add-ons to any plan
- Verify totals are correct
- Monthly: $4.99 + $19.99 + $7.99 + $5.99 + $3.99 = $42.95/mo
- Yearly: $9.99/yr
- Verify no calculation errors

### 4. Test Checkout Form Submission

**Steps:**
1. Fill out account details:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: +1234567890
   - Password: TestPassword123
   - Company: Test Co (optional)

2. Fill out billing address:
   - Address 1: 123 Test St
   - City: Test City
   - State: CA
   - Zip: 12345
   - Country: US

3. Domain: testdomain.com (optional)

4. Click "Complete Order"

**Expected:**
- No validation errors
- Shows "Processing..." state
- Console logs show full cartItems array
- Redirects to Stripe checkout
- Stripe checkout displays all line items

### 5. Test Stripe Checkout

**Verify:**
- Hosting plan appears as line item
- All add-ons appear as separate line items
- Prices match frontend
- Intervals correct (monthly/yearly)
- Total matches

**Test Payment:**
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any ZIP code
- Complete payment

### 6. Test Success Page

**Steps:**
1. After successful payment
2. Redirected to CheckoutSuccess page
3. Verify success message displays
4. Verify session ID shown

**Check Upsell Section:**
- 3 upsell cards display:
  - VPS Upgrade
  - Cloud Backup
  - Professional Setup
- Quick links section:
  - Homepage
  - Client Area
  - Invoices
- Getting Started resources:
  - Migration Guide
  - SSL Setup
  - Control Panel Tour
  - Live Chat Support

### 7. Test Backend Processing

**Check PM2 Logs:**
```bash
pm2 logs mpanel-api --lines 100
```

**Verify:**
- Checkout session created
- Line items array includes all add-ons
- Webhook receives checkout.session.completed
- User created in database
- Subscription created
- Website provisioned
- Welcome email sent

**Database Checks:**
```sql
-- Check latest user
SELECT * FROM users ORDER BY created_at DESC LIMIT 1;

-- Check subscriptions
SELECT * FROM subscriptions WHERE user_id = <user_id>;

-- Check checkout session
SELECT * FROM checkout_sessions ORDER BY created_at DESC LIMIT 1;

-- Check metadata includes cartItems
SELECT metadata FROM checkout_sessions ORDER BY created_at DESC LIMIT 1;
```

### 8. Test Edge Cases

**Empty Cart:**
- Navigate to checkout with empty cart
- Verify message: "Your cart is empty"
- Upsells should not display

**Remove All Items:**
- Add items to cart
- Remove all items
- Verify cart empty state
- Verify checkout disabled

**Add Duplicate:**
- Add addon to cart from cart page
- Verify button disabled
- Try toggling same addon on checkout
- Should work (remove from cart)

**Browser Refresh:**
- Add items to cart
- Refresh page
- Verify cart persists (localStorage)
- Verify add-on buttons show correct state

**Mobile View:**
- Test on mobile device or dev tools
- Verify responsive grid (stacks to 1 column)
- Verify touch targets adequate
- Verify toggles work on touch

### 9. Test Type Safety

**Run Type Check:**
```bash
cd migrahosting-marketing-site/apps/website
npm run type-check
```

**Expected:**
- No TypeScript errors in:
  - UpsellAddonsSection.tsx
  - CheckoutUpsells.tsx
  - AfterPurchaseUpsells.tsx
  - cart.tsx
  - checkout.tsx
  - CheckoutSuccess.tsx
  - CartContext.tsx

### 10. Performance Testing

**Load Time:**
- Cart page should load < 1s
- Add-on images/icons load instantly (using emoji)
- No layout shift when add-ons appear

**Interaction:**
- "Add to Order" click instant response
- Toggle switches instant feedback
- Cart updates < 100ms

**Bundle Size:**
- Check if addons.json increases bundle significantly
- Verify tree-shaking working

## Test Data

### Test Credit Cards (Stripe Test Mode)

**Success:**
- `4242 4242 4242 4242` - Visa
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

**Failure:**
- `4000 0000 0000 0002` - Card declined
- `4000 0000 0000 9995` - Insufficient funds

### Test Users

**Account 1:**
- Email: test1@migrahosting.test
- Password: TestPass123!
- Plan: Premium Monthly
- Add-ons: SSL, Backups

**Account 2:**
- Email: test2@migrahosting.test
- Password: TestPass456!
- Plan: Business Yearly
- Add-ons: All 6

**Account 3:**
- Email: test3@migrahosting.test
- Password: TestPass789!
- Plan: Starter Monthly
- Add-ons: None

## Expected Results Summary

### Cart Page
- ✅ 6 add-on cards display
- ✅ "Add to Order" adds to cart
- ✅ Button state updates
- ✅ Cart shows add-ons with pricing
- ✅ Trust indicators visible

### Checkout Page
- ✅ All cart items displayed
- ✅ Add-on toggles functional
- ✅ Cart updates in real-time
- ✅ Totals calculate correctly
- ✅ Form validates properly
- ✅ Submits full cart data

### Backend
- ✅ Receives cartItems array
- ✅ Creates line items for all add-ons
- ✅ Stripe session includes everything
- ✅ Metadata stored correctly
- ✅ Webhook processes successfully

### Success Page
- ✅ Success message displays
- ✅ Upsell cards render
- ✅ Links functional
- ✅ Resources accessible

## Bug Reporting

If issues found, report with:

1. **Environment:**
   - Browser and version
   - Device (desktop/mobile)
   - Screen size

2. **Steps to Reproduce:**
   - Exact actions taken
   - Items in cart
   - Add-ons selected

3. **Expected vs Actual:**
   - What should happen
   - What actually happened

4. **Screenshots:**
   - UI state
   - Console errors
   - Network tab

5. **Console Logs:**
   - Copy full error messages
   - Include stack traces

6. **Network:**
   - API request payload
   - API response
   - Status codes

## Automated Testing (Future)

Consider adding:

```typescript
// Example test
describe('UpsellAddonsSection', () => {
  it('should add addon to cart when clicked', () => {
    // Test implementation
  });

  it('should disable button when addon in cart', () => {
    // Test implementation
  });

  it('should display correct pricing', () => {
    // Test implementation
  });
});
```

## Success Criteria

All tests pass when:

- ✅ No TypeScript errors
- ✅ No console errors
- ✅ All UI components render
- ✅ Cart state manages correctly
- ✅ API calls succeed
- ✅ Stripe receives all items
- ✅ Webhook completes successfully
- ✅ User provisioned correctly
- ✅ Email sent
- ✅ Mobile responsive
- ✅ Performance acceptable

---

**Testing Status:** Ready for QA
**Last Updated:** December 2024
