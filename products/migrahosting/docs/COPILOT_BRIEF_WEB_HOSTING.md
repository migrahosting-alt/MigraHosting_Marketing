# COPILOT BRIEF – WEB HOSTING PAGE (MigraHosting)

## Goal

Create a marketing page that sells MigraHosting shared hosting plans:
- **Student** (free with academic verification)
- **Starter** (personal sites, 1 website)
- **Premium** (most popular, up to 50 websites)
- **Business** (agencies, unlimited websites)

## Context

### Existing Components

We already have these reusable components in the `products/migrahosting/` directory:

1. **HostingPricingSection.tsx** - Displays pricing cards for all 4 plans with billing term selector
2. **HostingCompareSection.tsx** - Shows MigraHosting advantages vs GoDaddy, HostGator, Bluehost
3. **shared-plans.json** - Complete plan data including features, pricing, and bonuses

### Pricing Structure

All plans support multiple billing terms:
- **Monthly**: Higher per-month cost (+ $2.85 setup fee on first invoice for non-Student plans)
- **Annually**: 1-year commitment
- **Biennially**: 2-year commitment (better savings)
- **Triennially**: 3-year commitment (best value)

**Display pricing**: We show the per-month effective rate (e.g., "$2.49/mo" for 3-year Starter = $89.64 total)

### Key Bonuses

On **yearly+ plans** for **Starter and above**:
- ✅ 1-year free domain (.com, .net, .org, .info, .biz)
- ✅ Free WHOIS privacy (keep contact info private)
- ✅ Free domain forwarding (redirect domains to your main site)

