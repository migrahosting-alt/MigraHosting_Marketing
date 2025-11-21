#!/bin/bash

echo "======================================"
echo "Stopping MigraHosting Production Stack"
echo "======================================"
echo ""

# Kill Node.js processes on known ports
echo "[1/3] Stopping Node.js services..."
lsof -ti:4242,3000,3001,4173 | xargs kill -9 2>/dev/null
echo "✓ Node.js processes stopped"

# Stop Docker containers
echo ""
echo "[2/3] Stopping Docker containers..."
cd mpanel-main
docker-compose down
cd ..
echo "✓ Docker containers stopped"

echo ""
echo "[3/3] Cleanup complete"
echo ""
echo "======================================"
echo "All Services Stopped"
echo "======================================"
