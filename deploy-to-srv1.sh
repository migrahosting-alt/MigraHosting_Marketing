#!/bin/bash
set -e

echo "🚀 Deploying MigraHosting Marketing Site to srv1"

# Configuration
LIVE_DIR="/var/www/migrahosting.com/html"
SERVER="root@srv1"

echo "📦 Step 1: Clean rebuild locally with production env..."
rm -rf dist
yarn workspace @migrahosting/website build

echo "📤 Step 2: Upload new build to server..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  dist/ ${SERVER}:${LIVE_DIR}/

echo "✅ Deployment complete!"
echo "🌐 Check: https://migrahosting.com"
echo ""
echo "💡 To force browser cache refresh, append ?v=$(date +%s) to the URL"
echo ""
echo "📝 Note: Build output is in dist/ (Vite workspace default)"
