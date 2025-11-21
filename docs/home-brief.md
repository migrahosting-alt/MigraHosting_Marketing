# COPILOT BRIEF – MIGRA MAIN HOME PAGE

## Goal
Build the main MigraHosting home page that introduces the whole **Migra ecosystem**:
- Shared Hosting (MigraHosting)
- Managed WordPress (MigraWP)
- Email (MigraMail)
- VPS & Cloud (MigraVPS / MigraCloud)
- Cloud Storage (MigraDrive / MigraStorage)

## Brand Positioning
- **Premium-but-affordable**: Pricing slightly lower than big competitors, but not "too cheap"
- **Transparent**: No fake promo prices that double at renewal
- **Real humans + AI tools**: MigraAgent, MigraGuard helping monitor, secure, and fix things
- **One ecosystem**: Hosting, email, servers, and storage all working together

## Overall Layout

### 1. HERO SECTION
**Headline**: "Your Hosting, Email, Servers and Storage — All in One Migra Ecosystem."

**Subheadline**: "NVMe hosting, managed WordPress, professional email, VPS, cloud, and storage. Tuned and secured by the same team."

**Primary CTA**: "View Hosting Plans"  
**Secondary CTA**: "Explore All Products"

**Badges under CTAs**:
- NVMe SSD
- Daily Backups
- Free SSL
- MigraGuard Security

---

### 2. PRODUCT GRID – THE MIGRA STACK
Show 5 cards with short descriptions and 'Learn more' links:

**MigraHosting – Shared Hosting**
- "Fast NVMe shared hosting with free SSL, daily backups, and 1-year free domain on yearly plans."
- Link: `/hosting`

**MigraWP – Managed WordPress**
- "We manage updates, backups, and security so your WordPress just works."
- Link: `/managed-wordpress`

**MigraMail – Professional Email**
- "Email on your domain with proper SPF, DKIM, and DMARC."
- Link: `/email`

**MigraVPS & MigraCloud – Servers**
- "NVMe-powered VPS and cloud servers for apps, APIs, and busy sites."
- Link: `/vps-cloud`

**MigraDrive – Cloud Storage**
- "Store docs, photos, and backups in MigraDrive with S3-compatible access."
- Link: `/storage`

---

### 3. QUICK PRICING HIGHLIGHTS
Below the product grid, add a small section like:

- "Shared hosting from **$1.49/mo** (3-year term)" → link to /hosting
- "Managed WordPress from **$6.95/mo** (3-year term)" → link to /managed-wordpress
- "Email from **$1.20/mailbox/mo** (yearly)" → link to /email
- "VPS from **$6.95/mo** (yearly)" → link to /vps-cloud
- "Cloud storage from **$3.95/mo** (yearly)" → link to /storage

These use the real prices from our product plan files.

---

### 4. "WHY MIGRA VS BIG HOSTS" SECTION
3–4 bullet groups comparing Migra to big competitors:

**Honest pricing**:
- "Slightly cheaper than big brands, no 'promo then double' renewal tricks."

**Real infrastructure**:
- "NVMe storage, dedicated mail server, Proxmox-based VPS and cloud."

**Security-first**:
- "MigraGuard layers for spam, brute-force, and basic malware protection."

**Ecosystem**:
- "Everything under one roof: hosting, email, servers, and storage that talk to each other."

---

### 5. ECOSYSTEM DIAGRAM / TEXT BLOCK
Describe how pieces work together:

- Hosting sites → can back up to MigraDrive
- Sites and clients → use MigraMail for email
- Bigger apps → move to MigraVPS / MigraCloud
- Everything is managed and monitored via mPanel and MigraGuard

---

### 6. SOCIAL PROOF / TRUST
Placeholder for future:
- Customer logos
- Short testimonials
- Uptime / performance reference

---

### 7. FINAL CTA STRIP
**Headline**: "Ready to move everything under one roof?"

**Buttons**:
- "Start with Hosting"
- "Talk to Sales / Support"

---

## Tone
- Confident and clear
- No over-hype
- Emphasize **reliability, clarity, and that this is a serious hosting company, not a cheap reseller**

## Technical Notes

### File Location
```
apps/website/src/pages/Home.tsx (or index route)
docs/home-brief.md
```

### Routing
Should be accessible at `/` (root)

### SEO Meta
```tsx
<title>MigraHosting - Hosting, Email, VPS & Cloud Storage Ecosystem</title>
<meta name="description" content="NVMe hosting, managed WordPress, professional email, VPS/cloud servers, and storage. All in one ecosystem. Transparent pricing, real support." />
```

---
**Last Updated**: November 16, 2025
