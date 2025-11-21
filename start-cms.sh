#!/bin/bash

echo "🚀 Starting MigraHosting CMS Stack..."
echo ""

# Start PostgreSQL (shared with mPanel)
echo "📊 Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
  echo "⚠️  PostgreSQL not running. Start it with: sudo systemctl start postgresql"
  echo "   Or if using Docker: cd /path/to/migra-panel && docker compose up -d postgres"
fi

# Start Redis
echo "🔴 Checking Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
  echo "⚠️  Redis not running. Start it with: sudo systemctl start redis"
  echo "   Or if using Docker: cd /path/to/migra-panel && docker compose up -d redis"
fi

# Start MinIO
echo "📦 Checking MinIO..."
if ! curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
  echo "⚠️  MinIO not running. Start it with Docker: cd /path/to/migra-panel && docker compose up -d minio"
fi

echo ""
echo "🔧 Starting CMS Backend..."
cd cms/backend
cp .env.example .env 2>/dev/null || true
npm install --silent
node index.js &
BACKEND_PID=$!

echo "🎨 Starting CMS Admin Panel..."
cd ../admin
npm install --silent
npm run dev &
ADMIN_PID=$!

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   MigraHosting CMS Running!              ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🌐 CMS Backend API: http://localhost:4243"
echo "🎨 Admin Panel:     http://localhost:4244"
echo "📚 API Docs:        http://localhost:4243/api/cms/health"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $ADMIN_PID; exit" INT

# Wait for both processes
wait
