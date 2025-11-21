# Migrating Service Portals to mPanel Control Panel

## Overview

The service management portals (SSL, Backups, Email, Migration) were built on the marketing website but should be moved to **mPanel control panel** where they can be properly authenticated and user-scoped.

---

## Files to Migrate

### Frontend Components (Move to mPanel)

**Source:** `apps/website/src/pages/`
**Destination:** `/path/to/mpanel/frontend/src/pages/services/`

```bash
# Files to move:
SSLManagement.tsx       → /mpanel/frontend/src/pages/services/SSLManagement.tsx
BackupManagement.tsx    → /mpanel/frontend/src/pages/services/BackupManagement.tsx
EmailManagement.tsx     → /mpanel/frontend/src/pages/services/EmailManagement.tsx
Migration.tsx           → /mpanel/frontend/src/pages/services/Migration.tsx
```

**Shared Components:**
```bash
# Also move:
apps/website/src/components/Icons.jsx → /mpanel/frontend/src/components/Icons.jsx
```

### Backend Routes (Move to mPanel)

**Source:** `server/routes/services.js`
**Destination:** `/path/to/mpanel/backend/src/routes/services.js`

---

## Step-by-Step Migration

### 1. Copy Files to mPanel

```bash
# From marketing site root
cd /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site

# Copy frontend pages
cp apps/website/src/pages/SSLManagement.tsx /path/to/mpanel/frontend/src/pages/services/
cp apps/website/src/pages/BackupManagement.tsx /path/to/mpanel/frontend/src/pages/services/
cp apps/website/src/pages/EmailManagement.tsx /path/to/mpanel/frontend/src/pages/services/
cp apps/website/src/pages/Migration.tsx /path/to/mpanel/frontend/src/pages/services/

# Copy icons component
cp apps/website/src/components/Icons.jsx /path/to/mpanel/frontend/src/components/

# Copy backend routes
cp server/routes/services.js /path/to/mpanel/backend/src/routes/
```

### 2. Update Frontend Components

**Remove marketing site Header/Footer:**

```typescript
// Before (marketing site)
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SSLManagement() {
  return (
    <div>
      <Header />
      {/* content */}
      <Footer />
    </div>
  );
}

// After (mPanel - uses mPanel layout)
import { DashboardLayout } from '../components/DashboardLayout';

export default function SSLManagement() {
  return (
    <DashboardLayout>
      {/* content */}
    </DashboardLayout>
  );
}
```

**Update API base URL:**

```typescript
// Before (marketing site)
const response = await fetch('http://localhost:4242/api/services/ssl/install', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ domain, type: 'lets-encrypt' })
});

// After (mPanel - uses mPanel API)
const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/ssl/install`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}` // Add auth token
  },
  credentials: 'include',
  body: JSON.stringify({ domain, type: 'lets-encrypt' })
});
```

**Add user context:**

```typescript
// After (mPanel - get user's domains only)
import { useAuth } from '../hooks/useAuth';

export default function SSLManagement() {
  const { user } = useAuth();
  
  // Fetch only user's domains
  const { data: domains } = useQuery({
    queryKey: ['domains', user.id],
    queryFn: () => fetchUserDomains(user.id)
  });
  
  // ...rest of component
}
```

### 3. Update Backend Routes

**Add user context to all queries:**

```javascript
// Before (marketing site - no auth)
router.get('/backups', async (req, res) => {
  const { domain } = req.query;
  const backups = await getBackups(domain); // Any domain!
  return res.json({ success: true, data: backups });
});

// After (mPanel - user-scoped)
router.get('/backups', async (req, res) => {
  const userId = req.user.id; // From auth middleware
  
  // Only get backups for domains owned by this user
  const userDomains = await getUserDomains(userId);
  const backups = await getBackupsForDomains(userDomains);
  
  return res.json({ success: true, data: backups });
});
```

**Update database queries:**

```javascript
// Before (mock data)
router.post('/ssl/install', async (req, res) => {
  const { domain, type } = req.body;
  
  // TODO: Integrate with Let's Encrypt
  console.log('[ssl/install] Installing SSL for:', domain);
  
  return res.json({
    success: true,
    data: { domain, type, status: 'installing' }
  });
});

// After (mPanel - real implementation)
router.post('/ssl/install', async (req, res) => {
  const { domain } = req.body;
  const userId = req.user.id;
  
  // Verify user owns domain
  const domainRecord = await db.query(
    'SELECT * FROM domains WHERE domain = $1 AND user_id = $2',
    [domain, userId]
  );
  
  if (!domainRecord) {
    return res.status(403).json({ error: 'Domain not found or access denied' });
  }
  
  // Install SSL certificate
  const result = await installLetsEncryptSSL(domain);
  
  // Save to database
  await db.query(
    'INSERT INTO ssl_certificates (domain_id, issuer, expires_at) VALUES ($1, $2, $3)',
    [domainRecord.id, 'Let\'s Encrypt', result.expiresAt]
  );
  
  return res.json({ success: true, data: result });
});
```

### 4. Add to mPanel Navigation

**In mPanel sidebar:**

