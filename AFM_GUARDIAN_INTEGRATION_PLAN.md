# AFM Guardian (Abigail) Chat Integration Plan

## Executive Summary

**Current State**: The AFM Guardian chat system is complete but isolated in `migra-afm-guardian-complete-v2/` directory with no integration to marketing site or control panel.

**Goal**: Wire the AI chat support (Abigail) into:
1. Marketing site (public chat widget)
2. mPanel control panel (authenticated customer support)

---

## What Exists ✅

### AFM Guardian Backend (Complete)
**Location**: `migra-afm-guardian-complete-v2/migra-afm-guardian-complete-v2/`

**Architecture**:
- **Gateway** (Port 8080) - Public API entry point with auth
- **Orchestrator** (Port 8090) - LLM-powered tool router
- **Adapters** (Port 8095) - Backend connectors for DNS, users, backups
- **Widget** (`packages/widget/index.html`) - Test console

**Services**:
```
services/
├── gateway/        # Express API, Bearer token auth, forwards to orchestrator
├── orchestrator/   # LLM tool decision engine, zod validation, tool registry
└── adapters/       # Stub APIs for DNS (PowerDNS), user data, backups
```

**Tools Available**:
- `dns_list_records` - List DNS records for a domain
- `user_get_summary` - Get user account summary
- `backups_list` - List available backups

**Features**:
- Natural language mode (LLM decides tool automatically)
- Manual mode (developer selects tool directly)
- Message history for context
- Tool result formatting
- Debug mode

### React Chat Component (Complete)
**Location**: `migra-afm-guardian-complete-v2/src/components/AfmGuardianChat.tsx`

**Features**:
- Floating chat button (bottom-right, purple gradient)
- Chat drawer/modal UI
- Auto/manual mode switching
- Message history with tool results
- Loading states
- Token authentication support

**Props**:
```typescript
{
  endpoint: string;              // Gateway URL (http://localhost:8080/chat)
  getToken: () => Promise<string> | string;  // Auth token provider
}
```

### Infrastructure
**Location**: `migra-afm-guardian-complete-v2/infra/docker-compose.yml`
- All services containerized
- Environment variables via `.env`
- Health check endpoints
- Network isolation

---

## What's Missing ❌

### 1. Marketing Site Integration
**File**: `apps/website/src/pages/Support.tsx`

**Current State**:
- Support page has placeholder "Start Chat" links (`href="#chat"`)
- No actual chat widget integrated
- Says "Live chat responses average under 2 minutes" but chat doesn't exist

**Missing**:
- [ ] Copy `AfmGuardianChat.tsx` component to `apps/website/src/components/`
- [ ] Import and render in Support page
- [ ] Add to Home page (where it says "24/7 live chat with L2 engineers")
- [ ] Configure gateway endpoint (environment variable)
- [ ] Implement token provider for public/anonymous mode
- [ ] Style integration (match Tailwind theme)

### 2. mPanel Control Panel Integration
**Files**: mPanel frontend (currently in `mpanel-main.zip` - needs extraction)

**Current State**:
- No chat integration in mPanel dashboard
- References to "MigraAgent AI + human handoff" in docs
- Support pages link to marketing site

**Missing**:
- [ ] Extract mpanel-main.zip
- [ ] Add `AfmGuardianChat` to mPanel dashboard layout
- [ ] Wire authenticated user token
- [ ] Pass user context (userId, email, account tier) to actor
- [ ] Enable premium tools for authenticated users
- [ ] Add "Help" floating button in bottom-right

### 3. Backend Connection
**Current State**: 
- Adapters service has stub data
- No connection to real systems

**Missing**:
- [ ] Wire adapters to PowerDNS API (for real DNS records)
- [ ] Connect to mPanel backend API (user data, accounts, billing)
- [ ] Connect to backup storage (`/mnt/windows-backup/...`)
- [ ] Add authentication middleware
- [ ] Rate limiting
- [ ] Logging/monitoring integration

### 4. Additional Tools Needed
**Current Tools**: Only 3 basic tools (DNS, user summary, backups)

