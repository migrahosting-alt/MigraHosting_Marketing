/**
 * Stripe Configuration
 * 
 * Centralized Stripe setup with:
 * - Stripe client initialization
 * - Webhook secret
 * - Checkout URLs
 * - Price ID mappings
 * - Plan features
 * - Utility functions
 */

require('dotenv').config();
const Stripe = require('stripe');

// ========== STRIPE CLIENT ==========
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[Stripe] STRIPE_SECRET_KEY is not set. Stripe will not be fully functional.');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

// ========== WEBHOOK CONFIG ==========
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// ========== CHECKOUT CONFIG ==========
const STRIPE_CHECKOUT_CONFIG = {
  successUrl:
    process.env.STRIPE_SUCCESS_URL ||
    `${process.env.APP_URL || 'https://migrahosting.com'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl:
    process.env.STRIPE_CANCEL_URL ||
    `${process.env.APP_URL || 'https://migrahosting.com'}/checkout?canceled=true`,
};

// ========== PRICE IDs (TEST MODE) ==========
// Replace with your actual Stripe Price IDs from the dashboard
const STRIPE_PRICES = {
  // Shared Hosting
  SHARED_STARTER_MONTHLY: 'price_starter_monthly',
  SHARED_STARTER_YEARLY: 'price_starter_yearly',
  
  SHARED_PRO_MONTHLY: 'price_pro_monthly',
  SHARED_PRO_YEARLY: 'price_pro_yearly',
  
  SHARED_BUSINESS_MONTHLY: 'price_business_monthly',
  SHARED_BUSINESS_YEARLY: 'price_business_yearly',
  
  // WordPress Hosting
  WP_STARTER_MONTHLY: 'price_wp_starter_monthly',
  WP_STARTER_YEARLY: 'price_wp_starter_yearly',
  
  WP_PRO_MONTHLY: 'price_wp_pro_monthly',
  WP_PRO_YEARLY: 'price_wp_pro_yearly',
  
  // VPS Hosting
  VPS_BASIC_MONTHLY: 'price_vps_basic_monthly',
  VPS_BASIC_YEARLY: 'price_vps_basic_yearly',
  
  VPS_STANDARD_MONTHLY: 'price_vps_standard_monthly',
  VPS_STANDARD_YEARLY: 'price_vps_standard_yearly',
  
  VPS_ADVANCED_MONTHLY: 'price_vps_advanced_monthly',
  VPS_ADVANCED_YEARLY: 'price_vps_advanced_yearly',
  
  // Dedicated Servers
  DEDICATED_ENTRY_MONTHLY: 'price_dedicated_entry_monthly',
  DEDICATED_ENTRY_YEARLY: 'price_dedicated_entry_yearly',
  
  DEDICATED_PRO_MONTHLY: 'price_dedicated_pro_monthly',
  DEDICATED_PRO_YEARLY: 'price_dedicated_pro_yearly',
  
  // Domain Services
  DOMAIN_REGISTRATION: 'price_domain_registration',
  DOMAIN_TRANSFER: 'price_domain_transfer',
  DOMAIN_PRIVACY: 'price_domain_privacy',
  
  // Email Hosting
  EMAIL_BASIC_MONTHLY: 'price_email_basic_monthly',
  EMAIL_BASIC_YEARLY: 'price_email_basic_yearly',
  
  EMAIL_PROFESSIONAL_MONTHLY: 'price_email_pro_monthly',
  EMAIL_PROFESSIONAL_YEARLY: 'price_email_pro_yearly',
};

// ========== PLAN METADATA ==========
// Maps plan names to features & mPanel configuration
const PLAN_CONFIGS = {
  // ===== SHARED HOSTING =====
  'shared-starter': {
    displayName: 'Shared Starter',
    category: 'shared-hosting',
    features: {
      websites: 1,
      storage: '10 GB SSD',
      bandwidth: 'Unmetered',
      databases: 1,
      email_accounts: 5,
      ssl: true,
      cpanel: true,
      daily_backups: false,
      priority_support: false,
    },
    mpanel: {
      plan_type: 'shared',
      resources: {
        disk_quota_mb: 10240,
        bandwidth_quota_mb: -1, // unlimited
        max_databases: 1,
        max_email_accounts: 5,
      },
    },
  },
  
  'shared-pro': {
    displayName: 'Shared Pro',
    category: 'shared-hosting',
    features: {
      websites: 5,
      storage: '50 GB SSD',
      bandwidth: 'Unmetered',
      databases: 10,
      email_accounts: 25,
      ssl: true,
      cpanel: true,
      daily_backups: true,
      priority_support: false,
    },
    mpanel: {
      plan_type: 'shared',
      resources: {
        disk_quota_mb: 51200,
        bandwidth_quota_mb: -1,
        max_databases: 10,
        max_email_accounts: 25,
      },
    },
  },
  
  'shared-business': {
    displayName: 'Shared Business',
    category: 'shared-hosting',
    features: {
      websites: 'Unlimited',
      storage: '100 GB SSD',
      bandwidth: 'Unmetered',
      databases: 'Unlimited',
      email_accounts: 'Unlimited',
      ssl: true,
      cpanel: true,
      daily_backups: true,
      priority_support: true,
    },
    mpanel: {
      plan_type: 'shared',
      resources: {
        disk_quota_mb: 102400,
        bandwidth_quota_mb: -1,
        max_databases: -1, // unlimited
        max_email_accounts: -1,
      },
    },
  },
  
  // ===== WORDPRESS HOSTING =====
  'wordpress-starter': {
    displayName: 'WordPress Starter',
    category: 'wordpress-hosting',
    features: {
      sites: 1,
      storage: '20 GB SSD',
      bandwidth: 'Unmetered',
      ssl: true,
      wordpress_optimized: true,
      auto_updates: true,
      staging: false,
      daily_backups: true,
    },
    mpanel: {
      plan_type: 'wordpress',
      resources: {
        disk_quota_mb: 20480,
        bandwidth_quota_mb: -1,
        max_wordpress_sites: 1,
      },
    },
  },
  
  'wordpress-pro': {
    displayName: 'WordPress Pro',
    category: 'wordpress-hosting',
    features: {
      sites: 5,
      storage: '100 GB SSD',
      bandwidth: 'Unmetered',
      ssl: true,
      wordpress_optimized: true,
      auto_updates: true,
      staging: true,
      daily_backups: true,
      cdn: true,
    },
    mpanel: {
      plan_type: 'wordpress',
      resources: {
        disk_quota_mb: 102400,
        bandwidth_quota_mb: -1,
        max_wordpress_sites: 5,
      },
    },
  },
  
  // ===== VPS HOSTING =====
  'vps-basic': {
    displayName: 'VPS Basic',
    category: 'vps-hosting',
    features: {
      cpu_cores: 2,
      ram: '4 GB',
      storage: '80 GB SSD',
      bandwidth: '3 TB',
      ipv4_addresses: 1,
      root_access: true,
      os_choice: true,
      managed: false,
    },
    mpanel: {
      plan_type: 'vps',
      resources: {
        cpu_cores: 2,
        ram_mb: 4096,
        disk_quota_mb: 81920,
        bandwidth_quota_mb: 3145728,
      },
    },
  },
  
  'vps-standard': {
    displayName: 'VPS Standard',
    category: 'vps-hosting',
    features: {
      cpu_cores: 4,
      ram: '8 GB',
      storage: '160 GB SSD',
      bandwidth: '5 TB',
      ipv4_addresses: 1,
      root_access: true,
      os_choice: true,
      managed: true,
    },
    mpanel: {
      plan_type: 'vps',
      resources: {
        cpu_cores: 4,
        ram_mb: 8192,
        disk_quota_mb: 163840,
        bandwidth_quota_mb: 5242880,
      },
    },
  },
  
  'vps-advanced': {
    displayName: 'VPS Advanced',
    category: 'vps-hosting',
    features: {
      cpu_cores: 8,
      ram: '16 GB',
      storage: '320 GB SSD',
      bandwidth: '8 TB',
      ipv4_addresses: 2,
      root_access: true,
      os_choice: true,
      managed: true,
    },
    mpanel: {
      plan_type: 'vps',
      resources: {
        cpu_cores: 8,
        ram_mb: 16384,
        disk_quota_mb: 327680,
        bandwidth_quota_mb: 8388608,
      },
    },
  },
  
  // ===== DEDICATED SERVERS =====
  'dedicated-entry': {
    displayName: 'Dedicated Entry',
    category: 'dedicated-hosting',
    features: {
      cpu: 'Intel Xeon E-2236 (6 cores)',
      ram: '32 GB DDR4',
      storage: '2x 1TB SSD',
      bandwidth: '10 TB',
      ipv4_addresses: 5,
      root_access: true,
      managed: true,
    },
    mpanel: {
      plan_type: 'dedicated',
      resources: {
        cpu_info: 'Intel Xeon E-2236',
        cpu_cores: 6,
        ram_mb: 32768,
        disk_quota_mb: 2097152,
        bandwidth_quota_mb: 10485760,
      },
    },
  },
  
  'dedicated-pro': {
    displayName: 'Dedicated Pro',
    category: 'dedicated-hosting',
    features: {
      cpu: 'AMD EPYC 7302P (16 cores)',
      ram: '128 GB DDR4',
      storage: '4x 2TB NVMe',
      bandwidth: '20 TB',
      ipv4_addresses: 10,
      root_access: true,
      managed: true,
    },
    mpanel: {
      plan_type: 'dedicated',
      resources: {
        cpu_info: 'AMD EPYC 7302P',
        cpu_cores: 16,
        ram_mb: 131072,
        disk_quota_mb: 8388608,
        bandwidth_quota_mb: 20971520,
      },
    },
  },
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Get plan config by name
 */
function getPlanConfig(planName) {
  return PLAN_CONFIGS[planName] || null;
}

/**
 * Get price ID by plan and interval
 */
function getPriceId(planName, interval = 'month') {
  const key = `${planName.toUpperCase().replace(/-/g, '_')}_${interval.toUpperCase()}LY`;
  return STRIPE_PRICES[key] || null;
}

/**
 * Parse price ID to get plan details
 */
function parsePriceId(priceId) {
  // Reverse lookup
  const entry = Object.entries(STRIPE_PRICES).find(([_, id]) => id === priceId);
  if (!entry) return null;
  
  const [key] = entry;
  const parts = key.toLowerCase().split('_');
  const interval = parts.pop().replace('ly', ''); // 'monthly' -> 'month'
  const planName = parts.join('-');
  
  return { planName, interval };
}

/**
 * Format amount for display
 */
function formatAmount(amountInCents, currency = 'usd') {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

/**
 * Calculate yearly savings
 */
function getYearlySavings(monthlyPrice, yearlyPrice) {
  const monthlyCost = monthlyPrice * 12;
  const savings = monthlyCost - yearlyPrice;
  const percentSaved = Math.round((savings / monthlyCost) * 100);
  
  return {
    savingsAmount: savings,
    savingsPercent: percentSaved,
    monthlyCost,
    yearlyCost: yearlyPrice,
  };
}

/**
 * Create Stripe customer
 */
async function createCustomer(email, name, metadata = {}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'marketing_website',
        ...metadata,
      },
    });
    
    return { success: true, customer };
  } catch (error) {
    console.error('Failed to create Stripe customer:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create checkout session
 */
async function createCheckoutSession({
  priceId,
  customerEmail,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {},
  trialDays = 0,
}) {
  try {
    const sessionParams = {
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    };
    
    // Add customer
    if (customerId) {
      sessionParams.customer = customerId;
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }
    
    // Add trial
    if (trialDays > 0) {
      sessionParams.subscription_data = {
        trial_period_days: trialDays,
        metadata,
      };
    }
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    
    return { success: true, session };
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Retrieve subscription
 */
async function getSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer', 'default_payment_method', 'latest_invoice'],
    });
    
    return { success: true, subscription };
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Cancel subscription
 */
async function cancelSubscription(subscriptionId, immediately = false) {
  try {
    const subscription = immediately
      ? await stripe.subscriptions.cancel(subscriptionId)
      : await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
    
    return { success: true, subscription };
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    return { success: false, error: error.message };
  }
}

// ========== EXPORTS ==========
module.exports = {
  stripe,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_CHECKOUT_CONFIG,
  STRIPE_PRICES,
  PLAN_CONFIGS,
  
  // Utilities
  getPlanConfig,
  getPriceId,
  parsePriceId,
  formatAmount,
  getYearlySavings,
  
  // Stripe helpers
  createCustomer,
  createCheckoutSession,
  getSubscription,
  cancelSubscription,
};
