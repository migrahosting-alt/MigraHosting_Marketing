#!/bin/bash

echo "===================================="
echo "Stopping MigraHosting Development"
echo "===================================="
echo ""

echo "Stopping AFM Guardian services..."
docker-compose -f docker-compose.afm.yml down

echo ""
echo "Stopping Marketing Site (Vite)..."
pkill -f "vite" || echo "No Vite process found"

echo ""
echo "===================================="
echo "Services Stopped"
echo "===================================="
echo ""
