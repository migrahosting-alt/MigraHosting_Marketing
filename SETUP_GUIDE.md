# MigraHosting Setup Guide

Complete integration guide for the MigraHosting marketing site and mPanel control panel.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MigraHosting Platform                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐           ┌──────────────────┐        │
│  │  Marketing Site  │◄─────────►│     mPanel       │        │
│  │  (Port 5173)     │   API     │  (Port 3000/3001)│        │
│  │                  │           │                  │        │
│  │  - Public pages  │           │  - Auth system   │        │
│  │  - Stripe checkout│          │  - Dashboard     │        │
│  │  - Cart system   │           │  - Hosting mgmt  │        │
│  └────────┬─────────┘           └────────┬─────────┘        │
│           │                              │                   │
│           │  ┌────────────────────────┐  │                  │
│           └─►│   Backend (Port 4242)  │◄─┘                  │
│              │                        │                      │
│              │  - Stripe webhooks     │                      │
│              │  - Provisioning API    │                      │
│              └──────────┬─────────────┘                      │
│                         │                                    │
│           ┌─────────────┴─────────────┐                     │
│           │                           │                      │
│    ┌──────▼──────┐            ┌──────▼──────┐              │
│    │  SQLite DB  │            │ PostgreSQL  │              │
│    │  (Landing)  │            │   (mPanel)  │              │
│    └─────────────┘            └─────────────┘              │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL 16+ (for mPanel)
- Redis 7+ (for mPanel caching)
- Docker & Docker Compose (optional, recommended)
- Yarn 4 (already configured in workspace)

## Quick Start

### 1. Clone and Install Dependencies

```bash
cd k:\MigraHosting\dev\migrahosting-landing

# Install all dependencies (marketing site + backend)
yarn install

# Install mPanel dependencies
cd mpanel-main/mpanel-main
npm install
cd frontend
npm install
cd ../../..
```

### 2. Set Up Databases

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL, Redis, MinIO, Prometheus, Grafana
cd mpanel-main/mpanel-main
docker-compose up -d

# Verify services are running
docker-compose ps
```

#### Option B: Manual Setup

```bash
# Install PostgreSQL
# Create database:
createdb mpanel

# Install Redis
# Start Redis server on default port 6379
```

### 3. Configure Environment Variables

#### Marketing Site + Backend (root)

```bash
# Copy example env file
cp .env.example .env

# Edit .env and set:
# - STRIPE_SECRET_KEY (from Stripe dashboard)
# - STRIPE_WEBHOOK_SECRET (from Stripe webhook settings)
# - MPANEL_API_BASE=http://localhost:3000
# - MPANEL_API_TOKEN=<generate-random-token>
```

#### Marketing Site Frontend

```bash
cd apps/website
cp .env.example .env

# Edit .env and set:
# - VITE_MPANEL_URL=http://localhost:3001
# - VITE_STRIPE_PUBLISHABLE_KEY (from Stripe dashboard)
```

#### mPanel Backend

```bash
cd mpanel-main/mpanel-main
cp .env.example .env

# Edit .env and set:
# - DATABASE_URL=postgresql://user:password@localhost:5432/mpanel
# - JWT_SECRET=<generate-with: openssl rand -base64 32>
# - MPANEL_API_TOKEN=<must-match-landing-site-token>
# - STRIPE_SECRET_KEY (same as landing site)
# - REDIS_URL=redis://localhost:6379
```

### 4. Run Database Migrations (mPanel)

```bash
cd mpanel-main/mpanel-main
npm run migrate
```

### 5. Start All Services

#### Terminal 1: Marketing Site Frontend

```bash
yarn workspace @migrahosting/website dev
# Runs on http://localhost:5173
```

#### Terminal 2: Landing Backend

```bash
node server/index.js
# Runs on http://localhost:4242
```

#### Terminal 3: mPanel Backend

```bash
cd mpanel-main/mpanel-main
npm run dev
# Runs on http://localhost:3000
```

#### Terminal 4: mPanel Frontend

```bash
cd mpanel-main/mpanel-main/frontend
npm run dev
# Runs on http://localhost:3001
```

## User Flow

### New Customer Purchase

1. **Browse** → Customer visits `http://localhost:5173`
2. **Select Plan** → Goes to `/pricing`, adds plan to cart
3. **Checkout** → Redirects to Stripe Checkout
4. **Payment** → Stripe processes payment
5. **Webhook** → Stripe notifies backend at `/webhooks/stripe`
6. **Provision** → Backend creates user in mPanel via API
   - Generates temporary password
   - Creates subscription record
   - Sends welcome email (TODO: email integration)
