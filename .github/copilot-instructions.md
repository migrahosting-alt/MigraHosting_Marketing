# MigraHosting Marketing Website - GitHub Copilot Instructions

**Project**: MigraHosting Marketing Website  
**Control Panel Integration**: mPanel v1.0.0 (http://localhost:2271)  
**Last Updated**: November 23, 2025

---

## ⚠️ CRITICAL: Deployment & Build Process

### ✅ ALWAYS Use This Deployment Method
```bash
./deploy-to-srv1.sh        # Production deploy (builds + uploads)
```

### ✅ Build Commands
```bash
yarn build                 # Builds to apps/website/dist/
yarn workspace @migrahosting/website build  # Same as above
```

### 🚫 NEVER Use These
```bash
npm run build              # OLD/BROKEN - used to create dual bundles
cd apps/website && npm run build && cd ../.. && mkdir -p dist && cp -r apps/website/dist/* dist/
```

### 📁 Build Output Locations
- ✅ **Correct**: `apps/website/dist/` (single source of truth)
- ❌ **Never use**: Top-level `/dist/` (deleted, gitignored)

### 🐛 Why This Matters
Previous dual-build system caused:
- Old bundles (index-CfEDkCjL.js) being deployed alongside new ones (index-Cz4CRS3V.js)
- Browser loading wrong bundle with outdated code
- "Domain-only checkout coming soon" message persisting after fix
- Environment variables not being applied

### 🔧 What Was Fixed (Nov 23, 2025)
1. Removed top-level `dist/` folder and added to `.gitignore`
2. Simplified `package.json` "build" script to only build workspace
3. Updated `deploy-to-srv1.sh` to deploy directly from `apps/website/dist/`
4. Added `yarn deploy` shortcut

---

## 🎯 Project Overview

This is the **customer-facing marketing website** for MigraHosting, a modern hosting provider. It's a React 18 + Vite application that integrates with the **mPanel control panel** for account provisioning, billing, and service management.

**Marketing Website Purpose**:
- Customer acquisition (landing pages, pricing, features)
- Lead generation (contact forms, signups, demos)
- Customer onboarding (signup → payment → control panel account)
- Product catalog sync with mPanel
- Real-time system status display
- Marketing analytics (UTM tracking, conversions)

**Architecture**:
- **Frontend**: React 18 + Vite + Tailwind CSS (port 5173)
- **Backend API**: Node.js Express (port 4242) for Stripe checkout
- **Control Panel**: mPanel (port 2271) - separate application
- **Database**: SQLite for marketing data
- **Payments**: Stripe Checkout integration

---

## 🏗️ Tech Stack & Structure

### Current Stack
```
Marketing Website (This Repo)
├── Frontend: React 18 + Vite + TypeScript + Tailwind CSS
├── Backend: Node.js Express API (Stripe integration)
├── State: React Context (Cart, Auth)
├── Routing: React Router 6
├── Forms: React Hook Form + validation
├── UI: Custom components with Tailwind
└── Deployment: Vercel/Netlify ready

mPanel Control Panel (Separate Repo)
├── Backend: Node.js Express (port 2271)
├── Frontend: React admin panel
├── Database: PostgreSQL multi-tenant
└── Features: Hosting management, billing, AI support
```

### Directory Structure
```
apps/website/src/
├── pages/           # Route components (Home, Pricing, Features, etc.)
├── components/      # Reusable UI (Header, Footer, Cards, etc.)
├── context/         # React contexts (CartContext, AuthContext)
├── lib/            # Utilities (API clients, helpers)
├── hooks/          # Custom React hooks
└── styles/         # Tailwind config

server/
├── index.js        # Express server for Stripe checkout
├── stripe-webhook.js
└── lib/

public/
└── brand/          # Logos, favicons
```

---

## 🔌 mPanel Integration

### API Connection Setup

**Environment Variables** (`.env.local`):
```env
# mPanel Control Panel API
VITE_MPANEL_API_URL=http://localhost:2271/api
VITE_MPANEL_CONTROL_PANEL_URL=http://localhost:2271

# Backend API (Stripe)
VITE_API_BASE_URL=http://localhost:4242

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### API Client Pattern

```typescript
// lib/mpanel-api.ts (create this)
const MPANEL_API_URL = import.meta.env.VITE_MPANEL_API_URL || 'http://localhost:2271/api';

export const mpanelApi = {
  // Product catalog
  async getProducts(category?: string) {
    const url = category 
      ? `${MPANEL_API_URL}/marketing-api/products/catalog?category=${category}`
      : `${MPANEL_API_URL}/marketing-api/products/catalog`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  // System status
  async getSystemStatus() {
    const response = await fetch(`${MPANEL_API_URL}/marketing-api/status/system`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  },

  // Account creation (via backend)
  async createAccount(data: CreateAccountRequest) {
    const response = await fetch('/api/accounts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Account creation failed');
    return response.json();
  },
};
```

---

## 🛠️ Development Workflows

### Starting the Development Environment

**1. Start Marketing Website (Frontend)**:
```bash
# In project root
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site
yarn workspace @migrahosting/website dev
# Runs on http://localhost:5173
```

**2. Start Backend API (Stripe)**:
```bash
# In server directory
cd server
node index.js
# Runs on http://localhost:4242
```

**3. Start mPanel Control Panel** (for full integration):
```bash
# In mPanel repo
cd /home/bonex/MigraWeb/MigraHosting/dev/migra-panel
docker compose up -d  # Start PostgreSQL, Redis, MinIO
npm run dev           # Start backend (port 2271)
cd frontend && npm run dev  # Start frontend (port 2272)
```

### Quick Commands

```bash
# Install dependencies
yarn install

# Development
yarn dev                                      # Start dev server (localhost:5173)
yarn workspace @migrahosting/website dev      # Same as above

# Production Build & Deploy
./deploy-to-srv1.sh                          # ✅ ONE-COMMAND DEPLOY
yarn build                                   # Build only (to apps/website/dist/)
yarn deploy                                  # Alias for ./deploy-to-srv1.sh

# Backend API (Stripe)
cd server && node index.js                   # Start on port 4242

# Lint
yarn workspace @migrahosting/website lint
```

### Manual Deployment (if script unavailable)
```bash
# 1. Build locally
rm -rf apps/website/dist
yarn workspace @migrahosting/website build

# 2. Deploy to server
rsync -avz --delete apps/website/dist/ root@srv1:/var/www/migrahosting.com/html/
```

---

## 🎨 Project-Specific Conventions

### Component Patterns

**Page Components** (`src/pages/`):
- One file per route (e.g., `Pricing.tsx`, `Features.tsx`)
- Include Header/Footer or use layout wrapper
- Use Helmet for SEO meta tags
- Export default function

**Reusable Components** (`src/components/`):
- Small, focused components (Button, Card, Badge)
- Accept props with TypeScript interfaces
- Use Tailwind for styling
- Export named functions

**Example Component**:
```typescript
// components/PricingCard.tsx
interface PricingCardProps {
  plan: {
    name: string;
    price: number;
    features: string[];
  };
  onSelect: (planId: string) => void;
}

export function PricingCard({ plan, onSelect }: PricingCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-2xl font-bold">{plan.name}</h3>
      <div className="text-4xl font-bold text-[#8A4DFF]">
        ${plan.price}<span className="text-lg">/mo</span>
      </div>
      <ul className="space-y-2">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-400" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan.id)}
        className="w-full rounded-xl bg-gradient-to-r from-[#6A5CFF] to-[#8A4DFF] py-3"
      >
        Get Started
      </button>
    </div>
  );
}
```

### Styling Guidelines

**Tailwind CSS Patterns**:
- **Backgrounds**: `bg-gradient-to-b from-slate-900 via-slate-800 to-black`
- **Cards**: `rounded-2xl border border-white/10 bg-white/5 p-8`
- **Buttons**: `rounded-xl bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584]`
- **Text**: `text-white`, `text-white/70` (for muted), `text-[#8A4DFF]` (brand purple)
- **Spacing**: `py-20` for sections, `gap-8` for grids
- **Hover**: `hover:brightness-110`, `hover:bg-white/10`

**Brand Colors**:
```javascript
const brandColors = {
  purple: '#6A5CFF',
  purpleDark: '#8A4DFF',
  pink: '#FF6584',
  slate: {
    900: '#0f172a',
    800: '#1e293b',
  }
};
```

### State Management

**Cart Context** (`context/CartContext.tsx`):
```typescript
const { items, addItem, removeItem, totalQuantity, clear } = useCart();
```

**Auth Context** (if implementing):
```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

---

## 🔐 Security Best Practices

### API Key Protection

**❌ NEVER DO THIS**:
```typescript
// DON'T expose API keys in frontend
const apiKey = 'mk_secret_key_here'; // WRONG!
```

**✅ CORRECT APPROACH**:
```typescript
// Backend API route (server/index.js)
app.post('/api/accounts/create', async (req, res) => {
  const response = await fetch('http://localhost:2271/api/marketing-api/accounts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.MPANEL_API_KEY, // Server-side only
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
});
```

### Environment Variables

- **Public** (VITE_*): Safe for frontend (URLs, publishable keys)
- **Private**: Backend only (API keys, secrets)
- Never commit `.env` files
- Use `.env.example` for documentation

---

## 📊 Analytics & Tracking

### UTM Parameter Tracking

```typescript
// lib/analytics.ts
export function captureUTMParams() {
  const params = new URLSearchParams(window.location.search);
  const utmData = {
    campaign: params.get('utm_campaign'),
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    content: params.get('utm_content'),
    term: params.get('utm_term'),
  };
  
  // Store in localStorage (30-day persistence)
  Object.entries(utmData).forEach(([key, value]) => {
    if (value) localStorage.setItem(`utm_${key}`, value);
  });
  
  return utmData;
}

// Call in main App component
useEffect(() => {
  captureUTMParams();
}, []);
```

### Conversion Tracking

```typescript
// lib/conversions.ts
export function trackSignup(email: string, plan: string) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'sign_up', {
      method: 'Email',
      email,
      plan,
    });
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'Lead', { email, plan });
  }
}
```

---

## 🚀 Common Integration Patterns

### 1. Product Catalog Sync

```typescript
// pages/Pricing.tsx
import { useQuery } from '@tanstack/react-query';
import { mpanelApi } from '@/lib/mpanel-api';

