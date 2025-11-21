// test-webhook.js - Simulate Stripe webhook events locally
import crypto from 'crypto';
import fetch from 'node-fetch';

const WEBHOOK_SECRET = 'whsec_8618da89145dd540f81828407ae913f57981e1206ccf10a646709a481c549a5f';
const WEBHOOK_URL = 'http://127.0.0.1:4242/webhooks/stripe';

// Create a valid Stripe signature
function createStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const timestampedPayload = `${timestamp}.${payload}`;
  const signature = crypto.createHmac('sha256', secret).update(timestampedPayload).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

// Test checkout.session.completed event
async function testCheckoutCompleted() {
  const payload = JSON.stringify({
    id: "evt_test_webhook",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_session123",
        object: "checkout.session",
        customer: "cus_test_customer123",
        customer_details: {
          email: "test@example.com"
        },
        subscription: "sub_test_subscription123",
        line_items: {
          data: [
            {
              id: "li_test_item123",
              price: {
                id: "price_1SQcISPwKgOrBJUApZmVknSP" // STARTER_MONTHLY from .env
              },
              quantity: 1
            }
          ]
        }
      }
    },
    created: Math.floor(Date.now() / 1000)
  });

  const signature = createStripeSignature(payload, WEBHOOK_SECRET);

  try {
    console.log('🚀 Testing checkout.session.completed webhook...');
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature
      },
      body: payload
    });

    console.log(`📊 Response status: ${response.status}`);
    const result = await response.text();
    console.log(`📝 Response body: ${result}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Test invoice.paid event
async function testInvoicePaid() {
  const payload = JSON.stringify({
    id: "evt_test_invoice_webhook",
    object: "event",
    type: "invoice.paid",
    data: {
      object: {
        id: "in_test_invoice123",
        object: "invoice",
        customer_email: "test@example.com",
        lines: {
          data: [
            {
              id: "il_test_line123",
              price: {
                id: "price_1SQcISPwKgOrBJUApZmVknSP" // STARTER_MONTHLY from .env
              },
              quantity: 1
            }
          ]
        }
      }
    },
    created: Math.floor(Date.now() / 1000)
  });

  const signature = createStripeSignature(payload, WEBHOOK_SECRET);

  try {
    console.log('🚀 Testing invoice.paid webhook...');
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature
      },
      body: payload
    });

    console.log(`📊 Response status: ${response.status}`);
    const result = await response.text();
    console.log(`📝 Response body: ${result}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Starting Stripe webhook simulation tests...\n');
  
  // Wait for the server to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));

  await testCheckoutCompleted();
  console.log('\n' + '='.repeat(50) + '\n');
  await testInvoicePaid();
  
  console.log('\n✅ Webhook tests completed!');
}

runTests().catch(console.error);