#!/bin/bash

# Deploy Subscription Backend to mPanel (10.1.10.206)
# This integrates Stripe subscription features into the existing mPanel backend

set -e  # Exit on error

echo "🚀 Integrating Subscription Backend into mPanel"
echo ""

MPANEL_SERVER="root@10.1.10.206"
MPANEL_DIR="/home/bonex/MigraWeb/MigraHosting/dev/migra-panel"
LOCAL_DIR="server"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📦 Step 1: Preparing subscription backend files...${NC}"

# Create temp directory
TEMP_DIR=$(mktemp -d)
echo "Created temp directory: $TEMP_DIR"

# Create directory structure
mkdir -p $TEMP_DIR/server/{lib,services,config}
mkdir -p $TEMP_DIR/prisma/migrations/20251124110347_subscriptions_core

# Copy Stripe webhook handler
cp server/lib/stripe-webhook.js $TEMP_DIR/server/lib/

# Copy tenant provisioning service
cp server/services/tenantProvisioningService.js $TEMP_DIR/server/services/

# Copy Stripe config
cp server/config/stripe.config.js $TEMP_DIR/server/config/

# Copy Prisma schema (we'll merge this manually)
cp prisma/schema.prisma $TEMP_DIR/prisma/

# Copy subscription migration
cp prisma/migrations/20251124110347_subscriptions_core/migration.sql $TEMP_DIR/prisma/migrations/20251124110347_subscriptions_core/

# Copy test scripts
mkdir -p $TEMP_DIR/server/tests
cp server/tests/*.js $TEMP_DIR/server/tests/ || true
cp server/tests/README.md $TEMP_DIR/server/tests/ || true

echo -e "${BLUE}📤 Step 2: Uploading to mPanel server...${NC}"

# Upload files to mPanel server
rsync -avz $TEMP_DIR/ $MPANEL_SERVER:$MPANEL_DIR/subscription-integration/

# Clean up temp directory
rm -rf $TEMP_DIR

echo -e "${BLUE}🔧 Step 3: Integrating into mPanel...${NC}"

ssh $MPANEL_SERVER << 'ENDSSH'
cd /home/bonex/MigraWeb/MigraHosting/dev/migra-panel

echo "Files uploaded to: subscription-integration/"
echo ""
echo "📋 Integration checklist:"
echo ""
echo "1. Prisma Schema:"
echo "   - Review: subscription-integration/prisma/schema.prisma"
echo "   - Merge subscription models into your main schema"
echo "   - Or use the migration directly"
echo ""
echo "2. Run Migration:"
echo "   cd backend"
echo "   npx prisma migrate deploy"
echo "   npx prisma generate"
echo ""
echo "3. Copy Backend Files:"
echo "   cp subscription-integration/server/lib/stripe-webhook.js backend/src/lib/"
echo "   cp subscription-integration/server/services/tenantProvisioningService.js backend/src/services/"
echo "   cp subscription-integration/server/config/stripe.config.js backend/src/config/"
echo ""
echo "4. Add Webhook Route (in backend/src/routes/index.js):"
echo "   import { handleStripeEvent } from '../lib/stripe-webhook.js';"
echo "   "
echo "   app.post('/webhooks/stripe',"
echo "     express.raw({ type: 'application/json' }),"
echo "     async (req, res) => {"
echo "       const sig = req.headers['stripe-signature'];"
echo "       let event = stripe.webhooks.constructEvent("
echo "         req.body, sig, process.env.STRIPE_WEBHOOK_SECRET"
echo "       );"
echo "       await handleStripeEvent(event);"
echo "       res.json({ received: true });"
echo "     }"
echo "   );"
echo ""
echo "5. Add Checkout Endpoint (in backend/src/routes/index.js):"
echo "   app.get('/api/marketing/checkout-session/:sessionId', async (req, res) => {"
echo "     const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);"
echo "     const subscription = await prisma.subscription.findUnique({"
echo "       where: { checkoutSessionId: req.params.sessionId }"
echo "     });"
echo "     res.json({ session, subscription });"
echo "   });"
echo ""
echo "6. Environment Variables (.env):"
echo "   STRIPE_SECRET_KEY=sk_test_..."
echo "   STRIPE_WEBHOOK_SECRET=whsec_..."
echo "   MPANEL_API_KEY=JMDYuq0cE-zht5N4JlCvZ-kmZGy7h9lCHp47vVBn_taIKBO9TyjVJeHYUzfG7SpU"
echo ""
echo "7. Configure Stripe Webhook:"
echo "   Dashboard: https://dashboard.stripe.com/webhooks"
echo "   URL: https://migrapanel.com/webhooks/stripe"
echo "   Events: checkout.session.completed, customer.subscription.*, invoice.*"
echo ""
echo "8. Restart mPanel backend:"
echo "   pm2 restart mpanel-backend"
echo ""

ENDSSH

echo ""
echo -e "${GREEN}✅ Files uploaded to mPanel!${NC}"
echo ""
echo -e "${YELLOW}📍 Next Steps:${NC}"
echo "1. SSH to mPanel: ssh root@10.1.10.206"
echo "2. Review uploaded files: cd $MPANEL_DIR/subscription-integration/"
echo "3. Follow integration checklist above"
echo "4. Test webhook: stripe listen --forward-to https://migrapanel.com/webhooks/stripe"
echo ""
echo -e "${GREEN}🎯 Webhook URL for Stripe Dashboard:${NC}"
echo "   https://migrapanel.com/webhooks/stripe"
echo ""
