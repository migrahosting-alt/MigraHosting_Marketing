# AFM Guardian (Abigail) Chat Integration - Quick Start Guide

## ✅ What's Been Added

### 1. Chat Component
**File**: `apps/website/src/components/AfmGuardianChat.tsx`
- Floating chat button (bottom-right, purple gradient)
- Full-featured chat UI with auto/manual modes
- Message history and debug tools
- Styled to match MigraHosting branding

### 2. Environment Configuration
**Files**: 
- `apps/website/.env`
- `apps/website/.env.example`

New variables:
```env
VITE_AFM_GATEWAY_URL=http://localhost:8080
VITE_AFM_PUBLIC_TOKEN=demo.token
```

### 3. Integration Points
Chat widget added to:
- **Support Page** (`apps/website/src/pages/Support.tsx`) - Replaced placeholder "Start Live Chat" link
- **Home Page** (`apps/website/src/pages/Home.jsx`) - Floating button available site-wide

### 4. Docker Services
**File**: `docker-compose.afm.yml`

Three services configured:
- **afm-gateway** (port 8080) - Public API entry point
- **afm-orchestrator** (port 8090) - LLM-powered tool router  
- **afm-adapters** (port 8095) - Backend connectors

### 5. Startup Scripts

**Windows**: 
- `start-all-dev.bat` - Start all services
- `stop-all-dev.bat` - Stop AFM services

**Linux/Mac**:
- `start-all-dev.sh` - Start all services
- `stop-all-dev.sh` - Stop all services

---

## 🚀 How to Start Everything

### Prerequisites
1. Docker Desktop running
2. Node.js 20+ installed
3. OpenAI API key (optional, for LLM features)

### Option 1: Automatic Startup (Windows)
```bat
start-all-dev.bat
```

This will:
1. Start AFM Gateway, Orchestrator, and Adapters in Docker
2. Wait for services to be ready
3. Open new terminal for marketing site (Vite)
4. Display service URLs

### Option 2: Automatic Startup (Linux/Mac)
```bash
chmod +x start-all-dev.sh stop-all-dev.sh
./start-all-dev.sh
```

### Option 3: Manual Startup

1. **Start AFM Services**:
```bash
docker-compose -f docker-compose.afm.yml up -d
```

2. **Start Marketing Site**:
```bash
cd apps/website
npm run dev
```

3. **Verify Services**:
```bash
curl http://localhost:8080/health  # Gateway
curl http://localhost:8090/health  # Orchestrator  
curl http://localhost:8095/health  # Adapters
```

---

## 🧪 Testing the Chat

### 1. Visit Marketing Site
Open http://localhost:5173 in your browser

### 2. Look for Chat Button
You'll see a purple floating button with "A" in the bottom-right corner

### 3. Test Auto Mode (LLM)
Click the button and try:
- "Check DNS for migrahosting.com"
- "Show me my backups"
- "Get user summary for demo@example.com"

### 4. Test Manual Mode
- Click "Manual" tab
- Select a tool from dropdown
- Enter domain/email
- Click Send

### 5. Expected Behavior
With services running, you'll get:
- **Auto Mode**: LLM decides which tool to use
- **Manual Mode**: You select the tool directly
- **Stub Data**: Adapters return fake data (until connected to real backends)

---

## 📝 Configuration

### LLM Setup (Optional)
To enable LLM-powered tool selection:

1. **Get OpenAI API Key**: https://platform.openai.com/api-keys

2. **Create `.env` in project root**:
```env
LLM_API_KEY=sk-your-key-here
LLM_MODEL=gpt-4o-mini
LLM_API_URL=https://api.openai.com/v1
```

3. **Restart Services**:
```bash
docker-compose -f docker-compose.afm.yml down
docker-compose -f docker-compose.afm.yml up -d
```

Without LLM key, orchestrator falls back to basic regex matching.

### Custom Gateway URL
If deploying to production, update `apps/website/.env`:
```env
VITE_AFM_GATEWAY_URL=https://your-domain.com
VITE_AFM_PUBLIC_TOKEN=your-production-token
```

---

## 🛠️ Development Workflow

### View Logs
```bash
# All services
docker-compose -f docker-compose.afm.yml logs -f

# Specific service
docker-compose -f docker-compose.afm.yml logs -f afm-gateway
docker-compose -f docker-compose.afm.yml logs -f afm-orchestrator
docker-compose -f docker-compose.afm.yml logs -f afm-adapters
```

### Restart a Service
```bash
docker-compose -f docker-compose.afm.yml restart afm-gateway
```

### Rebuild After Code Changes
```bash
docker-compose -f docker-compose.afm.yml up --build -d
```

### Stop Everything
```bash
# Windows
stop-all-dev.bat

# Linux/Mac
./stop-all-dev.sh

# Manual
docker-compose -f docker-compose.afm.yml down
```

---

## 🔌 Next Steps (Phase 2+)

### Connect to Real Backends

**1. PowerDNS Integration**:
Edit `docker-compose.afm.yml`:
```yaml
afm-adapters:
  environment:
    - PDNS_API_URL=http://your-pdns-server:8081
    - PDNS_API_KEY=your-actual-key
```

**2. mPanel Integration**:
```yaml
afm-adapters:
  environment:
    - MPANEL_API_BASE=http://host.docker.internal:3002
    - MPANEL_API_TOKEN=your-mpanel-token
```

**3. Backup Storage**:
```yaml
afm-adapters:
  environment:
    - BACKUP_STORAGE_PATH=/mnt/windows-backup
  volumes:
    - /mnt/windows-backup:/mnt/backups:ro
```

### Add to mPanel Control Panel
See `AFM_GUARDIAN_INTEGRATION_PLAN.md` Phase 2 for details on:
- Extracting mpanel-main.zip
- Adding chat to mPanel dashboard
- JWT authentication
- User context passing

### Add More Tools
Edit `migra-afm-guardian-complete-v2/services/orchestrator/src/index.ts`:
```typescript
registry.set("billing_get_invoices", {
  schema: z.object({ limit: z.number().optional() }),
  handler: async (input, { actor }) => {
    // Implementation
  }
});
```

---

## 📚 Resources

- **Full Integration Plan**: `AFM_GUARDIAN_INTEGRATION_PLAN.md`
- **AFM Architecture**: `migra-afm-guardian-complete-v2/README.md`
- **Copilot Instructions**: `migra-afm-guardian-complete-v2/COPILOT_INSTRUCTIONS.md`

---

## ❓ Troubleshooting

### Chat button not appearing
- Check browser console for errors
- Verify `.env` file has AFM variables
- Restart Vite dev server

### "Error contacting AFM Gateway"
- Verify Docker services are running: `docker ps`
- Check gateway health: `curl http://localhost:8080/health`
- View logs: `docker-compose -f docker-compose.afm.yml logs -f`

### LLM not working
- Verify `LLM_API_KEY` in `.env`
- Check orchestrator logs for LLM errors
- Try manual mode instead

### Port conflicts
- Gateway: 8080
- Orchestrator: 8090
- Adapters: 8095
- Marketing Site: 5173

If ports conflict, update `docker-compose.afm.yml` and restart.

---

## 🎯 Success Criteria

✅ Docker services running (3 containers)
✅ Marketing site on localhost:5173
✅ Chat button visible (bottom-right)
✅ Can send messages in auto/manual mode
✅ Receives responses (stub data OK for now)
✅ No console errors

---

**Last Updated**: November 16, 2025
**Status**: Phase 1 Complete - Marketing Site Integration ✅
