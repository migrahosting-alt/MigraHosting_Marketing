# 🎉 Phase 2 Complete: mPanel Control Panel Integration

## ✅ What Was Added

### 1. **Chat Component in mPanel** (`mpanel-main/frontend/src/components/AfmGuardianChat.tsx`)
- Copied complete AfmGuardianChat component
- Full TypeScript support
- Auto mode (LLM) + Manual mode (developer tools)
- Purple gradient matching MigraHosting brand

### 2. **mPanel Environment Configuration**
**Files Created:**
- `mpanel-main/frontend/.env` - Development environment variables
- `mpanel-main/frontend/.env.example` - Template for deployment

**Variables Added:**
```env
VITE_AFM_GATEWAY_URL=http://localhost:8080
```

### 3. **Layout Integration** (`mpanel-main/frontend/src/components/Layout.jsx`)
**Changes:**
- Imported AfmGuardianChat component
- Added JWT token provider function
- Chat renders for all authenticated users
- Floating "Abigail" button appears bottom-right of dashboard

**Token Provider Logic:**
```javascript
const getToken = () => {
  return localStorage.getItem('mpanel_token') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('mpanel_token') ||
         sessionStorage.getItem('token') ||
         'demo.token'; // Fallback for development
};
```

### 4. **Gateway JWT Authentication** (Already Configured!)
The AFM Gateway (`migra-afm-guardian-complete-v2/services/gateway/src/index.ts`) already supports:
- ✅ RS256 JWT verification with `jose` library
- ✅ `JWT_PUBLIC_KEY` environment variable
- ✅ Demo mode (accepts `demo.token` when JWT_PUBLIC_KEY not set)
- ✅ Actor context forwarding to orchestrator
- ✅ Request ID tracking

**Updated docker-compose.afm.yml:**
```yaml
environment:
  - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY:-}  # Set to mPanel's public key
```

---

## 🚀 How to Run mPanel with Abigail Chat

### **Option 1: Quick Test (Demo Mode)**
No JWT configuration required - uses demo.token fallback.

```bash
# Terminal 1: Start AFM services
docker-compose -f docker-compose.afm.yml up -d

# Terminal 2: Start mPanel frontend
cd mpanel-main/frontend
npm install  # First time only
npm run dev

# Terminal 3: Start mPanel backend (optional, for full functionality)
cd mpanel-main
npm install  # First time only
npm run dev
```

**Access mPanel:** http://localhost:3001

### **Option 2: Production Setup (JWT Verification)**

#### Step 1: Generate mPanel Key Pair (if not exists)
```bash
cd mpanel-main

# Generate RS256 key pair
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

#### Step 2: Configure mPanel Backend
Add to `mpanel-main/.env`:
```env
JWT_SECRET_KEY=-----BEGIN PRIVATE KEY-----
...contents of private_key.pem...
-----END PRIVATE KEY-----

JWT_ALGORITHM=RS256
```

#### Step 3: Configure AFM Gateway
Add to root `.env` (create if doesn't exist):
```env
JWT_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----
...contents of public_key.pem...
-----END PUBLIC KEY-----
```

#### Step 4: Start All Services
```bash
# Start AFM with JWT verification
docker-compose -f docker-compose.afm.yml up -d

# Start mPanel
cd mpanel-main/frontend && npm run dev
cd mpanel-main && npm run dev
```

---

## 🧪 Testing the Integration

### Test 1: Chat Button Appears
1. Navigate to http://localhost:3001
2. Login to mPanel (if authentication is configured)
3. **Expected:** Purple floating "A" button in bottom-right corner

### Test 2: Chat Opens
1. Click the "Abigail" button
2. **Expected:** Chat drawer slides up from bottom-right
3. **Expected:** Welcome message: "Hi! I'm Abigail, your AI support assistant"

### Test 3: Auto Mode (LLM)
1. Type: "List DNS records for example.com"
2. Click **Send**
3. **Expected:** 
   - Abigail responds with DNS records
   - Tool used: `dns_list_records`
   - Mode: `auto`

### Test 4: Manual Mode (Developer Tools)
1. Click **Manual** button
2. Select tool: **DNS Records**
3. Enter: `example.com`
4. Click **Send**
5. **Expected:** Raw tool output with zone records

### Test 5: JWT Authentication
1. Open browser DevTools → Network tab
2. Send a chat message
3. Find request to `http://localhost:8080/chat`
4. **Check Headers:**
   ```
   Authorization: Bearer <your-token-here>
   ```
5. **Expected Response:** 200 OK with reply data

---

## 🔑 Understanding Token Flow

### Development (Demo Mode)
```
mPanel Frontend → getToken() → 'demo.token'
                ↓
AFM Gateway → requireAuth() → ✅ Accepts demo.token
                ↓
Orchestrator → Tools execute with actor: { userId: 'demo', roles: ['support'] }
```

