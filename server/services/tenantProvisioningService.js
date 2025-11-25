/**
 * Tenant Provisioning Service
 * 
 * Handles creation of mPanel tenant accounts after successful Stripe checkout.
 * This service is called by the webhook handler when a subscription is activated.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// mPanel API configuration
const MPANEL_API_URL = process.env.MPANEL_API_URL || 'https://migrapanel.com/api';
const MPANEL_API_KEY = process.env.MPANEL_API_KEY;

/**
 * Create mPanel tenant account
 */
async function createTenantAccount({
  email,
  name,
  planConfig,
  subscriptionId,
  stripeCustomerId,
  metadata = {},
}) {
  try {
    console.log(`[Provisioning] Creating tenant for ${email}...`);
    
    // 1. Log provisioning attempt
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'create_tenant',
        status: 'pending',
        requestPayload: JSON.stringify({
          email,
          name,
          planConfig,
          metadata,
        }),
      },
    });
    
    // 2. Call mPanel API to create tenant
    const response = await fetch(`${MPANEL_API_URL}/marketing-api/accounts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MPANEL_API_KEY,
      },
      body: JSON.stringify({
        email,
        name: name || email.split('@')[0],
        plan_type: planConfig.mpanel.plan_type,
        resources: planConfig.mpanel.resources,
        source: 'marketing_website',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscriptionId,
        metadata: {
          ...metadata,
          created_via: 'stripe_checkout',
        },
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'mPanel API error');
    }
    
    // 3. Log success
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'create_tenant',
        status: 'success',
        responsePayload: JSON.stringify(result),
      },
    });
    
    console.log(`[Provisioning] ✓ Tenant created: ${result.data?.tenant_id}`);
    
    return {
      success: true,
      tenantId: result.data?.tenant_id,
      userId: result.data?.user_id,
      resetToken: result.data?.reset_token,
    };
    
  } catch (error) {
    console.error('[Provisioning] ✗ Failed to create tenant:', error);
    
    // Log failure
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'create_tenant',
        status: 'failed',
        errorMessage: error.message,
      },
    });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Provision hosting services
 */
async function provisionServices({
  tenantId,
  planConfig,
  subscriptionId,
}) {
  try {
    console.log(`[Provisioning] Provisioning services for tenant ${tenantId}...`);
    
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'provision_services',
        status: 'pending',
        requestPayload: JSON.stringify({ tenantId, planConfig }),
      },
    });
    
    // Call mPanel API to provision services (cPanel account, databases, email, etc.)
    const response = await fetch(`${MPANEL_API_URL}/marketing-api/tenants/${tenantId}/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MPANEL_API_KEY,
      },
      body: JSON.stringify({
        services: {
          hosting: true,
          email: planConfig.features.email_accounts > 0,
          databases: planConfig.features.databases > 0,
          ssl: planConfig.features.ssl,
        },
        resources: planConfig.mpanel.resources,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Service provisioning failed');
    }
    
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'provision_services',
        status: 'success',
        responsePayload: JSON.stringify(result),
      },
    });
    
    console.log(`[Provisioning] ✓ Services provisioned for tenant ${tenantId}`);
    
    return { success: true };
    
  } catch (error) {
    console.error('[Provisioning] ✗ Service provisioning failed:', error);
    
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'provision_services',
        status: 'failed',
        errorMessage: error.message,
      },
    });
    
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email with login credentials
 */
