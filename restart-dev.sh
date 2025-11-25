#!/bin/bash
# restart-dev.sh - Restart all development servers with fresh environment

set -e

echo "🔄 Restarting MigraHosting Marketing Site Development Environment"
echo "=================================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo -e "${YELLOW}Step 1: Stopping existing processes...${NC}"

# Stop backend
echo "  - Stopping backend API..."
pkill -f "node.*server/index.js" 2>/dev/null && echo "    ✓ Backend stopped" || echo "    ℹ Backend not running"

# Stop Vite (marketing website)
echo "  - Stopping Vite dev server..."
pkill -f "vite.*migrahosting-marketing-site" 2>/dev/null && echo "    ✓ Vite stopped" || echo "    ℹ Vite not running"

sleep 2

echo ""
echo -e "${YELLOW}Step 2: Checking environment files...${NC}"

# Check .env files exist
if [ ! -f ".env" ]; then
    echo -e "  ${RED}✗ .env not found${NC}"
    echo "  Creating .env from .env.example..."
    cp .env.example .env
fi

if [ ! -f ".env.local" ]; then
    echo -e "  ${RED}✗ .env.local not found${NC}"
    echo "  Creating .env.local..."
    cat > .env.local << 'EOF'
# ========== FRONTEND (Vite - all variables MUST start with VITE_) ==========
VITE_PUBLIC_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:4242

# mPanel Control Panel Integration
VITE_MPANEL_API_URL=http://localhost:2271/api
VITE_MPANEL_CONTROL_PANEL_URL=http://localhost:2271

# CMS API
VITE_CMS_API_URL=http://localhost:4243/api/cms

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RrtD0PwKgOrBJUAUgeUwdNCt99KA3FJ4WFew0g6yJKXFKrE3Lb7lQFsSgsQDFL6WCNuCO7bxEfNB6X2f9whMIJp00m1IEwFAJ

# Pricing (Stripe Price IDs)
VITE_PRICE_STARTER_MONTHLY=price_1SQcISPwKgOrBJUApZmVknSP
VITE_PRICE_STARTER_ANNUAL=price_1SQcrFPwKgOrBJUAFmFXOG5T
VITE_PRICE_STARTER_BIENNIAL=price_1SQcrXPwKgOrBJUAcMfAAcZ0
VITE_PRICE_STARTER_TRIENNIAL=price_1SQcsZPwKgOrBJUAIqGL80n9

VITE_PRICE_BUSINESS_MONTHLY=price_1SQcJZPwKgOrBJUAzxYp5rBg
VITE_PRICE_BUSINESS_ANNUAL=price_1SQcmWPwKgOrBJUAHef1Erzv
VITE_PRICE_BUSINESS_BIENNIAL=price_1SQcnPPwKgOrBJUAxakV0pNZ
VITE_PRICE_BUSINESS_TRIENNIAL=price_1SQcnzPwKgOrBJUA0Rh8M5Yh

VITE_PRICE_PREMIUM_MONTHLY=price_1SQcJ2PwKgOrBJUA99qX0j3W
VITE_PRICE_PREMIUM_ANNUAL=price_1SQcpUPwKgOrBJUAjtRWxkre
VITE_PRICE_PREMIUM_BIENNIAL=price_1SQcpmPwKgOrBJUATMrytn3f
VITE_PRICE_PREMIUM_TRIENNIAL=price_1SQcqHPwKgOrBJUANuwraEKI

VITE_PRICE_SETUP_FEE=price_1SQcuGPwKgOrBJUABijIlFwC
EOF
fi

echo -e "  ${GREEN}✓ Environment files ready${NC}"

echo ""
echo -e "${YELLOW}Step 3: Starting backend API...${NC}"

# Start backend in background
cd server
node index.js > /tmp/migrahosting-backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 3

# Check if backend is listening
if lsof -i :4242 > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Backend API running on http://localhost:4242 (PID: $BACKEND_PID)${NC}"
else
    echo -e "  ${RED}✗ Backend failed to start. Check logs:${NC}"
    echo "    tail -f /tmp/migrahosting-backend.log"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 4: Starting Vite dev server...${NC}"
echo "  This will open in a new terminal tab (or run in foreground)..."
echo ""

# Option 1: Run in foreground (recommended for debugging)
echo -e "${GREEN}Running Vite in foreground. Press Ctrl+C to stop.${NC}"
yarn workspace @migrahosting/website dev

# Option 2: Run in background (uncomment if preferred)
# yarn workspace @migrahosting/website dev > /tmp/migrahosting-vite.log 2>&1 &
# VITE_PID=$!
# sleep 5
# 
# if lsof -i :5173 > /dev/null 2>&1; then
#     echo -e "  ${GREEN}✓ Vite dev server running on http://localhost:5173 (PID: $VITE_PID)${NC}"
# else
#     echo -e "  ${RED}✗ Vite failed to start. Check logs:${NC}"
#     echo "    tail -f /tmp/migrahosting-vite.log"
#     exit 1
# fi
# 
# echo ""
# echo -e "${GREEN}========================================${NC}"
# echo -e "${GREEN}✅ All services started successfully!${NC}"
# echo -e "${GREEN}========================================${NC}"
# echo ""
# echo "📋 Service URLs:"
# echo "  Frontend:  http://localhost:5173"
# echo "  Backend:   http://localhost:4242"
# echo "  mPanel:    http://localhost:2271 (start separately)"
# echo "  CMS:       http://localhost:4243 (start separately)"
# echo ""
# echo "📊 Logs:"
# echo "  Backend:   tail -f /tmp/migrahosting-backend.log"
# echo "  Vite:      tail -f /tmp/migrahosting-vite.log"
# echo ""
# echo "🛑 To stop all services:"
# echo "  ./stop-dev.sh"