**Missing Tools for Full Support**:
- [ ] `billing_get_invoices` - View recent invoices
- [ ] `billing_get_subscription` - Get current plan details
- [ ] `domain_check_availability` - Check if domain is available
- [ ] `email_list_accounts` - List email accounts for a domain
- [ ] `ticket_create` - Create support ticket
- [ ] `ticket_list` - View open tickets
- [ ] `migration_status` - Check migration progress
- [ ] `ssl_check_status` - Verify SSL certificate
- [ ] `server_get_stats` - Resource usage (CPU, RAM, disk)

### 5. Authentication & Authorization
**Current**: Simple Bearer token with hardcoded "demo.token"

**Missing**:
- [ ] Real JWT token generation
- [ ] Token verification middleware
- [ ] Role-based access control (RBAC)
- [ ] User context extraction (from mPanel session)
- [ ] Anonymous mode for marketing site (limited tools)
- [ ] Authenticated mode for mPanel (full tools)

### 6. Safety & Guardrails
**Current**: Read-only tools only

**Missing for Destructive Actions**:
- [ ] Confirmation flows ("Are you sure you want to delete X?")
- [ ] High-risk tool flagging
- [ ] Audit logging
- [ ] Rate limiting per user
- [ ] Admin approval for critical operations
- [ ] Rollback capabilities

### 7. UI/UX Enhancements
**Missing**:
- [ ] Typing indicators
- [ ] File upload support (for ticket attachments)
- [ ] Quick action buttons (e.g., "Check my DNS", "View invoices")
- [ ] Conversation history persistence
- [ ] Handoff to human agent
- [ ] Agent availability status
- [ ] Satisfaction rating after chat
- [ ] Mobile responsive improvements

### 8. Documentation & Knowledge Base
**Missing**:
- [ ] Help articles integration
- [ ] Common questions/answers database
- [ ] Tool usage examples
- [ ] API documentation for developers
- [ ] Admin panel for managing responses

---

## Integration Steps

### Phase 1: Marketing Site Chat Widget (Quick Win)

**Timeline**: 1-2 days

**Steps**:
1. **Copy Chat Component**
   ```bash
   cp migra-afm-guardian-complete-v2/src/components/AfmGuardianChat.tsx \
      apps/website/src/components/AfmGuardianChat.tsx
   ```

2. **Add Environment Variables**
   ```env
   # apps/website/.env
   VITE_AFM_GATEWAY_URL=http://localhost:8080
   VITE_AFM_PUBLIC_TOKEN=public-demo-token
   ```

3. **Update Support Page**
   ```tsx
   // apps/website/src/pages/Support.tsx
   import { AfmGuardianChat } from "../components/AfmGuardianChat";
   
   export default function Support() {
     return (
       <main>
         {/* ... existing content ... */}
         <AfmGuardianChat 
           endpoint={import.meta.env.VITE_AFM_GATEWAY_URL + "/chat"}
           getToken={() => import.meta.env.VITE_AFM_PUBLIC_TOKEN}
         />
       </main>
     );
   }
   ```

4. **Add to Home Page**
   ```tsx
   // apps/website/src/pages/Home.jsx
   import { AfmGuardianChat } from "../components/AfmGuardianChat";
   
   // Add after all sections, before closing tags
   ```

5. **Start Services**
   ```bash
   # Terminal 1: AFM Gateway
   cd migra-afm-guardian-complete-v2
   docker compose -f infra/docker-compose.yml up
   
   # Terminal 2: Marketing Site
   cd apps/website
   npm run dev
   ```

6. **Test**
   - Visit http://localhost:5173
   - Click floating chat button
   - Test: "Check DNS for migrahosting.com"
   - Verify response from AFM Gateway

**Limitations (Phase 1)**:
- No real user authentication (uses public token)
- Limited tools (DNS, user summary, backups)
- Stub data from adapters
- No persistence

---

### Phase 2: mPanel Control Panel Integration

**Timeline**: 3-5 days

**Prerequisites**:
- [ ] Extract mpanel-main.zip
- [ ] Verify mPanel runs (frontend on :3001, backend on :3002)

**Steps**:

1. **Add Chat to mPanel**
   ```tsx
   // mpanel-main/frontend/src/components/Layout.tsx (or similar)
   import { AfmGuardianChat } from "./AfmGuardianChat";
   
   <AfmGuardianChat
     endpoint={process.env.REACT_APP_AFM_GATEWAY_URL + "/chat"}
     getToken={async () => {
       // Get JWT from mPanel session
       return localStorage.getItem("mpanel_jwt");
     }}
   />
   ```

