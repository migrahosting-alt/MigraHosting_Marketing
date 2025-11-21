# Service Portals - Quick Start Guide

## ✅ What Was Built

**5 complete service management portals** with backend APIs:

1. **Domain Transfer** - `/domains/transfer`
2. **SSL Management** - `/manage/ssl`
3. **Backup Management** - `/manage/backups`
4. **Email Management** - `/manage/email`
5. **Website Migration** - `/migrate`

---

## 🚀 How to Test

### Start Both Servers:

```bash
# Terminal 1: Frontend (Vite dev server)
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site
yarn workspace @migrahosting/website dev
# Access: http://localhost:5173

# Terminal 2: Backend API (Node/Express)
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site/server
node index.js
# Access: http://localhost:4242
```

### Access Service Portals:

Visit these URLs in your browser:

- **Domain Transfer:** http://localhost:5173/domains/transfer
- **SSL Management:** http://localhost:5173/manage/ssl
- **Backup Management:** http://localhost:5173/manage/backups
- **Email Management:** http://localhost:5173/manage/email
- **Website Migration:** http://localhost:5173/migrate

---

## 🧪 Testing Each Portal

### 1. Domain Transfer
**Steps:**
1. Go to http://localhost:5173/domains/transfer
2. Enter domain: `test.com`
3. Click "Check Eligibility" → should show domain is eligible
4. Fill contact info:
   - Email: `test@example.com`
   - Name: `John Doe`
   - Auth Code: `ABC123XYZ`
5. Submit → should show success with tracking ID

**Expected:** Transfer request submitted, tracking ID displayed

---

### 2. SSL Management
**Steps:**
1. Go to http://localhost:5173/manage/ssl
2. View list of domains with SSL status
3. Click "Install SSL" on a domain without certificate
4. Check console for API call

**Expected:** 
- List shows 3 mock domains
- Color-coded status (green/yellow/red)
- Install button triggers API call

---

### 3. Backup Management
**Steps:**
1. Go to http://localhost:5173/manage/backups
2. Select domain from dropdown
3. Click "Create Manual Backup"
4. Enter optional label → "Test Backup"
5. View backup list
6. Click "Restore" on a backup → confirm dialog appears

**Expected:**
- Shows 2 automatic backups
- Create backup triggers API
- Restore shows confirmation warning

---

### 4. Email Management
**Steps:**
1. Go to http://localhost:5173/manage/email
2. Click "Create Email Account"
3. Fill form:
   - Username: `support`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
   - Quota: 5 GB
4. Click "Create Account"

**Expected:**
- Form validates password strength
- Email format: `support@example.com`
- Account appears in list after creation
- Storage usage bar displays

---

### 5. Website Migration
**Steps:**
1. Go to http://localhost:5173/migrate
2. Step 1 - Enter details:
   - Domain: `mysite.com`
   - Current Host: `GoDaddy`
   - Email: `owner@mysite.com`
3. Click "Continue"
4. Step 2 - Select "cPanel Access"
   - cPanel URL: `https://mysite.com:2083`
   - Username: `admin`
   - Password: `password123`
5. Click "Submit Migration Request"

**Expected:**
- 3-step progress indicator
- Migration ID generated
- Success confirmation displayed

---

## 📡 Backend API Testing

### Using curl or Postman:

**Domain Transfer Check:**
```bash
curl -X POST http://localhost:4242/api/services/domain/check-eligibility \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'
```

**Install SSL:**
```bash
curl -X POST http://localhost:4242/api/services/ssl/install \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com", "type": "lets-encrypt"}'
```

**List Backups:**
```bash
curl http://localhost:4242/api/services/backups?domain=example.com
```

**Create Email:**
```bash
curl -X POST http://localhost:4242/api/services/email/create \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "SecurePass123", "quota": 5000}'
```

**Request Migration:**
```bash
curl -X POST http://localhost:4242/api/services/migration/request \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example.com",
    "currentHost": "GoDaddy",
    "contactEmail": "admin@example.com",
    "migrationType": "cpanel"
  }'
```

---

## 🔍 What to Look For

### ✅ Success Indicators:
- Pages load without errors
- Forms validate input
- API calls return JSON responses
- Success/error messages display correctly
- Buttons disable during submission
- Loading states appear

### ⚠️ Known Limitations:
- Backend uses **mock data** (no real Let's Encrypt, mail server, etc.)
- No authentication (anyone can access portals)
- No database persistence (data not saved)
- Hardcoded domain list (`example.com`, `testsite.net`, `myshop.org`)

---

## 🐛 Troubleshooting

### "CORS Error"
**Fix:** Ensure backend is running on port 4242 and CORS is enabled

### "Cannot find module"
**Fix:** Run `yarn install` in workspace root

### "Port already in use"
**Fix:** Kill existing process:
```bash
# Find process
lsof -ti:5173 -ti:4242

# Kill it
kill -9 <PID>
```

### "Icons not displaying"
**Fix:** Icons.jsx component created - no external dependencies needed

---

## 📁 Key Files Modified

```
✅ server/routes/services.js       (NEW - all service APIs)
✅ server/index.js                  (UPDATED - added services router)
✅ apps/website/src/App.jsx         (UPDATED - added 4 routes)
✅ apps/website/src/pages/
   ✅ DomainTransfer.jsx            (UPDATED - connected to backend)
   ✅ SSLManagement.tsx             (NEW)
   ✅ BackupManagement.tsx          (NEW)
   ✅ EmailManagement.tsx           (NEW)
   ✅ Migration.tsx                 (NEW)
✅ apps/website/src/components/
   ✅ Icons.jsx                     (NEW - inline SVG icons)
```

---

## 🎯 Next Steps (Phase 2)

**To complete the service portal system:**

1. **Build remaining portals:**
   - WordPress Management (`/manage/wordpress`)
   - VPS Provisioning (`/manage/vps`)
   - Storage Management (`/manage/storage`)

2. **Backend integrations:**
   - Let's Encrypt SSL automation
   - Domain registrar API (ResellerClub/Namecheap)
   - Email server (Postfix/Dovecot)
   - Backup storage (MinIO/S3)
   - Migration automation (cPanel API)

3. **Database:**
   - Add tables for services (transfers, ssl_certs, backups, email_accounts, migrations)
   - User authentication & authorization
   - Multi-tenant data isolation

4. **mPanel integration:**
   - Connect to mPanel control panel APIs
   - Service provisioning automation
   - Billing integration

---

## 📊 Current Status

**Phase 1 Complete:** 5/10 portals ✅  
**Backend APIs:** 11 endpoints ✅  
**Frontend Routes:** 4 routes ✅  
**Components:** 5 pages + Icons ✅  

**Time to Build:** ~1 hour  
**Lines of Code:** ~3,000

---

**Built:** November 17, 2025  
**Status:** 🟢 Ready for Testing
