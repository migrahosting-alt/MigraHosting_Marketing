#!/bin/bash
# ============================================================================
# Start All Services - mPanel + AFM Guardian Integration
# ============================================================================

set -e

echo ""
echo "========================================"
echo " MigraHosting Full Stack Startup"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "[ERROR] Docker is not running. Please start Docker first."
    exit 1
fi

echo "[1/5] Starting AFM Guardian services..."
docker-compose -f docker-compose.afm.yml up -d

echo ""
echo "[2/5] Waiting for services to be healthy..."
sleep 5

echo ""
echo "[3/5] Starting mPanel backend (port 3002)..."
(cd mpanel-main && npm run dev) &
MPANEL_BACKEND_PID=$!

echo ""
echo "[4/5] Starting mPanel frontend (port 3001)..."
sleep 2
(cd mpanel-main/frontend && npm run dev) &
MPANEL_FRONTEND_PID=$!

echo ""
echo "[5/5] Starting marketing site (port 5173)..."
sleep 2
(cd apps/website && npm run dev) &
MARKETING_PID=$!

echo ""
echo "========================================"
echo " All Services Started!"
echo "========================================"
echo ""
echo " AFM Guardian Gateway: http://localhost:8080"
echo " AFM Orchestrator:     http://localhost:8090"
echo " AFM Adapters:         http://localhost:8095"
echo ""
echo " mPanel Frontend:      http://localhost:3001 (with Abigail chat)"
echo " mPanel Backend:       http://localhost:3002"
echo ""
echo " Marketing Site:       http://localhost:5173 (with Abigail chat)"
echo ""
echo "========================================"
echo ""
echo "Background PIDs:"
echo " mPanel Backend:  $MPANEL_BACKEND_PID"
echo " mPanel Frontend: $MPANEL_FRONTEND_PID"
echo " Marketing Site:  $MARKETING_PID"
echo ""
echo "To stop all services:"
echo " docker-compose -f docker-compose.afm.yml down"
echo " kill $MPANEL_BACKEND_PID $MPANEL_FRONTEND_PID $MARKETING_PID"
echo ""
