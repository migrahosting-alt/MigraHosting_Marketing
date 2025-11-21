# COPILOT BRIEF – MANAGED WORDPRESS PAGE (MigraWP)

## Goal

Create a Managed WordPress marketing page that explains:
- **MigraWP Starter, Growth, Business, Agency** plans
- Why it's different from generic shared hosting
- Peace of mind: we handle updates, backups, and security

## Key Points

### Technology Stack
- Built on **OpenLiteSpeed + NVMe** storage, tuned for WordPress
- LSCache for WordPress (superior performance)
- Automatic core updates
- Plugin/theme updates according to configurable policy
- Daily backups with increasing retention (7–30 days by tier)
- **MigraGuard WordPress hardening** (firewall, login protection, malware scanning)
- **WooCommerce-ready tuning** on Business+ plans

### What We Manage
- WordPress core updates (automatic)
- Security updates (automatic)
- Plugin/theme updates (configurable policy)
- Performance tuning (cache, PHP, database optimization)
- Daily backups with 1-click restore
- Malware scanning & removal
- Uptime monitoring

## Page Structure

### 1. Hero Section

**Headline**: "Managed WordPress that just works."

**Subheadline**: "We handle updates, backups, and security so you can focus on clients and content."

**CTA Buttons**:
- Primary: "Choose a Plan"
- Secondary: "Talk to a WordPress expert"

---

### 2. Pricing Section

**Component**: `<ManagedWpPricingSection variant="landing" showIntro={true} />`

This includes:
- All 4 plan cards (Starter, Growth, Business, Agency)
- "What we manage for you" section at bottom
- Free site migrations callout

---

### 3. What We Manage for You

(Already included in pricing component, but can be expanded)

**Categories**:
- **Updates**: Core, plugins, themes, security patches
- **Performance**: Cache tuning, PHP optimization, database cleanup
- **Security**: Firewall rules, login protection, malware scanning
- **Backups**: Daily automated backups with 1-click restore (7-30 days retention)

---

### 4. Use Case Block

Show 4 customer types:

**Creators / Bloggers**
- 1-3 WordPress sites
- Focus on content, not tech
- Starter or Growth plan

**Local Businesses**
- Business website + blog
- May need WooCommerce later
- Growth or Business plan

**WooCommerce Stores**
- E-commerce sites with products
- Need performance + security
- Business plan (WooCommerce-optimized)

**Agencies**
- Hosting multiple client sites
- White-label options
- Agency plan (50 sites, client billing tools)

---

### 5. Difference from Shared Hosting

**Q: What's the difference between Shared Hosting and Managed WordPress?**

**A**: 
- **Shared Hosting** (MigraHosting): General-purpose, supports any PHP app, you manage WordPress updates
- **Managed WordPress** (MigraWP): WordPress-only, we handle updates/backups/security, optimized for WP performance

**When to choose Managed WordPress**:
- You want hands-off WordPress management
- You need staging environments for testing
- You're running WooCommerce (Business+ plans)
- You're an agency managing client sites

---

### 6. FAQ Section

#### Q: What's the difference between Shared Hosting and Managed WordPress?

See above.

#### Q: Can you migrate my existing WordPress site?

**A**: Yes! All plans include free white-glove migrations. We handle files, database, plugins, themes, and DNS. Zero downtime guaranteed. Just provide us with your current host credentials.

#### Q: Do I get staging sites?

**A**: Yes! Every plan includes staging environments:
- Starter: 1 staging site
- Growth: 3 staging sites
- Business: 10 staging sites
- Agency: 50 staging sites

Test updates, plugins, and design changes before pushing to production.

#### Q: What happens if a plugin breaks after an update?

**A**: We test updates in your staging environment first (if configured). If something breaks in production, we have daily backups and can roll back within minutes. Our support team monitors for issues and will proactively reach out if we detect problems.

#### Q: Is WooCommerce supported?

**A**: Yes! All plans support WooCommerce, but **Business and Agency plans** get WooCommerce-specific optimizations:
- Database query tuning for product catalogs
- Cart/checkout performance optimization
- Session handling improvements
- Payment gateway compatibility testing

---

## Tone

- **Reassuring**: Focus on peace of mind
- **Hands-off**: Emphasize that we handle the technical stuff
- **Not the cheapest**: "We're not the cheapest WordPress host, but we're fair and hands-on"
- **Expert support**: Real WordPress technicians, not generic support

## Competitor Context

**vs WP Engine**:
- 50% lower cost for similar features
- More staging environments per tier
- Real human support (not just chatbots)

**vs Kinsta**:
- 40% cheaper on average
- Longer backup retention
- No visitor overage fees

**vs Flywheel**:
- Better value for growing sites
- WooCommerce optimization on Business+
- Phone support on Business+ plans

---

## Technical Notes

### File Locations
```
products/migrawp/plans/wp-plans.json
products/migrawp/ui/ManagedWpPricingSection.tsx
products/migrawp/docs/COPILOT_BRIEF_MANAGED_WORDPRESS.md
```

### Routing
Page should be accessible at `/managed-wordpress` or `/wordpress`.

### SEO Meta
```tsx
<title>Managed WordPress Hosting | MigraWP - Hands-Off WordPress</title>
<meta name="description" content="We handle WordPress updates, backups, and security. OpenLiteSpeed + NVMe storage. Free site migrations on all plans." />
```

---

**Last Updated**: November 16, 2025  
**Product Owner**: MigraWP Team  
**Maintained by**: Product & Engineering
