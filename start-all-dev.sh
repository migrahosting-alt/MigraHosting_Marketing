#!/bin/bash

echo "===================================="
echo "Starting MigraHosting Development"
echo "===================================="
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "[1/4] Starting AFM Guardian services (Abigail AI Chat)..."
docker-compose -f docker-compose.afm.yml up -d

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start AFM Guardian services"
    exit 1
fi

echo ""
echo "[2/4] Waiting for services to be ready..."
sleep 5

echo "[3/4] Checking service health..."
if ! curl -s http://localhost:8080/health >/dev/null 2>&1; then
    echo "WARNING: AFM Gateway may not be ready yet"
    echo "You can check logs with: docker-compose -f docker-compose.afm.yml logs -f"
fi

echo ""
echo "[4/4] Starting Marketing Site..."
echo ""

# Start Vite in background
cd apps/website
npm run dev &
VITE_PID=$!

cd ../..

echo ""
echo "===================================="
echo "All Services Started!"
echo "===================================="
echo ""
echo "Services:"
echo "  - AFM Gateway:    http://localhost:8080"
echo "  - Orchestrator:   http://localhost:8090"
echo "  - Adapters:       http://localhost:8095"
echo "  - Marketing Site: http://localhost:5173"
echo ""
echo "Marketing Site PID: $VITE_PID"
echo ""
echo "To stop all services, run: ./stop-all-dev.sh"
echo ""
