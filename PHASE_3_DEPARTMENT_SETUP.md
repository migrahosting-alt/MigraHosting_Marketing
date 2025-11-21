# Phase 3: Department-Based Chat Control Setup

## 🎯 Overview

This guide configures AFM Guardian to support **department-specific credentials** in mPanel, allowing different teams (Support, Billing, Technical, Sales) to access different tool sets based on their roles.

---

## 📋 What You Need to Provide

### 1. **Department Roles in mPanel**

Based on your `users` table schema, you have a `role` field. I need to know your department structure:

**Current mPanel Roles (from schema.sql):**
- `customer` - Regular hosting customer (default)
- `admin` - Full system access
- `owner` - Tenant owner

**Suggested Department Roles for Chat:**
```sql
-- Add these roles to your users table
role VARCHAR(50) DEFAULT 'customer'

-- Possible values:
-- 'customer'        - Regular customer (basic support tools)
-- 'support'         - Support team (tickets, user lookup, DNS)
-- 'billing'         - Billing department (invoices, payments, subscriptions)
-- 'technical'       - Technical team (servers, DNS, backups, advanced)
-- 'sales'           - Sales team (user info, product catalog, quotes)
-- 'admin'           - Full access (all tools)
-- 'owner'           - Tenant owner (all tools + tenant management)
```

**ACTION REQUIRED:** Tell me which department roles you want to support, or confirm the list above.

---

### 2. **Department Credentials Setup**

You'll create **department user accounts** in mPanel with specific roles:

```sql
-- Example: Create department users
INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, status) VALUES
  ('your-tenant-id', 'support@migrahosting.com', '$hashed', 'Support', 'Team', 'support', 'active'),
  ('your-tenant-id', 'billing@migrahosting.com', '$hashed', 'Billing', 'Team', 'billing', 'active'),
  ('your-tenant-id', 'tech@migrahosting.com', '$hashed', 'Technical', 'Team', 'technical', 'active'),
  ('your-tenant-id', 'sales@migrahosting.com', '$hashed', 'Sales', 'Team', 'sales', 'active');
```

**ACTION REQUIRED:** Confirm department email format (e.g., support@yourdomain.com).

---

### 3. **JWT Token Claims**

Your mPanel JWT needs to include the user's **role** in the token payload:

**Current JWT (from auth.js):**
```javascript
jwt.verify(token, process.env.JWT_SECRET)
// Returns: { userId, email, ... }
```

**Required JWT Payload:**
```javascript
{
  sub: "user-uuid",           // User ID
  email: "support@domain.com",
  role: "support",            // ← REQUIRED for department routing
  department: "support",      // Optional: explicit department field
  permissions: [...],         // Optional: granular permissions
  iat: 1234567890,
  exp: 1234567890
}
```

**ACTION REQUIRED:** Confirm your JWT already includes `role` field, or tell me where to add it.

---

## 🛠️ Phase 3 Implementation Plan

### Step 1: Update mPanel JWT to Include Role

**File:** `mpanel-main/src/services/AuthService.js` (or wherever you generate JWTs)

**Before:**
```javascript
const token = jwt.sign({ 
  userId: user.id, 
  email: user.email 
}, process.env.JWT_SECRET);
```

**After:**
```javascript
const token = jwt.sign({ 
  sub: user.id,              // Standard JWT claim for user ID
  email: user.email,
  role: user.role,           // ← Add role from users table
  department: user.role,     // ← Explicit department field
  tenantId: user.tenant_id   // Optional: for multi-tenant support
}, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});
```

---

### Step 2: Create Department-Specific Tools

I'll create tools for each department:

#### **Support Department Tools**
- `support_get_user_info(email)` - Look up customer details
- `support_list_tickets(userId?)` - View support tickets
- `support_create_ticket(subject, message, priority)` - Create ticket
- `support_update_ticket(ticketId, status, response)` - Update ticket
- `dns_list_records(zone)` - DNS management (existing)
- `dns_update_record(zone, record, type, value)` - DNS updates

#### **Billing Department Tools**
- `billing_get_invoices(userId?, status?)` - View invoices
- `billing_get_invoice_detail(invoiceId)` - Invoice details
- `billing_create_invoice(userId, items)` - Manual invoice
- `billing_get_subscriptions(userId?)` - Active subscriptions
- `billing_process_payment(invoiceId, method)` - Process payment
- `billing_apply_credit(userId, amount, reason)` - Apply account credit

