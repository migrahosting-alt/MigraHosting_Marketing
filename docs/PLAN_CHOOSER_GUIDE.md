# Plan Chooser Component Guide

## Overview

The **PlanChooser** component is an interactive decision tree that helps users find the right Migra product based on their needs. It asks 3 simple questions and suggests personalized plan recommendations using the centralized `pricingConfig.ts`.

## Where to Use

### Home Page
```tsx
import PlanChooser from "@/components/PlanChooser";

export default function HomePage() {
  return (
    <>
      {/* Hero section */}
      <section className="mt-16 max-w-6xl mx-auto px-4">
        <PlanChooser />
      </section>
      {/* Rest of home page */}
    </>
  );
}
```

### Dedicated "Help Me Choose" Page
```tsx
import PlanChooser from "@/components/PlanChooser";

export default function HelpMeChoosePage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8">
          Find Your Perfect Plan
        </h1>
        <PlanChooser />
      </div>
    </div>
  );
}
```

## How It Works

### Question Flow

**1. What are you trying to do?** (Use Case)
- Launch my first website → Shared Hosting + Email
- Build a WordPress site → Managed WordPress
- Start an online store → WooCommerce on WP Growth/Business
- Get business email only → MigraMail
- Host an app or API → VPS/Cloud
- Store files & backups → MigraDrive

**2. How comfortable are you with servers?** (Tech Level)
- I just want it simple → Managed services (Hosting, WordPress)
- Comfortable with basics → Mix of managed + VPS options
- I'm advanced / a developer → VPS, Cloud, root access

**3. How much traffic/usage do you expect?** (Traffic Level)
- Low → Starter/Essential plans
- Medium → Growth/Plus plans
- High → Business/Pro/Scale plans

### Decision Logic

#### First Website (`firstSite`)
- **Beginner + Any Traffic:**
  - Web Hosting Starter ($1.49-$7.95/mo)
  - Email Basic ($4.95/mo per mailbox)
  - *Why:* Simple, managed, includes free SSL and domain
  
- **Comfortable/Advanced:**
  - Web Hosting Premium ($2.49-$8.95/mo)
  - VPS Essential ($7.95/mo)
  - *Why:* More control, room to grow, can host multiple projects

#### WordPress Site (`wpSite`)
- **Low Traffic:**
  - WP Starter ($5.95-$16.95/mo)
  - *Why:* One site, blog, or local business with managed updates
  
- **Medium/High Traffic:**
  - WP Growth ($9.95-$24.95/mo)
  - *Why:* More PHP workers, storage for plugins and visitors

#### Online Store (`wpStore`)
- **Low/Medium Traffic:**
  - WP Growth ($9.95-$24.95/mo)
  - *Why:* Early-stage stores with regular traffic
  
- **High Traffic:**
  - WP Business ($19.95-$39.95/mo)
  - *Why:* Active stores, more resources, priority support

#### Email Only (`emailOnly`)
- **Low Traffic:**
  - Email Basic ($4.95/mo per mailbox)
  - *Why:* Solo founders, 1-3 people
  
- **Medium/High Traffic:**
  - Email Pro ($7.95/mo per mailbox)
  - *Why:* Teams that live in email

#### App or API (`appApi`)
- **Beginner (any traffic):**
  - WP Business first ($19.95-$39.95/mo)
  - *Why:* If your app can use WordPress (membership, SaaS landing)
  
- **All users get:**
  - VPS Plus/Pro ($11.95-$23.95/mo)
  - Cloud Start/Scale ($14.95-$39.95/mo)
  - *Why:* Root access, custom stacks, scalability

#### Storage (`storage`)
- **Low Traffic (personal):**
  - Storage Personal (250GB, $4.95/mo)
  - *Why:* Personal files, photos, archives
  
- **Medium Traffic (team):**
  - Storage Team (1TB, $9.95/mo)
  - *Why:* Small teams, client files, projects
  
- **High Traffic (business):**
  - Storage Business (5TB, $39.95/mo)
  - *Why:* Agencies, lots of media and backups

## Integration with Pricing Config

The component pulls all plan data from `src/config/pricingConfig.ts`:

```typescript
import {
  hostingPlans,
  wpPlans,
  mailPlans,
  vpsPlans,
  cloudPlans,
  storagePlans,
} from "@/config/pricingConfig";

// Lookup functions
function getHostingPlan(id: HostingPlanId) {
  return hostingPlans.plans.find((p) => p.id === id)!;
}

// Usage in logic
const host = getHostingPlan("starter");
suggestions.push({
  planName: host.name,
  priceLabel: formatPriceLabel(host.pricing),
  // ...
});
```

### Price Formatting

```typescript
function formatPriceLabel(
  pricing: Record<string, number>,
  context?: "longTerm" | "flexible"
): string {
  // For monthly + yearly (Email, VPS, Cloud, Storage)
  if (monthly != null && yearly != null) {
    return context === "longTerm"
      ? `from $${yearly.toFixed(2)}/mo (yearly)`
      : `from $${monthly.toFixed(2)}/mo (monthly)`;
  }
  
  // For 4 billing cycles (Hosting, WordPress)
  const min = lowestPrice(pricing);
  return `as low as $${min.toFixed(2)}/mo (with longer term)`;
}
```

## Styling & Design

### Color Scheme
- Background: `bg-slate-950/90` with `border-slate-800`
- Active selections:
  - Use case: Sky blue (`border-sky-500 bg-sky-500/10`)
  - Tech level: Emerald green (`border-emerald-500 bg-emerald-500/10`)
  - Traffic: Purple (`border-purple-500 bg-purple-500/10`)
- Suggestions: Slate cards with emerald pricing labels

### Responsive Design
- Mobile: Single column, full-width buttons
- Tablet: 2-column grid for use cases and suggestions
- Desktop: 3-column grid with hidden helper text on small screens

## Customization

### Add New Use Case
```typescript
// 1. Add to UseCase type
type UseCase = "firstSite" | "wpSite" | "newCase";

// 2. Add button in Question 1
{
  id: "newCase",
  label: "My new use case",
  description: "Short description here.",
}

// 3. Add logic in computeSuggestions
case "newCase": {
  const plan = getHostingPlan("premium");
  suggestions.push({
    id: "hosting-premium",
    product: "Web Hosting",
    planName: plan.name,
    tagline: "What this is for.",
    why: "Why choose this plan.",
    priceLabel: formatPriceLabel(plan.pricing as any, "longTerm"),
  });
  break;
}
```

### Adjust Logic
All decision logic is in the `computeSuggestions()` function. Modify the switch cases to change which plans are recommended based on user answers.

## Example Output

**User Selections:**
- Use case: "Build a WordPress site"
- Tech level: "I just want it simple"
- Traffic: "Low"

**Suggested Plan:**
```
┌─────────────────────────────────────┐
│ MANAGED WORDPRESS                   │
│ WP Starter        as low as $5.95/mo│
│ Best for one main site, blog, or    │
│ local business.                     │
│                                     │
│ We handle WordPress core and plugin │
│ updates, backups, and security so   │
│ your first site stays stable.      │
└─────────────────────────────────────┘
```

## Best Practices

1. **Place prominently** on the home page or create a dedicated route
2. **Test all combinations** to ensure logic matches user expectations
3. **Update when pricing changes** (component auto-pulls from `pricingConfig.ts`)
4. **Monitor user selections** to improve recommendations over time
5. **Keep "why" text concise** and focused on real benefits

## Next Steps

- Add to home page hero section or below pricing overview
- Create `/help-me-choose` route for dedicated page
- Consider adding links from suggestion cards to full product pages
- Track analytics on which paths users take most often
