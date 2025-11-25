/**
 * Stripe Webhook Handler
 * 
 * Handles all Stripe webhook events for subscription lifecycle:
 * - checkout.session.completed → Create subscription + provision tenant
 * - customer.subscription.updated → Update subscription status
 * - customer.subscription.deleted → Cancel subscription
 * - invoice.paid → Record payment
 * - invoice.payment_failed → Handle failed payment
 */

import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

// Initialize Stripe (will be passed from server/index.js or initialized here)
let _stripe;
function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment");
    }
    _stripe = new Stripe(key, { apiVersion: "2024-11-20.acacia" });
  }
  return _stripe;
}

// Helper to get plan config (simplified version - you can expand this)
function getPlanConfig(planName) {
  // This should match your PLAN_CONFIGS from stripe.config.js
  // For now, return a basic structure
  const configs = {
    'shared-starter': {
      displayName: 'Shared Starter',
      category: 'shared-hosting',
      features: { ssl: true, cpanel: true },
      mpanel: {
        plan_type: 'shared',
        resources: { disk_quota_mb: 10240 },
      },
    },
    // Add more plans as needed
  };
  return configs[planName] || null;
}

// Helper to parse price ID
function parsePriceId(priceId) {
  // Simple parser - you can enhance this
  return {
    planName: 'shared-starter', // Extract from priceId
    interval: 'month',
  };
}

/**
 * Main webhook event handler
 */
export async function handleStripeEvent(event) {
  const stripe = getStripe();
  
  // Check for duplicate events (idempotency)
  const existingEvent = await prisma.webhookEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  
  if (existingEvent?.processed) {
    console.log(`[Webhook] Event ${event.id} already processed, skipping.`);
    return;
  }
  
  // Log the event
  await prisma.webhookEvent.create({
    data: {
      stripeEventId: event.id,
      eventType: event.type,
      payload: JSON.stringify(event),
      processed: false,
    },
  });
  
  try {
    console.log(`\n[Webhook] Processing: ${event.type}`);
    
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, stripe);
        break;
        
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case "invoice.paid":
        await handleInvoicePaid(event.data.object);
        break;
        
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
        
      case "invoice.created":
        await handleInvoiceCreated(event.data.object);
        break;
        
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
    
    // Mark event as processed
    await prisma.webhookEvent.update({
      where: { stripeEventId: event.id },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });
    
    console.log(`[Webhook] ✓ Event ${event.id} processed successfully\n`);
    
  } catch (error) {
    console.error(`[Webhook] ✗ Error processing event ${event.id}:`, error);
    throw error; // Re-throw to return 500 to Stripe
  }
}

/**
 * Handle checkout.session.completed
 * 
 * This fires when customer completes checkout.
 * We create the subscription record and trigger tenant provisioning.
 */
async function handleCheckoutCompleted(session, stripe) {
  console.log(`[Webhook] Checkout completed: ${session.id}`);
  
  const email = session.customer_details?.email || session.customer_email;
  const name = session.customer_details?.name || null;
  
  if (!email) {
    console.warn('[Webhook] No email in checkout session, skipping.');
    return;
  }
  
  // Only handle subscription mode (not one-time payments)
  if (session.mode !== 'subscription') {
    console.log('[Webhook] Not a subscription checkout, skipping.');
    return;
  }
  
  const stripeSubscriptionId = session.subscription;
  const stripeCustomerId = session.customer;
  
  if (!stripeSubscriptionId) {
    console.warn('[Webhook] No subscription ID in session, skipping.');
    return;
  }
  
  // Fetch full subscription details from Stripe
  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId, {
    expand: ['items.data.price.product'],
  });
  
  // Get the first subscription item (assuming single-product subscriptions)
  const subscriptionItem = stripeSubscription.items.data[0];
  const price = subscriptionItem.price;
  const product = price.product;
  
  // Parse plan from price ID
  const planInfo = parsePriceId(price.id) || {
    planName: session.metadata?.plan_name || 'unknown',
    interval: price.recurring?.interval || 'month',
  };
  
  const planConfig = getPlanConfig(planInfo.planName);
  
  if (!planConfig) {
    console.error(`[Webhook] Unknown plan: ${planInfo.planName}`);
    // Still create subscription record for manual handling
  }
  
  // 1. Ensure customer exists
  let customer = await prisma.customer.findUnique({
    where: { stripeId: stripeCustomerId },
  });
  
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        email,
        name,
        stripeId: stripeCustomerId,
      },
    });
  }
  
  // 2. Create subscription record
  const subscription = await prisma.subscription.create({
    data: {
      customerId: customer.id,
      stripeCustomerId,
      stripeSubscriptionId,
      checkoutSessionId: session.id,
      status: stripeSubscription.status,
      planName: planInfo.planName,
      planInterval: planInfo.interval,
      amountTotal: stripeSubscription.items.data.reduce((sum, item) => sum + (item.price.unit_amount || 0), 0),
      currency: price.currency,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
      metadata: JSON.stringify(session.metadata || {}),
    },
  });
  
  // 3. Create subscription items
  for (const item of stripeSubscription.items.data) {
    await prisma.subscriptionItem.create({
      data: {
        subscriptionId: subscription.id,
        stripeSubscriptionItemId: item.id,
        stripePriceId: item.price.id,
        stripeProductId: typeof item.price.product === 'string' ? item.price.product : item.price.product.id,
        productName: typeof item.price.product === 'object' ? item.price.product.name : planConfig?.displayName || 'Hosting Plan',
        quantity: item.quantity,
        unitAmount: item.price.unit_amount || 0,
        currency: item.price.currency,
      },
    });
  }
  
  // 4. Trigger tenant provisioning (async, non-blocking)
  if (planConfig && (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing')) {
    console.log('[Webhook] Triggering tenant provisioning...');
    
    // Use dynamic import for CommonJS module
    import('../services/tenantProvisioningService.js')
      .then(({ provisionTenant }) => {
        return provisionTenant({
          subscriptionId: subscription.id,
          email,
          name,
          planConfig,
          stripeCustomerId,
          metadata: session.metadata || {},
        });
      })
      .catch(err => {
        console.error('[Webhook] Provisioning failed (non-blocking):', err);
      });
  } else {
    console.log('[Webhook] Subscription not active, skipping provisioning.');
  }
  
  console.log(`[Webhook] ✓ Subscription created: ${subscription.id}`);
}