#### **Technical Department Tools**
- `tech_list_servers(userId?)` - List user servers
- `tech_get_server_status(serverId)` - Server health
- `tech_restart_service(serverId, service)` - Restart services
- `tech_view_logs(serverId, service, lines)` - View logs
- `dns_*` - All DNS tools (full access)
- `backups_*` - All backup tools
- `tech_ssh_access(serverId)` - Generate SSH credentials

#### **Sales Department Tools**
- `sales_get_customer_info(email)` - Customer profile
- `sales_list_products()` - Product catalog
- `sales_create_quote(customerId, products)` - Generate quote
- `sales_get_revenue_stats(period)` - Sales metrics
- `sales_list_opportunities()` - Sales pipeline

#### **Admin Department Tools**
- **ALL TOOLS** - Full access to everything

---

### Step 3: Configure Tool Access Control

**File:** `migra-afm-guardian-complete-v2/services/orchestrator/src/index.ts`

Add role-based tool filtering:

```typescript
// Tool registry with access control
const TOOL_REGISTRY = [
  // Support tools
  { name: 'support_get_user_info', roles: ['support', 'admin', 'owner'] },
  { name: 'support_list_tickets', roles: ['support', 'admin', 'owner'] },
  { name: 'dns_list_records', roles: ['support', 'technical', 'admin', 'owner'] },
  
  // Billing tools
  { name: 'billing_get_invoices', roles: ['billing', 'admin', 'owner'] },
  { name: 'billing_process_payment', roles: ['billing', 'admin', 'owner'] },
  
  // Technical tools
  { name: 'tech_list_servers', roles: ['technical', 'admin', 'owner'] },
  { name: 'tech_restart_service', roles: ['technical', 'admin', 'owner'] },
  
  // Sales tools
  { name: 'sales_get_customer_info', roles: ['sales', 'admin', 'owner'] },
  { name: 'sales_create_quote', roles: ['sales', 'admin', 'owner'] },
  
  // Public tools (all authenticated users)
  { name: 'user_get_summary', roles: ['customer', 'support', 'billing', 'technical', 'sales', 'admin', 'owner'] }
];

function getAvailableTools(actor) {
  const userRole = actor.role || actor.roles?.[0] || 'customer';
  return TOOL_REGISTRY
    .filter(tool => tool.roles.includes(userRole))
    .map(tool => tool.name);
}
```

---

### Step 4: Update Adapters with mPanel API Integration

**File:** `migra-afm-guardian-complete-v2/services/adapters/src/index.ts`

Connect to real mPanel backend:

```typescript
// Environment configuration
const MPANEL_API_BASE = process.env.MPANEL_API_BASE || 'http://localhost:3002/api';
const MPANEL_API_TOKEN = process.env.MPANEL_API_TOKEN; // Service account token

// Example: Support - Get User Info
app.get("/support/user/:email", async (req, res) => {
  const { email } = req.params;
  const actor = req.query.actor; // From Gateway
  
  // Verify actor has 'support' role
  if (!['support', 'admin', 'owner'].includes(actor.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  try {
    const response = await fetch(`${MPANEL_API_BASE}/users?email=${email}`, {
      headers: { 
        Authorization: `Bearer ${MPANEL_API_TOKEN}`,
        'X-Actor-Role': actor.role 
      }
    });
    const user = await response.json();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Example: Billing - Get Invoices
app.get("/billing/invoices", async (req, res) => {
  const { userId, status } = req.query;
  const actor = req.query.actor;
  
  // Verify actor has 'billing' role
  if (!['billing', 'admin', 'owner'].includes(actor.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  try {
    const response = await fetch(
      `${MPANEL_API_BASE}/invoices?userId=${userId}&status=${status}`,
      {
        headers: { Authorization: `Bearer ${MPANEL_API_TOKEN}` }
      }
    );
    const invoices = await response.json();
    res.json(invoices);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});
```

---

## 🔐 Security Configuration

### 1. Generate Service Account Token

Create a dedicated **service account** in mPanel for AFM Guardian:

