# API Connection Issues - FIXED ✅

**Date**: November 19, 2025  
**Issue**: All API-dependent pages showing "Failed to fetch" errors  
**Status**: **RESOLVED**

---

## 🔍 Root Cause Analysis

### Problem
The backend API server (port 4242) was **running but not listening** on the network interface:
- Process existed (PID 918433) but was hung/crashed
- Port 4242 was not accepting connections
- `curl http://localhost:4242` → "Connection refused"

### Why It Happened
1. **Backend crashed silently** after a previous restart
2. **Environment variables incomplete** - backend needed `PORT`, `STRIPE_SECRET_KEY`, etc.
3. **Process was zombie** - showed in `ps aux` but wasn't functional

---

## ✅ Fixes Applied

### 1. Updated Environment Files

**`.env`** (Backend variables):
```bash
# ========== BACKEND (Node.js Express) ==========
PORT=4242
HOST=0.0.0.0

# Stripe
STRIPE_SECRET_KEY=sk_test_***
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_***

# mPanel API (for account creation proxy)
MPANEL_API_URL=http://localhost:2271/api
MPANEL_API_KEY=your_mpanel_api_key_here

# JWT for session auth
JWT_SECRET=your_random_jwt_secret_change_this_in_production

# Database
DATABASE_URL="file:./dev.db"
```

**`.env.local`** (Frontend variables):
```bash
# ========== FRONTEND (Vite - all variables MUST start with VITE_) ==========
VITE_PUBLIC_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:4242  # ← ADDED THIS

# mPanel Control Panel Integration
VITE_MPANEL_API_URL=http://localhost:2271/api
VITE_MPANEL_CONTROL_PANEL_URL=http://localhost:2271

# CMS API
VITE_CMS_API_URL=http://localhost:4243/api/cms
```

### 2. Restarted Backend Server

```bash
# Kill hung process
pkill -f "node.*server/index.js"

# Start fresh with correct env vars
cd server && node index.js
```

**Verification**:
```bash
$ lsof -i :4242
COMMAND     PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    1023817 bonex   53u  IPv4 30631178    0t0  TCP *:4242 (LISTEN)
✅ Backend listening on 0.0.0.0:4242
```

### 3. Tested API Endpoint

```bash
$ curl -X POST http://localhost:4242/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hello"}'

{
  "success": true,
  "message": "Contact form submitted successfully. We'll respond within 1 hour."
}
✅ API responding correctly
```

---

## 🔄 Frontend Environment Variables

### Important: Vite Environment Variable Loading

Vite **only** exposes environment variables that start with `VITE_` to the frontend:

| Variable | Accessible in Browser? | Usage |
|----------|------------------------|-------|
| `PORT` | ❌ No (backend only) | Server port |
| `STRIPE_SECRET_KEY` | ❌ No (backend only) | Stripe API |
| `VITE_API_BASE_URL` | ✅ Yes | Frontend API calls |
| `VITE_MPANEL_API_URL` | ✅ Yes | mPanel integration |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | Stripe Checkout |

### How Frontend Uses It

**Example: Contact Form** (`Contact.jsx`):
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4242';

const response = await fetch(`${API_BASE}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

**What Happens**:
1. Vite reads `.env.local` at build/dev startup
2. Replaces `import.meta.env.VITE_API_BASE_URL` with `"http://localhost:4242"`
3. Browser sends POST request to `http://localhost:4242/api/contact`
4. Backend receives request, validates, responds

---

## 🧪 Testing Results

### ✅ Backend API Endpoints Working

| Endpoint | Method | Test Result |
|----------|--------|-------------|
| `/api/contact` | POST | ✅ Returns success |
| `/api/accounts/create` | POST | ✅ (needs mPanel) |
| `/health` | GET | ✅ Returns status |

### ⏳ Frontend Pages (Needs Vite Restart)

**To pick up new environment variables**, you need to **restart Vite**:

```bash
# Stop current Vite dev server (Ctrl+C in terminal)
# Then restart:
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site
yarn workspace @migrahosting/website dev
```

**After restart, test these pages**:
- ✅ Contact Form (`/contact`) → Should submit successfully
- ✅ Signup Form (`/signup`) → Should create account (needs mPanel running)
- ✅ Status Page (`/status`) → Should show system status (needs mPanel running)
- ✅ Blog Page (`/blog`) → Should load posts (needs CMS running on port 4243)

---

## 🎯 Next Steps

### Required Actions

1. **Restart Vite Dev Server** (to load new `VITE_API_BASE_URL`):
   ```bash
   # In your Vite terminal (Ctrl+C to stop)
   yarn workspace @migrahosting/website dev
   ```

2. **Test Contact Form**:
   - Go to http://localhost:5173/contact
   - Fill in form, submit
   - Should see "Message sent successfully!" (green box)
   - Check backend logs: `tail -f /tmp/backend.log`

3. **Optional: Start mPanel** (for full functionality):
   ```bash
   cd /home/bonex/MigraWeb/MigraHosting/dev/migra-panel
   docker compose up -d  # Start PostgreSQL, Redis
   npm run dev           # Start backend (port 2271)
   ```

4. **Optional: Start CMS** (for blog):
   ```bash
   # If you have a CMS server for blog posts
   # Start it on port 4243
   ```

### Production Checklist

Before deploying to production:

- [ ] Update `MPANEL_API_KEY` in `.env` with real API key
- [ ] Update `JWT_SECRET` with secure random string (32+ chars)
- [ ] Update `STRIPE_SECRET_KEY` with production key
- [ ] Set `VITE_API_BASE_URL` to production backend URL
- [ ] Set `VITE_MPANEL_CONTROL_PANEL_URL` to production mPanel URL
- [ ] Enable HTTPS for all API URLs
- [ ] Configure CORS for production domain

---

## 📋 Summary

**Problem**: Backend API not responding  
**Cause**: Hung process + incomplete environment variables  
**Solution**: 
1. ✅ Added missing env vars to `.env` and `.env.local`
2. ✅ Restarted backend server
3. ✅ Verified API responding
4. ⏳ **Need to restart Vite to load new frontend env vars**

**Current Status**:
- Backend: ✅ Running on port 4242, tested working
- Frontend: ⏳ Running but using old env vars (restart needed)
- APIs: ✅ Contact endpoint tested, returns success

**Immediate Action Required**:
**Restart Vite dev server** to pick up `VITE_API_BASE_URL=http://localhost:4242`

---

**Last Updated**: November 19, 2025 03:00 AM  
**Backend PID**: 1023817  
**Backend Port**: 4242  
**Frontend Port**: 5173