All plans include:
- Free SSL certificates (Let's Encrypt)
- Daily automated backups (3-30 days retention depending on tier)
- Dedicated mail server (MigraMail, not shared with web hosting)
- MigraGuard basic security (spam, malware, DDoS)
- 99.9% uptime guarantee

## Page Structure

### 1. Hero Section

**Headline**: "Fast NVMe Hosting with Real Support"

**Subheadline**: Mention these key selling points:
- Free SSL
- Daily backups
- Free domain on yearly+ plans
- Fair pricing (transparent, no fake promos)

**CTA Buttons**:
- Primary: "Start Hosting" (links to #pricing anchor)
- Secondary: "View All Plans" (links to #pricing anchor)

**Tone**: Confident but friendly. Make it clear we're slightly cheaper than big brands, not ultra-cheap.

---

### 2. Key Features Grid

After the hero, show a 3-column grid of benefits (6 items total):

- **Blazing Fast**: NVMe SSDs, HTTP/3, global CDN
- **Enterprise Security**: DDoS protection, WAF, automatic SSL, malware scanning
- **Transparent Pricing**: No hidden fees, no surprise charges
- **99.9% Uptime**: Multi-datacenter redundancy with automatic failover
- **Expert Support**: 24/7/365 technical support from real engineers
- **Developer-First**: Git deployment, SSH/SFTP, WP-CLI, Composer, staging environments

**Visual Treatment**: Icon + title + description in cards with hover effects.

---

### 3. Pricing Section

**Component**: `<HostingPricingSection variant="landing" showIntro={true} />`

This component already includes:
- Pricing cards for all 4 plans
- Intro text with headline "Simple, transparent pricing"
- Callout: "Get a free 1-year domain on yearly Starter+ plans"
- "What's included in every hosting plan" section at the bottom

**Location**: Use the `id="pricing"` anchor so hero CTAs can scroll to it.

---

### 4. Compare Section

**Component**: `<HostingCompareSection />`

This component shows:
- 3 comparison cards (vs GoDaddy, vs HostGator, vs Bluehost)
- Each card lists 5 advantages MigraHosting has over that competitor
- "Why choose MigraHosting?" callout box at the bottom

**Key Messages**:
- ✅ Transparent pricing (no renewal shock)
- ✅ Premium-but-affordable (better tech, fair prices)
- ✅ Real humans + AI (MigraAgent + human technicians)
- ✅ Security-first (MigraGuard included)

---

### 5. Free Migration Section

**Headline**: "Free white-glove migration"

**Subheadline**: "Switching hosts is stressful. We handle the entire migration process for you."

**4-Step Process** (displayed as numbered circles):
1. **Share your current host details**: Provide cPanel/FTP credentials or backup archive
2. **We copy everything**: Files, databases, emails, DNS records—zero data loss
3. **We test thoroughly**: Your site runs on our servers in staging first
4. **We switch DNS**: Update nameservers, handle DNS propagation, zero downtime

**CTA**: "Start Your Migration" button

**Note**: Premium and Business plans get free migrations. Starter can add for $49 one-time.

---

### 6. FAQ Section

Use an accordion (details/summary) for these 4 questions:

#### Q: Do prices increase after renewal?

**A**: No. We show you the real renewal price upfront. If you sign up for 3-year Starter at $1.49/mo, you'll renew at $1.49/mo (subject to minor inflation adjustments, announced 60 days in advance). Unlike big hosts that advertise "$2.99/mo*" then charge $15.99/mo at renewal.

#### Q: Is email included?

**A**: Yes! Every plan includes email hosting on our dedicated MigraMail server (not shared with web hosting). Student gets 1 mailbox, Starter gets 10, Premium gets 50, Business gets unlimited. All mailboxes include spam filtering via MigraGuard.

#### Q: Can I upgrade between plans?

**A**: Absolutely. Upgrade anytime from your mPanel dashboard. We'll pro-rate your current plan and apply the credit to the new one. No downtime, no hassle.

#### Q: Do you migrate my site for free?

**A**: Yes! Premium and Business plans include free white-glove migrations. Starter plans can add migration for $49 one-time. We handle everything: files, databases, emails, and DNS. Zero downtime guaranteed.

---

### 7. Final CTA Section

**Headline**: "Ready to get started?"

**Subheadline**: "Choose your plan and start hosting today. 30-day money-back guarantee."

**CTA Buttons**:
- Primary: "View Plans" (links to #pricing)
- Secondary: "Chat with Us" (links to /support)

---

## Tone & Messaging Guidelines

### Tone of Voice

- **Confident but Friendly**: We know our stuff, but we're not arrogant.
- **Transparent**: Always show real prices, no fine print surprises.
- **Helpful**: Focus on solving customer problems, not just listing features.
- **Premium-but-Affordable**: Emphasize we're cheaper than big brands, but still high-quality (not ultra-cheap scams).

### Key Messages to Emphasize

1. **"Transparent pricing that doesn't play games"**  
   → We show real renewal rates upfront (vs competitors' fake "$2.99/mo*" promos)

2. **"Real support from real humans"**  
   → 24/7 human technicians + MigraAgent AI (vs outsourced call centers and chatbots)

3. **"Premium hosting at fair prices"**  
   → NVMe SSDs, dedicated mail server, MigraGuard security—all included

4. **"Free domain, free SSL, free migrations"**  
   → On yearly+ Starter+ plans (competitors charge extra)

### What to Avoid

- ❌ "Buy Now" / "Limited Time Offer" / "Act Fast" (too salesy, feels scammy)
- ❌ "Cheapest hosting on the web" (we're not ultra-cheap, we're fair)
- ❌ Fake urgency (countdown timers, "only 3 spots left")
- ❌ Over-promising (don't say "unlimited" unless it's actually unlimited)

---

## Technical Implementation Notes

### File Locations

```
apps/website/src/pages/Hosting.tsx           ← Main page component
products/migrahosting/ui/HostingPricingSection.tsx
products/migrahosting/ui/HostingCompareSection.tsx
products/migrahosting/shared-hosting/plans/shared-plans.json
```

### Import Pattern

```tsx
import HostingPricingSection from "../../../../products/migrahosting/ui/HostingPricingSection";
import HostingCompareSection from "../../../../products/migrahosting/ui/HostingCompareSection";
```

### Routing

The page should be accessible at `/hosting` in the React Router config.

### SEO Meta Tags

```tsx
<Helmet>
  <title>Web Hosting | MigraHosting - Fast NVMe Hosting with Real Support</title>
  <meta
    name="description"
    content="Premium shared hosting with NVMe SSDs, free SSL, daily backups, and transparent pricing. Get a free 1-year domain on yearly plans. No fake promos, no renewal shock."
  />
</Helmet>
```

---

## Design Guidelines

### Color Palette

- **Primary Gradient**: `from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584]` (purple to pink)
- **Background**: `bg-[#050816]` (dark navy blue)
- **Borders**: `border-white/10` (subtle white at 10% opacity)
- **Cards**: `bg-white/5` (subtle white tint)
- **Hover States**: `hover:bg-white/10` or `hover:brightness-110`

### Typography

- **Headlines**: `font-display text-3xl font-extrabold sm:text-4xl`
- **Subheadlines**: `text-white/80`
- **Body Text**: `text-white/80` or `text-slate-300`

### Buttons

**Primary CTA** (gradient):
```tsx
className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-8 font-semibold hover:brightness-110"
```

**Secondary CTA** (outlined):
```tsx
className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 font-semibold hover:bg-white/20"
```

### Icons

Use inline SVGs for icons (consistent with existing code):
- Checkmarks: `<CheckIcon />` (20x6L9 17l-5-5)
- Lightning bolt: `<ZapIcon />` (polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2")
- Shield: `<ShieldIcon />` (M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z)

---

## Success Metrics

When building this page, optimize for:

1. **Conversion Rate**: % of visitors who click "Start Hosting" or "View Plans"
2. **Engagement**: Time on page, scroll depth (did they reach the FAQ?)
3. **Trust Signals**: Highlight the 30-day money-back guarantee, 99.9% uptime SLA

**A/B Testing Opportunities**:
- Hero headline ("Fast NVMe Hosting" vs "Hosting Without the BS")
- CTA button text ("Start Hosting" vs "Get Started" vs "View Plans")
- Pricing display (monthly vs annual default)

---

## Competitor Comparison Reference

### GoDaddy
- **What they do wrong**: Fake "$2.99/mo*" promos that become $15.99/mo at renewal
- **What we do better**: Transparent pricing, NVMe SSDs (vs HDD), included backups

### HostGator
- **What they do wrong**: Charge for WHOIS privacy ($12.99/year), slow SSD storage
- **What we do better**: Free WHOIS, faster NVMe storage, better support

### Bluehost
- **What they do wrong**: Renewal price shock, small storage quotas (10GB Starter)
- **What we do better**: Honest renewal rates, 30GB Starter, dedicated mail server

---

## Content Checklist

When building or updating the Web Hosting page, ensure:

- ✅ Hero headline emphasizes "Fast NVMe Hosting with Real Support"
- ✅ Hero subheadline mentions free SSL, daily backups, free domain
- ✅ Pricing section uses `<HostingPricingSection />` component
- ✅ Comparison section uses `<HostingCompareSection />` component
- ✅ FAQ section answers the 4 key questions (renewal pricing, email, upgrades, migrations)
- ✅ Final CTA mentions "30-day money-back guarantee"
- ✅ All links work (especially #pricing anchor and /support link)
- ✅ Mobile responsive (test on phone/tablet)

---

## Questions & Feedback

If any section is unclear or you need additional components, please ask! This brief should give you everything needed to build or update the Web Hosting page.

**Maintained by**: MigraHosting Product Team  
**Last Updated**: November 16, 2025  
**Next Review**: February 1, 2026