2. **Update Gateway Auth**
   ```typescript
   // services/gateway/src/index.ts
   
   // Verify JWT and extract user info
   const verifyToken = (token: string) => {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     return {
       userId: decoded.sub,
       email: decoded.email,
       roles: decoded.roles || ["customer"],
       scopes: decoded.scopes || ["read:own"]
     };
   };
   ```

3. **Wire User Context**
   ```typescript
   // Actor gets real user data instead of demo
   const actor = {
     userId: "user_12345",
     roles: ["customer", "business_plan"],
     scopes: ["read:own", "write:tickets"]
   };
   ```

4. **Add Authenticated Tools**
   ```typescript
   // services/orchestrator/src/index.ts
   
   registry.set("billing_get_invoices", {
     schema: z.object({
       limit: z.number().optional()
     }),
     handler: async (input, { actor }) => {
       // Check actor.scopes includes "read:billing"
       const invoices = await fetch(
         `${ADAPTERS_URL}/billing/invoices?userId=${actor.userId}`
       );
       return invoices.json();
     }
   });
   ```

---

### Phase 3: Wire Real Data (Adapters → Backend Systems)

**Timeline**: 5-7 days

**Components**:

1. **PowerDNS Integration**
   ```typescript
   // services/adapters/src/dns.ts
   
   const PDNS_API_URL = process.env.PDNS_API_URL;
   const PDNS_API_KEY = process.env.PDNS_API_KEY;
   
   app.get("/dns/:zone/records", async (req, res) => {
     const { zone } = req.params;
     const response = await fetch(
       `${PDNS_API_URL}/api/v1/servers/localhost/zones/${zone}`,
       {
         headers: { "X-API-Key": PDNS_API_KEY }
       }
     );
     const data = await response.json();
     res.json({ zone, records: data.rrsets });
   });
   ```

2. **mPanel Backend Integration**
   ```typescript
   // services/adapters/src/user.ts
   
   const MPANEL_API_URL = process.env.MPANEL_API_BASE;
   const MPANEL_API_TOKEN = process.env.MPANEL_API_TOKEN;
   
   app.get("/user/summary", async (req, res) => {
     const { q } = req.query;
     const response = await fetch(
       `${MPANEL_API_URL}/api/users?search=${q}`,
       {
         headers: { Authorization: `Bearer ${MPANEL_API_TOKEN}` }
       }
     );
     const users = await response.json();
     res.json(users);
   });
   ```

3. **Backup System Integration**
   ```typescript
   // services/adapters/src/backups.ts
   
   import { readdir } from "fs/promises";
   
   app.get("/backups/:domain", async (req, res) => {
     const { domain } = req.params;
     const backupPath = `/mnt/windows-backup/${domain}`;
     
     try {
       const files = await readdir(backupPath);
       const backups = files.filter(f => f.endsWith(".tar.gz"));
       res.json({ domain, backups });
     } catch (err) {
       res.status(404).json({ error: "No backups found" });
     }
   });
   ```

---

### Phase 4: Advanced Features

**Timeline**: Ongoing

**Features**:
1. Human handoff (escalate to support team)
2. Conversation history persistence (database)
3. Multi-language support
4. Voice input/output
5. Mobile app integration
6. Analytics dashboard (chat usage, common questions)
7. A/B testing for responses
8. Custom training data

---

## Environment Variables Needed

```env
# AFM Gateway
AFM_GATEWAY_PORT=8080
ORCH_URL=http://orchestrator:8090
JWT_SECRET=your-secret-key-here
NODE_ENV=production

# Orchestrator
ORCH_PORT=8090
ADAPTERS_URL=http://adapters:8095
LLM_API_URL=https://api.openai.com/v1
LLM_API_KEY=sk-...
LLM_MODEL=gpt-4.1-mini
NODE_ENV=production

# Adapters
ADAPTERS_PORT=8095
PDNS_API_URL=http://powerdns:8081
PDNS_API_KEY=pdns-secret-key
MPANEL_API_BASE=http://localhost:3002
MPANEL_API_TOKEN=mpanel-api-token
BACKUP_STORAGE_PATH=/mnt/windows-backup
NODE_ENV=production

# Marketing Site
VITE_AFM_GATEWAY_URL=http://localhost:8080
VITE_AFM_PUBLIC_TOKEN=public-demo-token

# mPanel Frontend
REACT_APP_AFM_GATEWAY_URL=http://localhost:8080
```

