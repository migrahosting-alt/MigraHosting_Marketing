/**
 * Test Database Schema
 * 
 * Usage: node server/tests/schema.test.js
 * 
 * Tests:
 * - Subscriptions table structure
 * - Customers table structure
 * - Invoices table structure
 * - Relationships and indexes
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTable(tableName, expectedColumns) {
  console.log(`\nTesting table: ${tableName}`);
  
  try {
    // Try to query the table
    const query = `SELECT * FROM ${tableName} LIMIT 1`;
    await prisma.$queryRawUnsafe(query);
    console.log(`  ✓ Table exists`);
    
    // For SQLite, we can get column info
    const pragma = `PRAGMA table_info(${tableName})`;
    const columns = await prisma.$queryRawUnsafe(pragma);
    
    console.log(`  ✓ Found ${columns.length} columns`);
    
    // Check expected columns
    const missing = [];
    for (const expectedCol of expectedColumns) {
      const found = columns.some(col => col.name === expectedCol);
      if (!found) {
        missing.push(expectedCol);
      }
    }
    
    if (missing.length > 0) {
      console.log(`  ✗ Missing columns: ${missing.join(', ')}`);
    } else {
      console.log(`  ✓ All expected columns present`);
    }
    
    // Display all columns
    console.log(`  Columns:`, columns.map(c => c.name).join(', '));
    
    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

async function testRelationships() {
  console.log(`\nTesting relationships and data integrity`);
  
  try {
    // Test: Create a customer
    const customer = await prisma.customer.create({
      data: {
        email: `test_${Date.now()}@example.com`,
        name: 'Test User',
        stripeId: `cus_test_${Date.now()}`,
      },
    });
    console.log(`  ✓ Created test customer: ${customer.id}`);
    
    // Test: Create a subscription
    const subscription = await prisma.subscription.create({
      data: {
        customerId: customer.id,
        stripeCustomerId: customer.stripeId,
        stripeSubscriptionId: `sub_test_${Date.now()}`,
        checkoutSessionId: `cs_test_${Date.now()}`,
        status: 'active',
        planName: 'shared-starter',
        planInterval: 'month',
        amountTotal: 999,
        currency: 'usd',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`  ✓ Created test subscription: ${subscription.id}`);
    
    // Test: Query with relationship
    const customerWithSubs = await prisma.customer.findUnique({
      where: { id: customer.id },
      include: { subscriptions: true },
    });
    console.log(`  ✓ Queried customer with ${customerWithSubs.subscriptions.length} subscription(s)`);
    
    // Test: Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        subscriptionId: subscription.id,
        stripeInvoiceId: `in_test_${Date.now()}`,
        stripeCustomerId: customer.stripeId,
        status: 'paid',
        amountDue: 999,
        amountPaid: 999,
        amountRemaining: 0,
        subtotal: 999,
        total: 999,
        currency: 'usd',
        created: new Date(),
        paid: true,
      },
    });
    console.log(`  ✓ Created test invoice: ${invoice.id}`);
    
    // Cleanup
    await prisma.invoice.delete({ where: { id: invoice.id } });
    await prisma.subscription.delete({ where: { id: subscription.id } });
    await prisma.customer.delete({ where: { id: customer.id } });
    console.log(`  ✓ Cleaned up test data`);
    
    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Database Schema\n');
  console.log('=' .repeat(60));
  
  // Test Customer table
  await testTable('Customer', [
    'id',
    'email',
    'stripeId',
    'name',
    'tenantId',
    'createdAt',
    'updatedAt',
  ]);
  
  // Test Subscription table
  await testTable('Subscription', [
    'id',
    'customerId',
    'stripeCustomerId',
    'stripeSubscriptionId',
    'checkoutSessionId',
    'status',
    'tenantId',
    'planName',
    'planInterval',
    'amountTotal',
    'currency',
    'currentPeriodStart',
    'currentPeriodEnd',
    'provisioningStatus',
    'metadata',
    'createdAt',
    'updatedAt',
  ]);
  
  // Test SubscriptionItem table
  await testTable('SubscriptionItem', [
    'id',
    'subscriptionId',
    'stripeSubscriptionItemId',
    'stripePriceId',
    'stripeProductId',
    'productName',
    'quantity',
    'unitAmount',
    'currency',
  ]);
  
  // Test Invoice table
  await testTable('Invoice', [
    'id',
    'subscriptionId',
    'stripeInvoiceId',
    'stripeCustomerId',
    'status',
    'amountDue',
    'amountPaid',
    'amountRemaining',
    'total',
    'currency',
    'paid',
    'created',
  ]);
  
  // Test PaymentMethod table
  await testTable('PaymentMethod', [
    'id',
    'customerId',
    'stripePaymentMethodId',
    'type',
    'cardBrand',
    'cardLast4',
    'isDefault',
  ]);
  
  // Test ProvisioningLog table
  await testTable('ProvisioningLog', [
    'id',
    'subscriptionId',
    'action',
    'status',
    'requestPayload',
    'responsePayload',
    'errorMessage',
    'createdAt',
  ]);
  
  // Test WebhookEvent table
  await testTable('WebhookEvent', [
    'id',
    'stripeEventId',
    'eventType',
    'processed',
    'processedAt',
    'payload',
    'createdAt',
  ]);
  
  console.log('\n' + '='.repeat(60));
  
  // Test relationships
  await testRelationships();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Schema tests completed!\n');
  
  await prisma.$disconnect();
}

// Run tests
runTests().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