export default function PricingPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'shared-hosting'],
    queryFn: () => mpanelApi.getProducts('shared-hosting'),
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products?.data.map(plan => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
```

### 2. Signup Flow with mPanel

```typescript
// pages/Signup.tsx
async function handleSignup(formData) {
  try {
    // 1. Get UTM params from localStorage
    const utmParams = {
      campaign: localStorage.getItem('utm_campaign'),
      source: localStorage.getItem('utm_source'),
      medium: localStorage.getItem('utm_medium'),
    };
    
    // 2. Create account in mPanel (via backend)
    const response = await fetch('/api/accounts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        utmParams,
        marketingSource: 'website',
      }),
    });
    
    const result = await response.json();
    
    // 3. Redirect to control panel for password setup
    window.location.href = `http://localhost:2271/set-password?token=${result.data.resetToken}`;
    
  } catch (error) {
    console.error('Signup failed:', error);
    toast.error('Signup failed. Please try again.');
  }
}
```

### 3. System Status Display

```typescript
// components/StatusBadge.tsx
import { useQuery } from '@tanstack/react-query';
import { mpanelApi } from '@/lib/mpanel-api';

export function SystemStatusBadge() {
  const { data } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => mpanelApi.getSystemStatus(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const status = data?.data.status;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full px-3 py-1",
      status === 'operational' && "bg-green-500/20 text-green-400",
      status === 'degraded' && "bg-yellow-500/20 text-yellow-400",
      status === 'major_outage' && "bg-red-500/20 text-red-400"
    )}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {status === 'operational' ? 'All Systems Operational' : 
       status === 'degraded' ? 'Degraded Performance' : 
       'Major Outage'}
    </div>
  );
}
```

---

## 🧪 Testing Patterns

### Component Testing

```typescript
// components/__tests__/PricingCard.test.tsx
import { render, screen } from '@testing-library/react';
import { PricingCard } from '../PricingCard';

