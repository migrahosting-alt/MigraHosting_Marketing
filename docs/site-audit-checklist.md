# Marketing Site Audit Checklist

## Routes & Screens
- [ ] Home (`/`)
- [ ] Pricing (`/pricing`)
- [ ] Hosting (`/hosting`)
- [ ] Email (`/email`)
- [ ] Managed WordPress (`/managed-wordpress`)
- [ ] VPS Cloud (`/vps-cloud`)
- [ ] Storage (`/storage`)
- [ ] Domains (`/domains`)
- [ ] Domain Transfer (`/domains/transfer`)
- [ ] Features (`/features`)
- [ ] Support (`/support`)
- [ ] About (`/about`)
- [ ] Terms (`/terms`)
- [ ] Privacy (`/privacy`)
- [ ] Cookies (`/cookies`)
- [ ] SLA (`/sla`)
- [ ] FAQ (`/faq`)
- [ ] Status (`/status`)
- [ ] Blog List (`/blog`)
- [ ] Blog Detail (`/blog/:slug`)
- [ ] Contact (`/contact`)
- [ ] Signup (`/signup`)
- [ ] Cart (`/cart`)
- [ ] Checkout (`/checkout`)
- [ ] Checkout Success (`/checkout/success`)
- [ ] Domains landing extras (Domain search widget)
- [ ] Not Found (`/*`)

## Shared Components / Systems
- [x] Header & mobile nav / dropdowns
- [x] Footer links & badges
- [ ] CookieBanner
- [ ] MigraGuardian widget integration
- [ ] PlanChooser / PricingGrid
- [ ] EnhancedDomainSearch
- [ ] SystemStatusBadge
- [ ] AFM Guardian chat components
- [ ] Context providers (Cart, Auth, etc.)
- [ ] API clients (`lib/mpanel-api`, `lib/catalog`, etc.)

## CTA & Hero Links
- [x] Home feature cards target Features anchors
- [x] Support "Browse Docs" CTA scrolls to docs section
- [x] PricingGrid "Compare Plans" CTA points to `/pricing#compare`
- [x] VPS Cloud hero/CTA buttons render cleanly and target `#pricing`
- [x] Hosting hero + CTA buttons target onsite pricing section `#pricing`
- [x] Managed WordPress hero + CTA buttons target onsite pricing section `#pricing`
- [x] Email hero + CTA buttons target onsite pricing section `#pricing`

## Forms & Flows
- [ ] Domain search (home/hero)
- [ ] Contact form (`Contact.jsx`)
- [ ] Signup form (`Signup.jsx`)
- [ ] Cart actions (add/remove/quantity)
- [ ] Checkout (Stripe) including trial logic
- [ ] Newsletter/CTA forms (if any)
- [ ] Support/Migration request forms

Use this checklist to mark off sections as they’re audited and updated.