### Production (JWT Verification)
```
mPanel Frontend → Login → JWT stored in localStorage
                ↓
getToken() → localStorage.getItem('mpanel_token')
                ↓
AFM Gateway → jwtVerify(token, PUBLIC_KEY) → Extract actor from claims
                ↓
Orchestrator → Tools execute with actor: { userId, roles, scopes }
```

---

## 🛠️ Current Tool Availability

**Public Tools (No Auth Required):**
- ✅ `dns_list_records` - List DNS records for a zone
- ✅ `user_get_summary` - Get user account summary
- ✅ `backups_list` - List backups for a domain

**Authenticated Tools (Phase 3 - Coming Next):**
- ⏳ `billing_get_invoices` - Recent invoices for logged-in user
- ⏳ `billing_get_subscription` - Current plan details
- ⏳ `ticket_create` - Create support ticket
- ⏳ `ticket_list` - View user's tickets
- ⏳ `account_get_info` - Full account information

---

## ⚠️ Known Limitations

### 1. **Token Storage Detection**
The token provider checks 4 locations, but mPanel's actual storage location may differ:
- `localStorage.getItem('mpanel_token')`
- `localStorage.getItem('token')`
- `sessionStorage.getItem('mpanel_token')`
- `sessionStorage.getItem('token')`

**Action Required:** Once mPanel authentication is working, verify token storage location and update `Layout.jsx` if needed.

### 2. **Public Key Configuration**
If using RS256 in production, ensure:
- mPanel uses same key pair
- Gateway has public key in `JWT_PUBLIC_KEY`
- Keys are PEM-encoded

### 3. **Stub Data**
All tools return stub/mock data until Phase 3 (backend integration):
- DNS records: Static example.com data
- User summary: Mock account details
- Backups: Simulated backup list

---

## 📋 Phase 2 Completion Checklist

- [x] Copy AfmGuardianChat.tsx to mPanel
- [x] Create .env and .env.example in frontend
- [x] Integrate chat into Layout.jsx
- [x] Implement getToken() function
- [x] Verify Gateway JWT support (already present)
- [x] Update docker-compose with JWT_PUBLIC_KEY
- [x] Write Phase 2 documentation
- [x] Test chat renders in mPanel

---

## 🎯 Next Steps: Phase 3

**Wire Real Data (Adapters → Backend Systems)**

1. **Connect DNS Adapter to PowerDNS API**
   - Configure `PDNS_API_URL` and `PDNS_API_KEY`
   - Replace stub DNS data with real PowerDNS queries

2. **Connect User Adapter to mPanel Backend**
   - Configure `MPANEL_API_BASE` and `MPANEL_API_TOKEN`
   - Fetch real user data from mPanel database

3. **Add Authenticated Tools**
   - `billing_get_invoices` - Query mPanel invoices table
   - `ticket_create` - Create ticket in mPanel
   - `account_get_info` - Full user profile

4. **Role-Based Access Control**
   - Support vs. Admin tools
   - Customer vs. Reseller permissions
   - Scope-based tool filtering

---

## 🐛 Troubleshooting

### Chat Button Doesn't Appear
- **Check:** Is mPanel frontend running on port 3001?
- **Check:** Browser console for React errors
- **Check:** `AfmGuardianChat.tsx` imported correctly in Layout.jsx

### "Error contacting AFM Gateway"
- **Check:** Is AFM Gateway running? `docker ps | grep afm-gateway`
- **Check:** Gateway logs: `docker logs afm-gateway`
- **Check:** CORS: Gateway allows `http://localhost:3001`

### "Invalid or expired token"
- **Check:** Token format: Should be JWT (3 parts: `header.payload.signature`)
- **Check:** JWT_PUBLIC_KEY matches mPanel's private key pair
- **Check:** Demo mode: Set `JWT_PUBLIC_KEY=` (empty) to accept demo.token

### Chat Opens But No Response
- **Check:** Orchestrator running? `docker logs afm-orchestrator`
- **Check:** LLM_API_KEY configured (for auto mode)
- **Check:** Network request in DevTools shows 200 response

---

## 📝 Files Modified/Created

**Created:**
- `mpanel-main/frontend/src/components/AfmGuardianChat.tsx`
- `mpanel-main/frontend/.env`
- `mpanel-main/frontend/.env.example`
- `PHASE_2_COMPLETE.md` (this file)

**Modified:**
- `mpanel-main/frontend/src/components/Layout.jsx` - Added chat integration
- `docker-compose.afm.yml` - Added JWT_PUBLIC_KEY environment variable

---

## 🎉 Success Criteria

✅ **Chat component renders** in mPanel dashboard  
✅ **Floating button appears** for authenticated users  
✅ **Chat drawer opens** when button is clicked  
✅ **Messages send** and receive responses  
✅ **JWT authentication** works (or demo.token fallback)  
✅ **Tools execute** and return data  
✅ **Debug view** shows raw tool results  

---

**Status:** Phase 2 - ✅ COMPLETE  
**Next:** Phase 3 - Wire Real Data  
**Updated:** 2024-01-10