---

## Testing Plan

### Unit Tests
- [ ] Gateway auth middleware
- [ ] Orchestrator tool decision logic
- [ ] Adapter API responses
- [ ] LLM prompt formatting

### Integration Tests
- [ ] End-to-end chat flow
- [ ] Tool execution with real data
- [ ] Error handling (network failures, timeouts)
- [ ] Rate limiting

### User Testing
- [ ] Marketing site chat (anonymous users)
- [ ] mPanel chat (authenticated customers)
- [ ] Mobile responsiveness
- [ ] Accessibility (screen readers, keyboard nav)

---

## Security Considerations

1. **Authentication**
   - JWT tokens with short expiration (15 min)
   - Refresh token rotation
   - Secure httpOnly cookies

2. **Authorization**
   - Role-based access control (RBAC)
   - Scope-based permissions
   - Tool-level restrictions

3. **Input Validation**
   - Zod schemas for all inputs
   - SQL injection prevention
   - XSS protection

4. **Rate Limiting**
   - 10 requests/minute per IP (anonymous)
   - 60 requests/minute per user (authenticated)
   - Exponential backoff on failures

5. **Data Privacy**
   - No logging of sensitive data
   - PII encryption at rest
   - GDPR compliance (data deletion)

6. **Audit Trail**
   - Log all destructive actions
   - Track user sessions
   - Monitor suspicious activity

---

## Deployment Strategy

### Development
```bash
# Local development with hot reload
docker compose -f infra/docker-compose.dev.yml up
```

### Staging
```bash
# Staging environment with test data
docker compose -f infra/docker-compose.staging.yml up
```

### Production
```bash
# Production with health checks and auto-restart
docker compose -f infra/docker-compose.prod.yml up -d
```

**Load Balancing**: Nginx reverse proxy in front of gateway
**Scaling**: Multiple gateway/orchestrator instances behind load balancer
**Monitoring**: Prometheus + Grafana (already configured in mpanel infrastructure)

---

## Success Metrics

### Phase 1 (Marketing Site)
- [ ] Chat widget loads on Support page
- [ ] User can send message and get response
- [ ] Response time < 3 seconds
- [ ] Chat button visible on mobile

### Phase 2 (mPanel)
- [ ] Authenticated users can access chat
- [ ] User context passed correctly
- [ ] Premium tools work for Business plan customers
- [ ] Chat history persists across sessions

### Phase 3 (Real Data)
- [ ] DNS records show actual data from PowerDNS
- [ ] User summaries match mPanel database
- [ ] Backup listings are accurate
- [ ] No stub data in production

### Phase 4 (Advanced)
- [ ] 80% of questions answered without human
- [ ] Average satisfaction rating > 4.5/5
- [ ] Human handoff < 5% of chats
- [ ] Mobile usage > 30% of total

---

## Next Steps

**Immediate (Today)**:
1. Copy `AfmGuardianChat.tsx` to `apps/website/src/components/`
2. Add to Support page
3. Configure environment variables
4. Start AFM services (docker compose up)
5. Test basic chat flow

**This Week**:
1. Extract mpanel-main.zip
2. Add chat to mPanel dashboard
3. Wire JWT authentication
4. Test authenticated user flow

**Next Week**:
1. Connect adapters to PowerDNS
2. Connect to mPanel backend API
3. Wire backup storage
4. Add billing tools

**This Month**:
1. Add remaining tools (tickets, migrations, SSL)
2. Implement safety guardrails
3. Add conversation persistence
4. Launch beta to select customers

---

## Questions to Resolve

1. **LLM Provider**: OpenAI or self-hosted model?
2. **Backup Storage**: Where is `/mnt/windows-backup/` mounted?
3. **PowerDNS URL**: What's the actual PDNS API endpoint?
4. **mPanel API**: Does it have REST endpoints for user data?
5. **Human Handoff**: Integrate with Zendesk/Intercom or build custom?
6. **Persistence**: PostgreSQL for chat history or Redis?
7. **Monitoring**: Use existing Grafana setup or separate?

---

**Last Updated**: November 16, 2025  
**Author**: AI Assistant  
**Status**: Draft - Awaiting Review
