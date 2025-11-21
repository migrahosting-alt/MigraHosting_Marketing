# Service Portals - Architecture Correction

## ❌ Current Issue

Built service management portals as **public pages** on the marketing website:
- `/manage/ssl`
- `/manage/backups`
- `/manage/email`
- `/migrate`

**Problem:** These should be **authenticated features inside mPanel control panel**, not public marketing pages.

---

## ✅ Correct Architecture

### **Marketing Website** (This Repo - Port 5173)
**Purpose:** Customer acquisition, lead generation, signup

**Public Pages:**
- `/` - Homepage
- `/pricing` - Pricing & plans
- `/features` - Feature descriptions
- `/hosting`, `/email`, `/vps-cloud`, `/storage` - Service marketing pages
- `/domains/transfer` - Transfer request form (leads to mPanel after signup)
- `/signup` - Create account → redirects to mPanel
- `/checkout` - Payment → creates mPanel account

**What Should NOT Be Here:**
- ❌ SSL management
- ❌ Backup management  
- ❌ Email account creation
- ❌ VPS provisioning
- ❌ File management

---

### **mPanel Control Panel** (Separate Repo - Port 2271)
**Purpose:** Service management for authenticated customers

**Protected Features (Require Login):**
- **Dashboard** - Account overview, usage stats
- **SSL Management** - Install/renew certificates
- **Backup Management** - Create/restore backups
- **Email Management** - Create/manage email accounts
- **Domain Management** - DNS, transfers, renewals
- **WordPress Management** - Install/update WordPress
- **VPS Management** - Provision/manage servers
- **Storage Management** - File browser (MigraDrive)
- **Migration Tool** - Website migration requests
- **Billing** - Invoices, payment methods
- **Support** - Tickets, live chat

---

## 🔄 What to Do with Built Portals

### **Option 1: Move to mPanel (Recommended)**

**Transfer the portal components to mPanel:**

```bash
# Move portal pages to mPanel frontend
mv apps/website/src/pages/SSLManagement.tsx → /path/to/mpanel/frontend/src/pages/services/
mv apps/website/src/pages/BackupManagement.tsx → /path/to/mpanel/frontend/src/pages/services/
mv apps/website/src/pages/EmailManagement.tsx → /path/to/mpanel/frontend/src/pages/services/
mv apps/website/src/pages/Migration.tsx → /path/to/mpanel/frontend/src/pages/services/

# Move backend routes to mPanel backend
mv server/routes/services.js → /path/to/mpanel/backend/src/routes/
```

**In mPanel:**
1. Add authentication middleware to all service routes
2. Add user context (tenant ID) to queries
3. Integrate with existing mPanel database (PostgreSQL)
4. Add to mPanel sidebar navigation
5. Apply mPanel theme/styling

---

### **Option 2: Keep as Marketing Lead Magnets**

**Convert to "Request Access" forms:**

These pages become **lead generation tools** that require signup:

```typescript
// Example: SSLManagement.tsx on marketing site
export default function SSLManagement() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <h1>SSL Certificate Management</h1>
        <p>Sign in to manage your SSL certificates</p>
        <Link to="/signup">Create Free Account</Link>
        <Link to={`${MPANEL_URL}/login`}>Sign In to Control Panel</Link>
      </div>
    );
  }
  
  // Redirect to mPanel
  window.location.href = `${MPANEL_URL}/services/ssl`;
}
```

---

### **Option 3: Hybrid Approach**

**Marketing website shows features, mPanel provides functionality:**

**Marketing Page (`/features/ssl`):**
- Show what SSL management looks like (screenshots)
- Explain features
- CTA: "Sign up to manage SSL certificates"

**mPanel (`/services/ssl`):**
- Actual working SSL management portal
- Requires authentication
- User-specific data (their domains only)

---

## 🎯 Recommended Implementation

### **For Marketing Website (Keep):**

1. **Domain Transfer Lead Form** (`/domains/transfer`)
   ```
   Purpose: Collect transfer requests
   Action: Submit → Create lead in mPanel → Send email
   Auth: Not required (marketing funnel)
   ```

2. **Migration Request Form** (`/migrate`)
   ```
   Purpose: Collect migration requests  
   Action: Submit → Create ticket in mPanel → Contact user
   Auth: Not required (sales lead)
   ```

