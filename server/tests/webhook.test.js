/**
 * Test Stripe Webhook Events
 * 
 * Usage: node server/tests/webhook.test.js
 * 
 * Tests:
 * - checkout.session.completed
 * - customer.subscription.updated
 * - invoice.paid
 */

const https = require('https');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:4242/webhooks/stripe';
const USE_SIGNATURE = process.env.USE_SIGNATURE !== 'false';

// Mock Stripe events
const mockEvents = {
  checkoutCompleted: {
    id: `evt_test_${Date.now()}`,
    object: 'event',
    api_version: '2024-11-20.acacia',
    created: Math.floor(Date.now() / 1000),
    type: 'checkout.session.completed',
    data: {
      object: {
        id: `cs_test_${Date.now()}`,
        object: 'checkout.session',
        mode: 'subscription',
        status: 'complete',
        customer: `cus_test_${Date.now()}`,
        customer_details: {
          email: 'test@example.com',
          name: 'Test User',
        },
        subscription: `sub_test_${Date.now()}`,
        payment_status: 'paid',
        metadata: {
          plan_name: 'shared-starter',
          utm_source: 'test',
        },
      },
    },
  },
  
  subscriptionUpdated: {
    id: `evt_test_${Date.now() + 1}`,
    object: 'event',
    type: 'customer.subscription.updated',
    data: {
      object: {
        id: `sub_test_${Date.now()}`,
        object: 'subscription',
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
        customer: `cus_test_${Date.now()}`,
      },
    },
  },
  
  invoicePaid: {
    id: `evt_test_${Date.now() + 2}`,
    object: 'event',
    type: 'invoice.paid',
    data: {
      object: {
        id: `in_test_${Date.now()}`,
        object: 'invoice',
        status: 'paid',
        customer: `cus_test_${Date.now()}`,
        subscription: `sub_test_${Date.now()}`,
        amount_due: 999,
        amount_paid: 999,
        amount_remaining: 0,
        subtotal: 999,
        total: 999,
        currency: 'usd',
        created: Math.floor(Date.now() / 1000),
        paid: true,
        attempted: true,
      },
    },
  },
};

async function sendWebhook(event) {
  return new Promise((resolve, reject) => {
    const url = new URL(WEBHOOK_URL);
    const payload = JSON.stringify(event);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    
    // Add Stripe signature header if needed (mock for testing)
    if (USE_SIGNATURE) {
      options.headers['stripe-signature'] = 'mock_signature_for_testing';
    }
    
    const client = url.protocol === 'https:' ? https : require('http');
    
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
        });
      });
    });
    
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Stripe Webhooks\n');
  console.log(`📍 Webhook URL: ${WEBHOOK_URL}`);
  console.log(`🔐 Signature Verification: ${USE_SIGNATURE ? 'Enabled' : 'Disabled'}\n`);
  
  // Test 1: checkout.session.completed
  console.log('Test 1: checkout.session.completed');
  try {
    const response = await sendWebhook(mockEvents.checkoutCompleted);
    console.log(`  ✓ Status: ${response.statusCode}`);
    console.log(`  ✓ Response: ${response.body}\n`);
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
  }
  
  // Test 2: customer.subscription.updated
  console.log('Test 2: customer.subscription.updated');
  try {
    const response = await sendWebhook(mockEvents.subscriptionUpdated);
    console.log(`  ✓ Status: ${response.statusCode}`);
    console.log(`  ✓ Response: ${response.body}\n`);
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
  }
  
  // Test 3: invoice.paid
  console.log('Test 3: invoice.paid');
  try {
    const response = await sendWebhook(mockEvents.invoicePaid);
    console.log(`  ✓ Status: ${response.statusCode}`);
    console.log(`  ✓ Response: ${response.body}\n`);
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
  }
  
  console.log('✅ All tests completed!\n');
}

// Run tests
runTests().catch(console.error);