async function sendWelcomeEmail({
  email,
  resetToken,
  planName,
  subscriptionId,
}) {
  try {
    console.log(`[Provisioning] Sending welcome email to ${email}...`);
    
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'send_welcome',
        status: 'pending',
      },
    });
    
    // Call mPanel API to send welcome email
    const response = await fetch(`${MPANEL_API_URL}/marketing-api/emails/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': MPANEL_API_KEY,
      },
      body: JSON.stringify({
        email,
        reset_token: resetToken,
        plan_name: planName,
        control_panel_url: process.env.VITE_MPANEL_CONTROL_PANEL_URL || 'https://migrapanel.com',
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Email sending failed');
    }
    
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'send_welcome',
        status: 'success',
      },
    });
    
    console.log(`[Provisioning] ✓ Welcome email sent to ${email}`);
    
    return { success: true };
    
  } catch (error) {
    console.error('[Provisioning] ✗ Welcome email failed:', error);
    
    await prisma.provisioningLog.create({
      data: {
        subscriptionId,
        action: 'send_welcome',
        status: 'failed',
        errorMessage: error.message,
      },
    });
    
    // Don't fail the whole provisioning if email fails
    return { success: false, error: error.message };
  }
}

/**
 * Complete provisioning flow
 * 
 * This is the main function called by the webhook handler.
 */
async function provisionTenant({
  subscriptionId,
  email,
  name,
  planConfig,
  stripeCustomerId,
  metadata = {},
}) {
  try {
    console.log(`\n========== PROVISIONING TENANT ==========`);
    console.log(`Subscription: ${subscriptionId}`);
    console.log(`Email: ${email}`);
    console.log(`Plan: ${planConfig.displayName}`);
    console.log(`=========================================\n`);
    
    // Update subscription status
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { provisioningStatus: 'in_progress' },
    });
    
    // 1. Create tenant account
    const tenantResult = await createTenantAccount({
      email,
      name,
      planConfig,
      subscriptionId,
      stripeCustomerId,
      metadata,
    });
    
    if (!tenantResult.success) {
      throw new Error(`Tenant creation failed: ${tenantResult.error}`);
    }
    
    const { tenantId, resetToken } = tenantResult;
    
    // 2. Update subscription with tenant ID
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { tenantId },
    });
    
    // Also update customer
    await prisma.customer.updateMany({
      where: { stripeId: stripeCustomerId },
      data: { tenantId },
    });
    
    // 3. Provision services
    const servicesResult = await provisionServices({
      tenantId,
      planConfig,
      subscriptionId,
    });
    
    if (!servicesResult.success) {
      console.warn('[Provisioning] Service provisioning failed, but continuing...');
    }
    
    // 4. Send welcome email (non-blocking)
    await sendWelcomeEmail({
      email,
      resetToken,
      planName: planConfig.displayName,
      subscriptionId,
    });
    
    // 5. Mark provisioning complete
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        provisioningStatus: 'completed',
        provisionedAt: new Date(),
      },
    });
    
    console.log(`\n[Provisioning] ✓✓✓ PROVISIONING COMPLETE ✓✓✓\n`);
    
    return {
      success: true,
      tenantId,
      resetToken,
    };
    
  } catch (error) {
    console.error('[Provisioning] ✗✗✗ PROVISIONING FAILED ✗✗✗');
    console.error(error);
    
    // Mark provisioning as failed
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        provisioningStatus: 'failed',
        provisioningError: error.message,
      },
    });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Retry failed provisioning
 */
async function retryProvisioning(subscriptionId) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { customer: true },
    });
    
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    
    if (subscription.provisioningStatus === 'completed') {
      return { success: true, message: 'Already provisioned' };
    }
    
    // Get plan config (you'll need to store this or derive from planName)
    const { getPlanConfig } = require('../config/stripe.config');
    const planConfig = getPlanConfig(subscription.planName);
    
    if (!planConfig) {
      throw new Error(`Unknown plan: ${subscription.planName}`);
    }
    
    return await provisionTenant({
      subscriptionId: subscription.id,
      email: subscription.customer?.email || 'unknown@example.com',
      name: subscription.customer?.name,
      planConfig,
      stripeCustomerId: subscription.stripeCustomerId,
      metadata: JSON.parse(subscription.metadata || '{}'),
    });
    
  } catch (error) {
    console.error('[Provisioning] Retry failed:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  provisionTenant,
  retryProvisioning,
  createTenantAccount,
  provisionServices,
  sendWelcomeEmail,
};