3. **Feature Preview Pages** (NEW)
   ```
   /features/ssl-management → Screenshots + CTA
   /features/backups → Screenshots + CTA
   /features/email → Screenshots + CTA
   ```

### **For mPanel Control Panel (Move):**

1. **SSL Management** (Authenticated)
   - View user's domains only
   - Install certificates for owned domains
   - Auto-renewal settings

2. **Backup Management** (Authenticated)
   - View backups for user's hosting plans
   - Create/restore user's own backups
   - Download user's backups only

3. **Email Management** (Authenticated)
   - Create emails for user's domains
   - Manage user's email quotas
   - User-specific IMAP/SMTP credentials

4. **WordPress Management** (Authenticated)
   - Install WordPress on user's hosting
   - Manage user's WordPress sites
   - User-specific plugins/themes

5. **VPS Provisioning** (Authenticated)
   - Create VPS from user's account
   - Manage user's VPS instances
   - Charge user's billing account

6. **Storage Management** (Authenticated)
   - Browse user's files only
   - User quota enforcement
   - User-specific file sharing

---

## 🔐 Security Implications

### **Current Setup (Insecure):**
```typescript
// ❌ Anyone can access these:
GET /api/services/backups?domain=example.com
POST /api/services/email/create
POST /api/services/ssl/install
```

**Problem:** No authentication = anyone can manage any domain!

### **Correct Setup (Secure):**
```typescript
// ✅ In mPanel with auth:
GET /api/services/backups
Authorization: Bearer <user_token>
// Returns only backups for authenticated user's domains

POST /api/services/email/create
Authorization: Bearer <user_token>
// Creates email only for user's owned domains
// Charges user's billing account
```

---

## 📋 Action Items

### **Immediate (Fix Security):**

1. **Remove public access to service APIs:**
   ```javascript
   // server/routes/services.js
   import { requireUser } from '../auth.js';
   
   router.use(requireUser); // Add authentication to ALL service routes
   ```

2. **Add user context to queries:**
   ```javascript
   // Only return user's own data
   router.get('/backups', requireUser, async (req, res) => {
     const userId = req.user.id;
     const backups = await getBackupsForUser(userId);
     return res.json({ data: backups });
   });
   ```

### **Short-term (Move to mPanel):**

3. **Transfer portal components to mPanel repo**
4. **Add to mPanel sidebar navigation**
5. **Apply mPanel authentication & theming**
6. **Connect to mPanel PostgreSQL database**

### **Long-term (Marketing Site):**

7. **Convert marketing pages to feature previews**
8. **Add CTAs linking to mPanel**
9. **Keep lead generation forms** (domain transfer, migration requests)

---

## 🔗 Integration Flow

### **Correct User Journey:**

```
1. User visits marketing site (localhost:5173)
   ↓
2. Views /features/ssl (marketing page with screenshots)
   ↓
3. Clicks "Get Started" → /signup
   ↓
4. Completes signup → Creates account in mPanel
   ↓
5. Redirected to mPanel (localhost:2271/login)
   ↓
6. Logs in to mPanel control panel
   ↓
7. Accesses /services/ssl (authenticated portal)
   ↓
8. Manages SSL certificates for their domains
```

---

## 🎨 What Marketing Site Should Have

**Landing/Feature Pages (Public):**
- Screenshots of mPanel features
- Video demos
- Feature lists with checkmarks
- Pricing comparison
- Customer testimonials
- CTA buttons → "Sign Up" or "View Control Panel"

**Lead Generation Forms (Public, No Auth):**
- Domain transfer requests
- Migration requests  
- Contact sales
- Demo requests

**Account Creation (Public):**
- Signup flow
- Payment (Stripe checkout)
- Email verification
- Redirect to mPanel

**What It Should NOT Have:**
- Actual service management (that's mPanel's job)
- User-specific data access
- Administrative features

---

## 💡 Conclusion

The service portals were built correctly **from a technical standpoint**, but they belong in **mPanel control panel**, not the marketing website.

**Next Steps:**
1. Move portal components to mPanel repo
2. Add authentication & user context
3. Convert marketing pages to feature showcases
4. Keep lead generation forms on marketing site

This separates **marketing (public)** from **service management (authenticated)**, which is the correct architecture for a hosting provider.
