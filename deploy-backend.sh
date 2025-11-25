#!/bin/bash

# Deploy Backend Server to srv1
# This script deploys the Node.js Express backend with Stripe integration

set -e  # Exit on error

echo "🚀 Deploying MigraHosting Backend to srv1"
echo ""

SERVER="root@10.1.10.10"
REMOTE_DIR="/srv/web/migrahosting-backend"
LOCAL_DIR="server"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Step 1: Preparing backend files...${NC}"

# Create a temporary directory for deployment
TEMP_DIR=$(mktemp -d)
echo "Created temp directory: $TEMP_DIR"

# Copy backend files
cp -r server/* $TEMP_DIR/
cp .env $TEMP_DIR/.env
cp package.json $TEMP_DIR/package.json 2>/dev/null || true
cp yarn.lock $TEMP_DIR/yarn.lock 2>/dev/null || true

# Copy Prisma files
mkdir -p $TEMP_DIR/prisma
cp -r prisma/schema.prisma $TEMP_DIR/prisma/
cp -r prisma/migrations $TEMP_DIR/prisma/

echo -e "${BLUE}📤 Step 2: Uploading to server...${NC}"

# Create remote directory if it doesn't exist
ssh $SERVER "mkdir -p $REMOTE_DIR"

# Upload files
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'data.sqlite' \
  --exclude 'dev.db' \
  --exclude '*.log' \
  $TEMP_DIR/ $SERVER:$REMOTE_DIR/

# Clean up temp directory
rm -rf $TEMP_DIR

echo -e "${BLUE}🔧 Step 3: Installing dependencies on server...${NC}"

ssh $SERVER << 'ENDSSH'
cd /srv/web/migrahosting-backend

# Install dependencies (use legacy peer deps to handle React 19)
echo "Installing Node.js dependencies..."
npm install --legacy-peer-deps

# Run Prisma migrations (use 5.22.0 to match local)
echo "Running database migrations..."
npx prisma@5.22.0 generate
npx prisma@5.22.0 migrate deploy

# Create systemd service if it doesn't exist
if [ ! -f /etc/systemd/system/migrahosting-backend.service ]; then
  echo "Creating systemd service..."
  cat > /etc/systemd/system/migrahosting-backend.service << 'EOF'
[Unit]
Description=MigraHosting Marketing Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/srv/web/migrahosting-backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable migrahosting-backend.service
fi

# Restart the service
echo "Restarting backend service..."
systemctl restart migrahosting-backend.service
systemctl status migrahosting-backend.service --no-pager

echo "✅ Backend deployment complete!"
echo ""
echo "📊 Service Status:"
systemctl status migrahosting-backend.service --no-pager | head -10
echo ""
echo "📝 Recent logs:"
journalctl -u migrahosting-backend.service -n 20 --no-pager

ENDSSH

echo ""
echo -e "${GREEN}✅ Backend deployment complete!${NC}"
echo ""
echo "🌐 Backend running on: http://10.1.10.10:4242"
echo "🔗 Webhook endpoint: http://10.1.10.10:4242/webhooks/stripe"
echo ""
echo "📊 Check logs: ssh root@10.1.10.10 'journalctl -u migrahosting-backend.service -f'"
echo "🔄 Restart: ssh root@10.1.10.10 'systemctl restart migrahosting-backend.service'"
echo ""
