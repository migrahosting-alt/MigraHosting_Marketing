#!/bin/bash

echo "======================================"
echo "Starting MigraHosting Development Stack"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env files exist
echo "[1/6] Checking environment configuration..."
if [ ! -f .env ]; then
    echo -e "${YELLOW}WARNING: Root .env not found. Copying from .env.example${NC}"
    cp .env.example .env
fi

if [ ! -f apps/website/.env ]; then
    echo -e "${YELLOW}WARNING: apps/website/.env not found. Copying from .env.example${NC}"
    cp apps/website/.env.example apps/website/.env
fi

if [ ! -f server/.env ]; then
    echo -e "${YELLOW}WARNING: server/.env not found. Copying from .env.example${NC}"
    cp server/.env.example server/.env
fi

if [ ! -f mpanel-main/.env ]; then
    echo -e "${YELLOW}WARNING: mpanel-main/.env not found. Copying from .env.example${NC}"
    cp mpanel-main/.env.example mpanel-main/.env
fi

echo -e "${GREEN}✓ Environment files checked${NC}"

# Check if Docker is running
echo ""
echo "[2/6] Checking Docker..."
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker is not running!${NC}"
    echo "Please start Docker and try again."
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

# Start mPanel infrastructure (PostgreSQL, Redis, MinIO, Prometheus, Grafana)
echo ""
echo "[3/6] Starting mPanel infrastructure..."
cd mpanel-main
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to start infrastructure${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✓ Infrastructure started${NC}"

# Wait for databases to be ready
echo ""
echo "[4/6] Waiting for databases to initialize..."
sleep 8

# Run database migrations
echo ""
echo "[5/6] Running database migrations..."
cd mpanel-main
npm run migrate 2>&1 | tail -10
MIGRATION_STATUS=$?
cd ..

if [ $MIGRATION_STATUS -ne 0 ]; then
    echo -e "${YELLOW}WARNING: Migration completed with warnings. Check output above.${NC}"
else
    echo -e "${GREEN}✓ Migrations complete${NC}"
fi

# Create log directories
mkdir -p server/logs
mkdir -p mpanel-main/logs

# Start all services
echo ""
echo "[6/6] Starting all development services..."
echo ""

# Use tmux or screen if available, otherwise use background processes
if command -v tmux &> /dev/null; then
    echo "Starting services in tmux session 'migrahosting'..."
    
    tmux new-session -d -s migrahosting
    
    # Window 0: Marketing Backend
    tmux rename-window -t migrahosting:0 'Marketing-BE'
    tmux send-keys -t migrahosting:0 'cd server && node index.js' C-m
    
    # Window 1: Marketing Frontend
    tmux new-window -t migrahosting -n 'Marketing-FE'
    tmux send-keys -t migrahosting:1 'cd apps/website && npm run dev' C-m
    
    # Window 2: mPanel Backend
    tmux new-window -t migrahosting -n 'mPanel-BE'
    tmux send-keys -t migrahosting:2 'cd mpanel-main && npm run dev' C-m
    
    # Window 3: mPanel Frontend
    tmux new-window -t migrahosting -n 'mPanel-FE'
    tmux send-keys -t migrahosting:3 'cd mpanel-main/frontend && npm run dev' C-m
    
    echo -e "${GREEN}✓ All services started in tmux${NC}"
    echo ""
    echo "To attach to the tmux session:"
    echo "  tmux attach -t migrahosting"
    echo ""
    echo "To switch between windows:"
    echo "  Ctrl+b then 0, 1, 2, or 3"
    echo ""
    echo "To detach from tmux:"
    echo "  Ctrl+b then d"
    echo ""
    
else
    echo "Starting services in background..."
    
    # Start marketing backend
    cd server
    node index.js > logs/backend.log 2>&1 &
    MARKETING_BACKEND_PID=$!
    echo "Marketing Backend PID: $MARKETING_BACKEND_PID (port 4242)"
    cd ..
    
    # Start mPanel backend
    cd mpanel-main
    npm run dev > logs/backend.log 2>&1 &
    MPANEL_BACKEND_PID=$!
    echo "mPanel Backend PID: $MPANEL_BACKEND_PID (port 3000)"
    cd ..
    
    # Start mPanel frontend
    cd mpanel-main/frontend
    npm run dev > ../logs/frontend.log 2>&1 &
    MPANEL_FRONTEND_PID=$!
    echo "mPanel Frontend PID: $MPANEL_FRONTEND_PID (port 3001)"
    cd ../..
    
    # Start marketing frontend
    cd apps/website
    npm run dev > ../../server/logs/marketing-frontend.log 2>&1 &
    MARKETING_FRONTEND_PID=$!
    echo "Marketing Frontend PID: $MARKETING_FRONTEND_PID (port 5173)"
    cd ../..
    
    echo -e "${GREEN}✓ All services started${NC}"
    
    # Save PIDs for cleanup
    echo "$MARKETING_BACKEND_PID" > .pids
    echo "$MPANEL_BACKEND_PID" >> .pids
    echo "$MPANEL_FRONTEND_PID" >> .pids
    echo "$MARKETING_FRONTEND_PID" >> .pids
fi

sleep 5

# Health checks
echo ""
echo "Performing health checks..."
echo ""

if curl -s http://localhost:4242/health >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Marketing Backend (port 4242)${NC}"
else
    echo -e "${YELLOW}⏳ Marketing Backend (port 4242) - still starting...${NC}"
fi

if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✓ mPanel Backend (port 3000)${NC}"
else
    echo -e "${YELLOW}⏳ mPanel Backend (port 3000) - still starting...${NC}"
fi

echo ""
echo "======================================"
echo "Development Stack Started!"
echo "======================================"
echo ""
echo "Services:"
echo "  - Marketing Site:     http://localhost:5173"
echo "  - Marketing Backend:  http://localhost:4242"
echo "  - mPanel Dashboard:   http://localhost:3001"
echo "  - mPanel API:         http://localhost:3000"
echo ""
echo "Infrastructure:"
echo "  - PostgreSQL:         localhost:5432"
echo "  - Redis:              localhost:6379"
echo "  - MinIO:              http://localhost:9000"
echo "  - MinIO Console:      http://localhost:9001"
echo "  - Prometheus:         http://localhost:9090"
echo "  - Grafana:            http://localhost:3002"
echo ""
echo "Documentation:"
echo "  - Setup Guide:        SETUP_GUIDE.md"
echo "  - Architecture:       mpanel-main/ARCHITECTURE.md"
echo "  - API Examples:       mpanel-main/API_EXAMPLES.md"
echo ""
echo "To stop all services:"
echo "  ./stop-all-dev.sh"
echo ""
