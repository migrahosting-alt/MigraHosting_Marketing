#!/usr/bin/env bash
set -euo pipefail

###
# MigraHosting marketing deploy script
#
# RUN THIS ON: MigraTeck-Main (your local dev box)
# PURPOSE: Build the marketing site and sync it to SRV1:
#          /srv/web/migrahosting.com/public
###

### ── CONFIG ──────────────────────────────────────────────────────────────

# Local repo (where your marketing source code lives)
LOCAL_REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Build command for the marketing site
# If you're using Next.js with `next build && next export`, adjust this.
BUILD_CMD="npm run build"

# Folder that contains the FINAL built static files to upload
# Common examples:
#   - Next.js static export:  out
#   - Plain React/Vite build: dist
#   - Next.js (SSR): .next (then you'd deploy differently)
BUILD_DIR="dist"

# Remote server + path
REMOTE_USER="root"
REMOTE="10.1.10.10"       # Use root@10.1.10.10 for proper permissions
REMOTE_DIR="/srv/web/migrahosting.com/public"

### ── SCRIPT ──────────────────────────────────────────────────────────────

echo "🚀 MigraHosting marketing deploy starting..."
echo "Local repo:    $LOCAL_REPO_DIR"
echo "Build command: $BUILD_CMD"
echo "Build output:  $BUILD_DIR"
echo "Remote:        $REMOTE_USER@$REMOTE:$REMOTE_DIR"
echo

# 1) Go to repo
cd "$LOCAL_REPO_DIR"

# 2) Install deps (first time / when package.json changes)
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules missing, running npm install..."
  npm install
fi

# 3) Build
echo "🏗  Building site..."
eval "$BUILD_CMD"

# 4) Verify build output exists

# 4) Verify build output exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build directory '$BUILD_DIR' not found. Run the website build first."
  exit 1
fi

# 5) Sync to SRV1
echo "📡 Syncing files to $REMOTE_USER@$REMOTE:$REMOTE_DIR ..."
rsync -avz --delete \
  "$BUILD_DIR"/ \
  "$REMOTE_USER@$REMOTE:$REMOTE_DIR/"

# 6) Quick remote sanity check
echo
echo "🔎 Running remote sanity check..."
ssh "$REMOTE_USER@$REMOTE" "ls -lah $REMOTE_DIR | head && echo && curl -I -H 'Host: migrahosting.com' http://127.0.0.1 | head -n 5 || true"

echo
echo "✅ Deploy complete."
echo "Test in browser:"
echo "  https://migrahosting.com/pricing"
echo "  https://migrahosting.com/cart"
echo "  https://migrahosting.com/checkout"
