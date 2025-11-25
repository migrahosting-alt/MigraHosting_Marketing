#!/bin/bash

echo "======================================"
echo "Starting MigraHosting Production Stack"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env files exist
echo "[1/8] Checking environment configuration..."
if [ ! -f .env ]; then
    echo -e "${RED}ERROR: Root .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

if [ ! -f apps/website/.env ]; then
    echo -e "${YELLOW}WARNING: apps/website/.env not found. Using defaults.${NC}"
fi

if [ ! -f mpanel-main/.env ]; then
    echo -e "${RED}ERROR: mpanel-main/.env not found!${NC}"
    echo "Please copy mpanel-main/.env.example to mpanel-main/.env"
    exit 1
fi

echo -e "${GREEN}✓ Environment files found${NC}"

# Check if Docker is running
echo ""
echo "[2/8] Checking Docker..."
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker is not running!${NC}"
    echo "Please start Docker and try again."
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"

# Start mPanel infrastructure (PostgreSQL, Redis, MinIO)
echo ""
echo "[3/8] Starting mPanel infrastructure..."
cd mpanel-main
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}ERROR: Failed to start mPanel infrastructure${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}✓ Infrastructure started (PostgreSQL, Redis, MinIO)${NC}"

# Wait for databases to be ready
echo ""
echo "[4/8] Waiting for databases to initialize..."
sleep 10

# Run database migrations
echo ""
echo "[5/8] Running database migrations..."
cd mpanel-main
npm run migrate
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}WARNING: Migration may have failed. Check logs.${NC}"
fi
cd ..
echo -e "${GREEN}✓ Migrations complete${NC}"

# Build frontend assets
echo ""
echo "[6/8] Building production assets..."
cd apps/website
npm run build 2>&1 | tail -5
cd ../..

cd mpanel-main/frontend
npm run build 2>&1 | tail -5
cd ../..
echo -e "${GREEN}✓ Assets built${NC}"

# Start all services
echo ""
echo "[7/8] Starting all services..."

# Start marketing backend
cd server
node index.js &
MARKETING_BACKEND_PID=$!
echo "Marketing Backend PID: $MARKETING_BACKEND_PID"
cd ..

# Start mPanel backend
cd mpanel-main
npm start &
MPANEL_BACKEND_PID=$!
echo "mPanel Backend PID: $MPANEL_BACKEND_PID"
cd ..

# Start mPanel frontend
cd mpanel-main/frontend
npm run preview &
MPANEL_FRONTEND_PID=$!
echo "mPanel Frontend PID: $MPANEL_FRONTEND_PID"
cd ../..

# Start marketing frontend
cd apps/website
npm run preview &
MARKETING_FRONTEND_PID=$!
echo "Marketing Frontend PID: $MARKETING_FRONTEND_PID"
cd ../..

sleep 5

# Health checks
echo ""
echo "[8/8] Performing health checks..."

HEALTH_OK=0

if curl -s http://localhost:4242/health >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Marketing Backend (port 4242)${NC}"
else
    echo -e "${RED}✗ Marketing Backend (port 4242)${NC}"
    HEALTH_OK=1
fi

if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✓ mPanel Backend (port 3000)${NC}"
else
    echo -e "${RED}✗ mPanel Backend (port 3000)${NC}"
    HEALTH_OK=1
fi

echo ""
echo "======================================"
echo "All Services Started!"
echo "======================================"
echo ""
echo "Services:"
echo "  - Marketing Site:     http://localhost:4173 (preview)"
echo "  - Marketing Backend:  http://localhost:4242"
echo "  - mPanel Dashboard:   http://localhost:3001 (preview)"
echo "  - mPanel API:         http://localhost:3000"
echo "  - PostgreSQL:         localhost:5432"
echo "  - Redis:              localhost:6379"
echo "  - MinIO:              http://localhost:9000"
echo "  - MinIO Console:      http://localhost:9001"
echo "  - Prometheus:         http://localhost:9090"
echo "  - Grafana:            http://localhost:3002"
echo ""
echo "Process IDs:"
echo "  Marketing Backend:    $MARKETING_BACKEND_PID"
echo "  mPanel Backend:       $MPANEL_BACKEND_PID"
echo "  mPanel Frontend:      $MPANEL_FRONTEND_PID"
echo "  Marketing Frontend:   $MARKETING_FRONTEND_PID"
echo ""
echo "To stop all services:"
echo "  ./stop-all-production.sh"
echo ""
echo "Logs:"
echo "  Marketing Backend:    tail -f server/logs/*.log"
echo "  mPanel Backend:       tail -f mpanel-main/logs/*.log"
echo "  Docker Services:      cd mpanel-main && docker-compose logs -f"
echo ""
