#!/bin/bash

# MigraHosting - Stop All Integration Testing Services

echo "🛑 Stopping all integration testing services..."
echo ""

# Stop CMS Backend (port 4243)
if lsof -ti:4243 > /dev/null 2>&1; then
    echo "   Stopping CMS Backend (port 4243)..."
    lsof -ti:4243 | xargs kill -9 2>/dev/null
    echo "   ✅ CMS Backend stopped"
else
    echo "   ⚪ CMS Backend not running"
fi

# Stop CMS Admin Panel (port 4244)
if pkill -f "vite.*admin" > /dev/null 2>&1; then
    echo "   ✅ CMS Admin Panel stopped"
else
    echo "   ⚪ CMS Admin Panel not running"
fi

# Stop Marketing Website (port 5173)
if pkill -f "vite.*website" > /dev/null 2>&1; then
    echo "   ✅ Marketing Website stopped"
else
    echo "   ⚪ Marketing Website not running"
fi

echo ""
echo "✅ All services stopped!"
echo ""