```typescript
// /mpanel/frontend/src/components/Sidebar.tsx
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Hosting', path: '/hosting', icon: Server },
  { name: 'Domains', path: '/domains', icon: Globe },
  
  // Add service management sections
  {
    name: 'Services',
    icon: Settings,
    children: [
      { name: 'SSL Certificates', path: '/services/ssl' },
      { name: 'Backups', path: '/services/backups' },
      { name: 'Email Accounts', path: '/services/email' },
      { name: 'WordPress', path: '/services/wordpress' },
    ]
  },
  
  { name: 'Billing', path: '/billing', icon: CreditCard },
  { name: 'Support', path: '/support', icon: HelpCircle },
];
```

### 5. Add Routes in mPanel

```typescript
// /mpanel/frontend/src/App.tsx
import SSLManagement from './pages/services/SSLManagement';
import BackupManagement from './pages/services/BackupManagement';
import EmailManagement from './pages/services/EmailManagement';
import Migration from './pages/services/Migration';

// Inside Routes
<Route path="/services/ssl" element={<SSLManagement />} />
<Route path="/services/backups" element={<BackupManagement />} />
<Route path="/services/email" element={<EmailManagement />} />
<Route path="/services/migration" element={<Migration />} />
```

### 6. Update Database Schema

**Add tables for service data:**

```sql
-- SSL Certificates
CREATE TABLE ssl_certificates (
  id SERIAL PRIMARY KEY,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  issuer VARCHAR(100) DEFAULT 'Let''s Encrypt',
  issued_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Backups
CREATE TABLE backups (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('automatic', 'manual')),
  size_bytes BIGINT,
  storage_path VARCHAR(500),
  label VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email Accounts
CREATE TABLE email_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  quota_mb INTEGER DEFAULT 5000,
  used_mb INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Migration Requests
CREATE TABLE migration_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  migration_id VARCHAR(50) UNIQUE NOT NULL,
  domain VARCHAR(255) NOT NULL,
  current_host VARCHAR(100),
  migration_type VARCHAR(20),
  status VARCHAR(50) DEFAULT 'pending',
  credentials JSONB, -- Encrypted
  contact_email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

---

## Marketing Website Changes

### Keep Domain Transfer as Lead Form

**Update `/domains/transfer` to collect leads:**

```typescript
// apps/website/src/pages/DomainTransfer.jsx
const handleTransferSubmit = async (e) => {
  e.preventDefault();
  
  // Submit as marketing lead
  const response = await fetch('http://localhost:4242/api/leads/domain-transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      source: 'marketing_website'
    })
  });
  
  // Show success message
  alert('Transfer request received! Our team will contact you within 24 hours.');
  
  // Prompt to create account
  window.location.href = '/signup?next=domain-transfer';
};
```

### Add Feature Showcase Pages

**Create marketing preview pages:**

```typescript
// apps/website/src/pages/features/SSLFeatures.jsx
export default function SSLFeatures() {
  return (
    <div>
      <Header />
      <main>
        <h1>Free SSL Certificates</h1>
        <p>Secure your website with one-click SSL installation</p>
        
        {/* Screenshot */}
        <img src="/images/ssl-management-screenshot.png" alt="SSL Management" />
        
        {/* Features */}
        <ul>
          <li>✅ Free Let's Encrypt SSL certificates</li>
          <li>✅ Automatic installation</li>
          <li>✅ Auto-renewal before expiration</li>
          <li>✅ Wildcard SSL support</li>
        </ul>
        
        {/* CTA */}
        <Link to="/signup">Get Started Free</Link>
        <Link to={MPANEL_URL + '/login'}>Sign In to Control Panel</Link>
      </main>
      <Footer />
    </div>
  );
}
```

---

## Testing in mPanel

### 1. Test Authentication

```bash
# User must be logged in
curl http://localhost:2271/api/services/backups \
  -H "Authorization: Bearer <token>"

# Should return 401 without token
curl http://localhost:2271/api/services/backups
```

### 2. Test User Scoping

```bash
# Create two test users
# User 1 should only see their own backups
# User 2 should only see their own backups
```

### 3. Test Integration

```bash
# Install SSL for user's domain
curl -X POST http://localhost:2271/api/services/ssl/install \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"domain": "user-domain.com"}'

# Should fail for domain not owned by user
curl -X POST http://localhost:2271/api/services/ssl/install \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{"domain": "someone-else-domain.com"}'
# Expected: 403 Forbidden
```

---

## Cleanup Marketing Site

**After migration is complete:**

```bash
# Remove service portal files from marketing site
rm apps/website/src/pages/SSLManagement.tsx
rm apps/website/src/pages/BackupManagement.tsx
rm apps/website/src/pages/EmailManagement.tsx
rm apps/website/src/pages/Migration.tsx

# Keep Icons.jsx if used elsewhere, otherwise remove
# rm apps/website/src/components/Icons.jsx

# Backend routes already protected with requireUser
# They will return 401 Unauthorized for non-logged-in users
```

---

## Summary

**Before (Incorrect):**
- Service portals on public marketing website
- No authentication required
- Anyone could access any domain's data

**After (Correct):**
- Service portals in mPanel control panel
- Authentication required
- User can only access their own data
- Marketing site shows feature previews + CTAs

**Migration Time:** ~2-4 hours depending on mPanel codebase familiarity
