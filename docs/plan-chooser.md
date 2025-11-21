# Migra Plan Chooser – How It Works

The Plan Chooser is a small wizard on the marketing site that helps visitors pick the right Migra product.

It asks three questions:

1. **What are you trying to do?** (use case)
2. **How comfortable are you with servers and configuration?** (tech level)
3. **How much traffic or usage do you expect?** (traffic level)

Based on those answers, it suggests 1–3 starting plans from:
- MigraHosting (shared hosting)
- MigraWP (managed WordPress)
- MigraMail (email)
- MigraVPS / MigraCloud (servers)
- MigraDrive / MigraStorage (cloud storage)

Each suggestion includes:
- Product type (Hosting, Managed WordPress, Email, etc.)
- Plan name
- Short tagline ("best for…")
- Explanation of **why** it's a fit
- A price summary (from pricingConfig.ts)
- A link to the correct product page

---

## Questions & Logic

### 1. Use Case

**Options:**

- **Launch my first website** → `firstSite`
- **Build a WordPress site** → `wpSite`
- **Start an online store** → `wpStore`
- **Get business email only** → `emailOnly`
- **Host an app or API** → `appApi`
- **Store files & backups** → `storage`

This decides the main product family:

- `firstSite` → Shared Hosting + optional Email  
- `wpSite` / `wpStore` → Managed WordPress  
- `emailOnly` → MigraMail  
- `appApi` → VPS / Cloud (plus Managed WP when appropriate)  
- `storage` → MigraDrive / MigraStorage  

---

### 2. Tech Level

**Options:**

- **Beginner** – "I just want it simple"
- **Comfortable** – "I can handle some settings"
- **Advanced** – "I'm a dev / fine with SSH & root"

This adjusts recommendations:

- **Beginner**:
  - Prefer: Shared Hosting, Managed WordPress, email, storage.
  - Only offer VPS/Cloud as a secondary suggestion.
- **Comfortable / Advanced**:
  - More likely to be offered VPS and Cloud directly for apps, APIs, and multi-site setups.

---

### 3. Traffic / Usage

**Options:**

- **Low** – Side project, local business, early-stage idea.
- **Medium** – Steady visitors, email list, active clients.
- **High** – Lots of users, paid customers, heavy API or store traffic.

This adjusts the **tier within each product**:

- Low → entry / mid tier (Starter, WP Starter, VPS Essential, MigraDrive Personal).
- Medium → middle tiers (Premium / WP Growth / VPS Plus / MigraCloud Start / MigraDrive Team).
- High → higher tiers (WP Business, VPS Pro, MigraCloud Scale, MigraDrive Business).

---

## Examples of Output

### Example 1 – "I want my first site"

- Use case: `firstSite`
- Tech: `beginner`
- Traffic: `low`

**Suggested:**

1. **Web Hosting – Starter**
   - Why: Easiest way to get a serious site online with free SSL and a free domain (yearly).
   - Link: `/hosting`

2. **Email – MigraMail Basic**
   - Why: Simple, cheap email on your domain.
   - Link: `/email`

---

### Example 2 – "I'm building a WooCommerce store"

- Use case: `wpStore`
- Tech: `comfortable`
- Traffic: `medium`

**Suggested:**

- **Managed WordPress – WP Growth**
  - Why: Good mix of resources and managed updates for a growing store.
  - Link: `/managed-wordpress`

If they choose "High" traffic, it bumps to **WP Business** instead.

---

### Example 3 – "I want to host an app or API"

- Use case: `appApi`
- Tech: `advanced`
- Traffic: `medium`

**Suggested:**

- **VPS – VPS Plus**
  - Why: Enough CPU/RAM for multi-site apps or APIs with root control.
  - Link: `/vps-cloud`

- **Cloud – MigraCloud Start**
  - Why: For more uptime and growth room as usage increases.
  - Link: `/vps-cloud`

If Tech is **beginner**, it also suggests **WP Business** first for app ideas that can run on WordPress (membership, courses, etc.).

---

### Example 4 – "I just need storage & backups"

- Use case: `storage`
- Tech: any
- Traffic: `low`

**Suggested:**

- **Cloud Storage – MigraDrive Personal**
  - Why: Enough for personal docs, photos, and archives.
  - Link: `/storage`

With `medium` and `high`, the chooser recommends **Team** and **Business** instead.

---

## How Pricing Ties In

All prices shown in the Plan Chooser come from:

`src/config/pricingConfig.ts`

That file is the **single source of truth** for:

- Shared Hosting prices
- Managed WP prices
- Email prices
- VPS & Cloud prices
- Storage prices

If you ever change pricing:

1. Update it in `pricingConfig.ts`
2. The Plan Chooser and individual pricing components can be refactored to read from that file, so the whole site stays consistent.

---

## How Sales/Support Should Use This

When talking to a customer, support or sales can mirror the same logic manually:

1. Ask:
   - "What are you trying to do?" (site, store, app, email, backups)
   - "How technical are you?"
   - "What kind of volume are you expecting?"

2. Based on the answers, recommend the same plans:
   - First site → Starter + MigraMail Basic
   - WordPress site → WP Starter or WP Growth
   - Store → WP Growth or WP Business
   - App/API → VPS Plus / VPS Pro / MigraCloud
   - Storage → MigraDrive Personal / Team / Business

3. If in doubt, start smaller and remind them they can upgrade as they grow.

This keeps both the **website** and the **human team** giving the same answers.