7. **Success** → Redirects to `/checkout/success`
8. **Welcome** → Auto-redirects to mPanel at `/welcome?session=xxx`
9. **Setup** → Customer sets permanent password
10. **Dashboard** → Auto-login to mPanel dashboard

### Existing Customer Login

1. **Click "Client Portal"** → In header
2. **Login Page** → `http://localhost:3001/login`
3. **Enter Credentials** → Email + password
4. **Dashboard** → Full access to hosting management

## API Endpoints

### Landing Site Backend (Port 4242)

- `GET /health` - Health check
- `POST /webhooks/stripe` - Stripe webhook handler
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/auth/me` - Get current user (if logged in)

### mPanel Backend (Port 3000)

#### Public Routes
- `GET /api/health` - Health check
- `GET /api/metrics` - Prometheus metrics
- `GET /api/public/plans` - List public pricing plans
- `POST /api/public/checkout` - Create checkout session

#### Auth Routes
- `POST /api/auth/register` - Register new user (called by webhook)
- `POST /api/auth/login` - User login
- `POST /api/auth/set-password` - Set/reset password
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-session` - Verify Stripe session

#### Protected Routes (requires JWT)
- `/api/products` - Product management
- `/api/invoices` - Invoice management
- `/api/subscriptions` - Subscription management
- `/api/servers` - Server management
- `/api/websites` - Website management
- `/api/dns` - DNS management
- `/api/mailboxes` - Email management
- `/api/databases` - Database management

## Testing the Integration

### 1. Test Marketing Site

```bash
# Visit homepage
http://localhost:5173

# Check all pages work:
# - Home, Hosting, Domains, Features, Support
# - Pricing, About, Terms, Privacy, Cookie Policy, SLA
```

### 2. Test Checkout Flow

```bash
# Use Stripe test card: 4242 4242 4242 4242
# Any future expiry date, any CVC

# After successful payment, should redirect to:
http://localhost:3001/welcome?session=cs_test_xxx
```

### 3. Test mPanel Login

```bash
# Direct login:
http://localhost:3001/login

# Use email from purchase and temporary password (check logs)
```

### 4. Test Provisioning

```bash
# Check backend logs for:
# - Stripe webhook received
# - User created in mPanel
# - Temporary password generated
# - Welcome email (logged, not sent yet)
```

## Stripe Webhook Setup

### Development (using Stripe CLI)

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:4242/webhooks/stripe

# Copy the webhook signing secret to .env:
# STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Production

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
4. Copy webhook signing secret to production `.env`

## Security Checklist

Before going to production:

- [ ] Change all default passwords/secrets
- [ ] Generate secure `JWT_SECRET` (32+ characters)
- [ ] Generate secure `MPANEL_API_TOKEN` (64+ characters)
- [ ] Set up SSL/TLS certificates (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set `NODE_ENV=production`
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Configure Redis persistence
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure email service (SMTP)
- [ ] Review and test error handling
- [ ] Set up log rotation
- [ ] Enable security headers (Helmet)
- [ ] Audit npm packages for vulnerabilities

## Troubleshooting

### Webhook Not Receiving Events

```bash
# Check webhook URL is correct
# Check Stripe webhook signing secret matches
# Check firewall allows incoming connections
# Use Stripe CLI for local testing
```

### Database Connection Errors

```bash
# Check PostgreSQL is running:
docker-compose ps  # or
pg_isready

# Check connection string in .env
# Check database exists:
psql -l
```

### CORS Errors

```bash
# Check CORS_ORIGIN in mPanel .env matches frontend URL
# Default: http://localhost:3001
```

### Authentication Errors

```bash
# Check JWT_SECRET is set
# Check token is being sent in Authorization header
# Check token hasn't expired (7 days default)
```

## Next Steps

1. **Email Integration**
   - Configure SMTP settings in mPanel `.env`
   - Update auth routes to send actual welcome emails
   - Create email templates

2. **Domain Provisioning**
   - Integrate with domain registrar API
   - Automate DNS setup
   - WHOIS privacy configuration

3. **Server Provisioning**
   - Connect to hosting infrastructure
   - Automate cPanel/server account creation
   - FTP/SSH credential management

4. **Support System**
   - Ticket system
   - Live chat integration
   - Knowledge base

5. **Monitoring & Analytics**
   - Set up Grafana dashboards
   - Configure alerts
   - User analytics

## Support

For questions or issues:
- Email: support@migrahosting.com
- Phone: 877-676-4472
- Address: 5423 N State Road 7, Tamarac, FL 33319

---

**MigraHosting** - Lightning-fast hosting, honest pricing, and one-click migration.
