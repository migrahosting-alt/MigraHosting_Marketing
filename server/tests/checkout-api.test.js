/**
 * Test Marketing Checkout API
 * 
 * Usage: node server/tests/checkout-api.test.js
 * 
 * Tests:
 * - POST /api/checkout (create checkout session)
 * - GET /api/marketing/checkout-session/:sessionId (poll session status)
 */

const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:4242';

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      const payload = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            body: parsed,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data,
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Marketing Checkout API\n');
  console.log(`📍 API URL: ${API_URL}\n`);
  
  // Test 1: Create checkout session
  console.log('Test 1: POST /api/checkout - Create Checkout Session');
  try {
    const response = await makeRequest('POST', '/api/checkout', {
      priceId: 'price_test_123',
      mode: 'subscription',
      success_url: 'http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/pricing',
      trial_period_days: 14,
      allow_promotion_codes: true,
      locale: 'en',
    });
    
    console.log(`  Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log(`  ✓ Checkout URL: ${response.body.url || 'N/A'}`);
      console.log(`  ✓ Session ID: ${response.body.id || 'N/A'}\n`);
      
      // Test 2: Poll checkout session (using a mock session ID)
      if (response.body.id) {
        console.log('Test 2: GET /api/marketing/checkout-session/:sessionId - Poll Session Status');
        const sessionResponse = await makeRequest('GET', `/api/marketing/checkout-session/${response.body.id}`);
        
        console.log(`  Status: ${sessionResponse.statusCode}`);
        console.log(`  Response:`, JSON.stringify(sessionResponse.body, null, 2), '\n');
      }
    } else {
      console.log(`  ✗ Error: ${JSON.stringify(response.body)}\n`);
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
  }
  
  // Test 3: Create checkout session with multiple line items
  console.log('Test 3: POST /api/checkout - Multiple Line Items');
  try {
    const response = await makeRequest('POST', '/api/checkout', {
      line_items: [
        { price: 'price_test_starter', quantity: 1 },
        { price: 'price_test_backup_addon', quantity: 1 },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/pricing',
      locale: 'es', // Test Spanish locale
    });
    
    console.log(`  Status: ${response.statusCode}`);
    
    if (response.statusCode === 200) {
      console.log(`  ✓ Checkout URL: ${response.body.url || 'N/A'}`);
      console.log(`  ✓ Session ID: ${response.body.id || 'N/A'}\n`);
    } else {
      console.log(`  ✗ Error: ${JSON.stringify(response.body)}\n`);
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
  }
  
  // Test 4: Missing required fields
  console.log('Test 4: POST /api/checkout - Missing Required Fields (Should Fail)');
  try {
    const response = await makeRequest('POST', '/api/checkout', {
      mode: 'subscription',
      // Missing priceId and line_items
    });
    
    console.log(`  Status: ${response.statusCode}`);
    
    if (response.statusCode === 400) {
      console.log(`  ✓ Correctly rejected: ${JSON.stringify(response.body)}\n`);
    } else {
      console.log(`  ✗ Unexpected response: ${JSON.stringify(response.body)}\n`);
    }
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}\n`);
  }
  
  console.log('✅ All tests completed!\n');
}

// Run tests
runTests().catch(console.error);