```sql
-- Create service account
INSERT INTO users (tenant_id, email, first_name, role, status) VALUES
  ('your-tenant-id', 'afm-service@internal', 'AFM Guardian', 'admin', 'active');

-- Generate long-lived token (or use API key approach)
```

**Set in environment:**
```env
MPANEL_API_TOKEN=your-service-account-jwt-here
```

### 2. Configure JWT Public Key (Production)

For RS256 JWT verification:

```bash
# Generate key pair in mPanel
cd mpanel-main
openssl genpkey -algorithm RSA -out jwt_private.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in jwt_private.pem -out jwt_public.pem
```

**mPanel Backend (.env):**
```env
JWT_ALGORITHM=RS256
JWT_PRIVATE_KEY="$(cat jwt_private.pem)"
```

**AFM Gateway (.env):**
```env
JWT_PUBLIC_KEY="$(cat jwt_public.pem)"
```

---

## 📊 Department Tool Matrix

| Tool Category | Customer | Support | Billing | Technical | Sales | Admin |
|---------------|----------|---------|---------|-----------|-------|-------|
| **User Lookup** | Own only | ✅ All | ✅ All | ❌ | ✅ All | ✅ All |
| **Tickets** | Own only | ✅ All | ❌ | ❌ | ❌ | ✅ All |
| **Invoices** | Own only | ❌ | ✅ All | ❌ | View only | ✅ All |
| **Subscriptions** | Own only | View | ✅ Manage | ❌ | View | ✅ All |
| **DNS** | Own only | ✅ Manage | ❌ | ✅ Manage | ❌ | ✅ All |
| **Servers** | Own only | View | ❌ | ✅ Manage | ❌ | ✅ All |
| **Backups** | Own only | View | ❌ | ✅ Manage | ❌ | ✅ All |
| **Payments** | ❌ | ❌ | ✅ Process | ❌ | ❌ | ✅ All |
| **Quotes** | ❌ | ❌ | ❌ | ❌ | ✅ Create | ✅ All |

---

## 🧪 Testing Department Access

### Test 1: Support Login
```bash
# Login as support@migrahosting.com
# JWT will include: { role: 'support' }

# Chat should show:
- ✅ User lookup tools
- ✅ Ticket management
- ✅ DNS tools
- ❌ Billing tools (hidden)
- ❌ Server restart (hidden)
```

### Test 2: Billing Login
```bash
# Login as billing@migrahosting.com
# JWT will include: { role: 'billing' }

# Chat should show:
- ✅ Invoice tools
- ✅ Payment processing
- ✅ Subscription management
- ❌ Server tools (hidden)
- ❌ DNS tools (hidden)
```

### Test 3: Technical Login
```bash
# Login as tech@migrahosting.com
# JWT will include: { role: 'technical' }

# Chat should show:
- ✅ Server management
- ✅ Service restarts
- ✅ Log viewing
- ✅ DNS + Backups
- ❌ Billing tools (hidden)
```

---

## 🚀 Next Actions

### **Tell Me:**

1. **Department Roles**: Confirm the roles you want (support, billing, technical, sales, admin)?
2. **Department Emails**: What email format for department accounts?
3. **JWT Claims**: Does your current JWT include `role` field? If not, where is the JWT generated?
4. **mPanel API**: Are there existing API endpoints for:
   - `/api/users` (user lookup)
   - `/api/invoices` (billing)
   - `/api/tickets` (support)
   - `/api/servers` (hosting)

### **I'll Build:**

1. ✅ Update orchestrator with role-based tool filtering
2. ✅ Create department-specific tools (20+ new tools)
3. ✅ Wire adapters to mPanel API endpoints
4. ✅ Add access control middleware
5. ✅ Update chat UI to show available tools based on role
6. ✅ Create department setup scripts
7. ✅ Write testing guide for each department

---

## 📝 Summary

**Current State:** Chat works with demo.token (no departments)

**After Phase 3:**
- ✅ Support team → Support tools only
- ✅ Billing team → Billing tools only
- ✅ Technical team → Technical tools only
- ✅ Sales team → Sales tools only
- ✅ Admin → All tools
- ✅ Customers → Own data only

**Security:**
- JWT with role claim
- Service account for mPanel API
- Role-based access control (RBAC)
- Audit logging per department

---

**What information do you need to provide me to complete Phase 3?**