/**
 * Handle customer.subscription.created
 */
async function handleSubscriptionCreated(stripeSubscription) {
  console.log(`[Webhook] Subscription created: ${stripeSubscription.id}`);
  
  // Check if already exists (from checkout.session.completed)
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubscription.id },
  });
  
  if (existing) {
    console.log('[Webhook] Subscription already exists, skipping.');
    return;
  }
  
  // Create if doesn't exist (rare case - usually checkout.session.completed fires first)
  console.log('[Webhook] Creating subscription from subscription.created event...');
  // (Similar logic to handleCheckoutCompleted, but without session context)
}

/**
 * Handle customer.subscription.updated
 */
async function handleSubscriptionUpdated(stripeSubscription) {
  console.log(`[Webhook] Subscription updated: ${stripeSubscription.id}`);
  
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: stripeSubscription.id },
  });
  
  if (!subscription) {
    console.warn('[Webhook] Subscription not found in database, skipping update.');
    return;
  }
  
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: stripeSubscription.status,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
  });
  
  console.log(`[Webhook] ✓ Subscription ${subscription.id} updated to status: ${stripeSubscription.status}`);
}

/**
 * Handle customer.subscription.deleted
 */
async function handleSubscriptionDeleted(stripeSubscription) {
  console.log(`[Webhook] Subscription deleted: ${stripeSubscription.id}`);
  
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: stripeSubscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  });
  
  // TODO: Suspend tenant services in mPanel
  console.log('[Webhook] ✓ Subscription marked as canceled');
}

/**
 * Handle invoice.paid
 */
async function handleInvoicePaid(invoice) {
  console.log(`[Webhook] Invoice paid: ${invoice.id}`);
  
  // Find subscription
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription },
  });
  
  if (!subscription) {
    console.warn('[Webhook] Subscription not found for invoice, skipping.');
    return;
  }
  
  // Create or update invoice record
  await prisma.invoice.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      stripeCustomerId: invoice.customer,
      status: invoice.status,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      subtotal: invoice.subtotal,
      total: invoice.total,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000),
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
      periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
      paid: invoice.paid,
      attempted: invoice.attempted,
      invoicePdf: invoice.invoice_pdf,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
    },
    update: {
      status: invoice.status,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      paid: invoice.paid,
    },
  });
  
  console.log('[Webhook] ✓ Invoice recorded as paid');
}

/**
 * Handle invoice.payment_failed
 */
async function handleInvoicePaymentFailed(invoice) {
  console.log(`[Webhook] Invoice payment failed: ${invoice.id}`);
  
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription },
  });
  
  if (!subscription) return;
  
  await prisma.invoice.upsert({
    where: { stripeInvoiceId: invoice.id },
    create: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      stripeCustomerId: invoice.customer,
      status: 'open',
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      subtotal: invoice.subtotal,
      total: invoice.total,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000),
      paid: false,
      attempted: true,
      nextPaymentAttempt: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null,
    },
    update: {
      attempted: true,
      nextPaymentAttempt: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null,
    },
  });
  
  // TODO: Send payment failure email
  console.log('[Webhook] ✗ Payment failed recorded');
}

/**
 * Handle invoice.created
 */
async function handleInvoiceCreated(invoice) {
  console.log(`[Webhook] Invoice created: ${invoice.id}`);
  
  if (!invoice.subscription) return;
  
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: invoice.subscription },
  });
  
  if (!subscription) return;
  
  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      stripeCustomerId: invoice.customer,
      status: invoice.status,
      amountDue: invoice.amount_due,
      amountPaid: invoice.amount_paid,
      amountRemaining: invoice.amount_remaining,
      subtotal: invoice.subtotal,
      total: invoice.total,
      currency: invoice.currency,
      created: new Date(invoice.created * 1000),
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
      periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
      periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
      paid: invoice.paid,
      attempted: invoice.attempted,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
    },
  });
  
  console.log('[Webhook] ✓ Invoice created');
}