test('renders plan name and price', () => {
  const plan = {
    id: '1',
    name: 'Starter',
    price: 9.99,
    features: ['10 GB Storage', 'Free SSL'],
  };
  
  render(<PricingCard plan={plan} onSelect={() => {}} />);
  
  expect(screen.getByText('Starter')).toBeInTheDocument();
  expect(screen.getByText('$9.99')).toBeInTheDocument();
});
```

---

## 📦 Key Files Reference

**Core Application**:
- `apps/website/src/App.jsx` - Main app component, routing
- `apps/website/src/main.tsx` - Entry point
- `apps/website/src/index.html` - HTML template

**Pages** (most important):
- `src/pages/Home.jsx` - Homepage
- `src/pages/pricing.tsx` - Pricing page (integrates with mPanel)
- `src/pages/Hosting.tsx` - Hosting features
- `src/pages/checkout.tsx` - Checkout flow (Stripe + language selector)
- `src/pages/Signup.jsx` - Student signup form

**Components**:
- `src/components/Header.jsx` - Main navigation (with inline SVG logo)
- `src/components/Footer.jsx` - Site footer
- `src/components/MigraGuardianWidget.tsx` - Chat support widget
- `src/components/FallbackChat.tsx` - Fallback chat when mPanel offline

**Backend**:
- `server/index.js` - Express API for Stripe checkout
- `server/stripe-webhook.js` - Stripe webhook handler

---

## 🎯 Common Tasks for Copilot

### Adding a New Page

1. Create file in `src/pages/NewPage.tsx`
2. Add route in `src/App.jsx`
3. Use Header/Footer layout
4. Follow Tailwind styling patterns

### Integrating with mPanel API

1. Add endpoint to `lib/mpanel-api.ts`
2. Use TanStack Query for data fetching
3. Handle loading/error states
4. Cache appropriately (1 hour for products, 30s for status)

### Styling a Component

1. Use existing Tailwind patterns from other components
2. Brand colors: `#6A5CFF`, `#8A4DFF`, `#FF6584`
3. Dark theme: `bg-slate-900`, `text-white`
4. Cards: `rounded-2xl border border-white/10 bg-white/5`

---

## 🚨 Important Notes

1. **mPanel Dependency**: Marketing website can run standalone, but full features require mPanel running on port 2271
2. **Chat Widget**: Guardian chat widget loads from mPanel (`http://localhost:2271/guardian/widget.js`)
3. **Stripe Checkout**: Locale selection (9 languages: EN, ES, FR, DE, PT, IT, JA, ZH, HT)
4. **Brand Assets**: Logos in `public/brand/` as inline SVGs (faster loading)
5. **Responsive Design**: All components must work on mobile (320px+)

---

## 📚 Additional Documentation

- **Architecture**: See existing `ARCHITECTURE.md`
- **mPanel API**: See mPanel repo `/docs/MARKETING_API_INTEGRATION.md`
- **Stripe Integration**: See `server/index.js` for checkout flow
- **Design System**: Tailwind config in `tailwind.config.js`

---

**For questions or issues, refer to the existing codebase patterns or ask for clarification!**
