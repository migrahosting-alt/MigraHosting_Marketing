#!/bin/bash

# MigraHosting - Start All Services for Integration Testing
# This script starts the CMS backend, CMS admin panel, and marketing website

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  MigraHosting - Starting All Services                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if running from correct directory
if [ ! -d "cms" ] || [ ! -d "apps/website" ]; then
    echo "❌ Error: Must run from project root directory"
    echo "   Expected: /home/bonex/MigraWeb/MigraHosting/dev/migrahosting-marketing-site"
    exit 1
fi

echo "📋 Prerequisites Check..."
echo ""

# Check PostgreSQL
if ! lsof -ti:5433 > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL not running on port 5433"
    echo "   Start with: docker compose -f docker-compose.afm.yml up -d postgres"
fi

# Check Redis
if ! lsof -ti:6379 > /dev/null 2>&1; then
    echo "⚠️  Redis not running on port 6379"
    echo "   Start with: docker compose -f docker-compose.afm.yml up -d redis"
fi

# Check MinIO
if ! lsof -ti:9000 > /dev/null 2>&1; then
    echo "⚠️  MinIO not running on port 9000"
    echo "   Start with: docker compose -f docker-compose.afm.yml up -d minio"
fi

echo ""
echo "🚀 Starting Services..."
echo ""

# Kill existing processes on our ports
echo "   Cleaning up old processes..."
lsof -ti:4243 | xargs kill -9 2>/dev/null || true  # CMS Backend
pkill -f "vite.*admin" 2>/dev/null || true         # CMS Admin
pkill -f "vite.*website" 2>/dev/null || true       # Marketing Site

sleep 2

# Start CMS Backend
echo "   [1/3] Starting CMS Backend (port 4243)..."
cd cms/backend
node index.js > backend.log 2>&1 &
CMS_BACKEND_PID=$!
cd ../..
sleep 3

# Verify CMS Backend started
if curl -s http://localhost:4243/api/cms/health | grep -q "healthy"; then
    echo "      ✅ CMS Backend running"
else
    echo "      ❌ CMS Backend failed to start"
    echo "         Check: cms/backend/backend.log"
fi

# Start CMS Admin Panel
echo "   [2/3] Starting CMS Admin Panel (port 4244)..."
cd cms/admin
npm run dev > admin.log 2>&1 &
CMS_ADMIN_PID=$!
cd ../..
sleep 5

# Verify CMS Admin started
if lsof -ti:4244 > /dev/null 2>&1; then
    echo "      ✅ CMS Admin Panel running"
else
    echo "      ❌ CMS Admin Panel failed to start"
    echo "         Check: cms/admin/admin.log"
fi

# Start Marketing Website
echo "   [3/3] Starting Marketing Website (port 5173)..."
cd apps/website
yarn dev > website.log 2>&1 &
WEBSITE_PID=$!
cd ../..
sleep 5

# Verify Marketing Website started
if lsof -ti:5173 > /dev/null 2>&1; then
    echo "      ✅ Marketing Website running"
else
    echo "      ❌ Marketing Website failed to start"
    echo "         Check: apps/website/website.log"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  All Services Started!                                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📡 SERVICE URLS:"
echo ""
echo "   CMS Backend:       http://localhost:4243"
echo "   CMS Admin Panel:   http://localhost:4244"
echo "   Marketing Website: http://localhost:5173"
echo ""
echo "🧪 TESTING WORKFLOW:"
echo ""
echo "   1. Create content in CMS Admin:"
echo "      → http://localhost:4244/blog/new"
echo ""
echo "   2. View on Marketing Site:"
echo "      → http://localhost:5173/"
echo "      → http://localhost:5173/blog"
echo "      → http://localhost:5173/status"
echo ""
echo "📝 PROCESS IDs:"
echo "   CMS Backend: $CMS_BACKEND_PID"
echo "   CMS Admin:   $CMS_ADMIN_PID"
echo "   Website:     $WEBSITE_PID"
echo ""
echo "🛑 TO STOP ALL SERVICES:"
echo "   kill $CMS_BACKEND_PID $CMS_ADMIN_PID $WEBSITE_PID"
echo "   OR run: ./stop-all-services.sh"
echo ""
echo "✅ Ready for testing! 🚀"
echo ""
