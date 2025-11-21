/**
 * mPanel Product Plan Mapping
 * Maps marketing site product IDs to mPanel plan IDs for automated provisioning
 * 
 * IMPORTANT: Prices are sourced from catalog.ts to maintain single source of truth
 * Update catalog.ts to change pricing across all systems
 */

import { 
  DISPLAY_PER_MONTH, 
  EMAIL_PRICES, 
  VPS_PRICES, 
  CLOUD_PRICES, 
  WORDPRESS_PRICES 
} from './catalog';

export interface ProductPlan {
  marketingId: string;      // ID used in marketing site
  mPanelId: string;          // ID in mPanel database
  productType: 'hosting' | 'vps' | 'cloud' | 'wordpress' | 'email' | 'storage';
  name: string;
  monthlyPrice: number;
  annualPrice?: number;
  biennialPrice?: number;
  triennialPrice?: number;
  features?: string[];
}

/**
 * SHARED HOSTING PLANS
 * Prices synced from catalog.ts DISPLAY_PER_MONTH
 */
export const HOSTING_PLANS: Record<string, ProductPlan> = {
  'starter': {
    marketingId: 'starter',
    mPanelId: 'plan_starter_hosting',
    productType: 'hosting',
    name: 'Starter',
    monthlyPrice: parseFloat(DISPLAY_PER_MONTH.starter.monthly),
    annualPrice: parseFloat(DISPLAY_PER_MONTH.starter.annually) * 12,
    biennialPrice: parseFloat(DISPLAY_PER_MONTH.starter.biennially) * 24,
    triennialPrice: parseFloat(DISPLAY_PER_MONTH.starter.triennially) * 36,
  },
  'premium': {
    marketingId: 'premium',
    mPanelId: 'plan_premium_hosting',
    productType: 'hosting',
    name: 'Premium',
    monthlyPrice: parseFloat(DISPLAY_PER_MONTH.premium.monthly),
    annualPrice: parseFloat(DISPLAY_PER_MONTH.premium.annually) * 12,
    biennialPrice: parseFloat(DISPLAY_PER_MONTH.premium.biennially) * 24,
    triennialPrice: parseFloat(DISPLAY_PER_MONTH.premium.triennially) * 36,
  },
  'business': {
    marketingId: 'business',
    mPanelId: 'plan_business_hosting',
    productType: 'hosting',
    name: 'Business',
    monthlyPrice: parseFloat(DISPLAY_PER_MONTH.business.monthly),
    annualPrice: parseFloat(DISPLAY_PER_MONTH.business.annually) * 12,
    biennialPrice: parseFloat(DISPLAY_PER_MONTH.business.biennially) * 24,
    triennialPrice: parseFloat(DISPLAY_PER_MONTH.business.triennially) * 36,
  },
  'student': {
    marketingId: 'student',
    mPanelId: 'plan_student_hosting',
    productType: 'hosting',
    name: 'Student',
    monthlyPrice: parseFloat(DISPLAY_PER_MONTH.student.monthly),
    annualPrice: parseFloat(DISPLAY_PER_MONTH.student.annually) * 12,
    biennialPrice: parseFloat(DISPLAY_PER_MONTH.student.biennially) * 24,
    triennialPrice: parseFloat(DISPLAY_PER_MONTH.student.triennially) * 36,
  }
};

/**
 * VPS PLANS
 * Prices synced from catalog.ts VPS_PRICES
 */
export const VPS_PLANS: Record<string, ProductPlan> = {
  'vps-starter': {
    marketingId: 'vps-starter',
    mPanelId: 'plan_vps_starter',
    productType: 'vps',
    name: 'VPS Starter',
    monthlyPrice: VPS_PRICES.starter,
    annualPrice: VPS_PRICES.starter * 12,
  },
  'vps-standard': {
    marketingId: 'vps-standard',
    mPanelId: 'plan_vps_standard',
    productType: 'vps',
    name: 'VPS Standard',
    monthlyPrice: VPS_PRICES.standard,
    annualPrice: VPS_PRICES.standard * 12,
  },
  'vps-advanced': {
    marketingId: 'vps-advanced',
    mPanelId: 'plan_vps_advanced',
    productType: 'vps',
    name: 'VPS Advanced',
    monthlyPrice: VPS_PRICES.advanced,
    annualPrice: VPS_PRICES.advanced * 12,
  },
};

/**
 * CLOUD PLANS
 * Prices synced from catalog.ts CLOUD_PRICES
 */
export const CLOUD_PLANS: Record<string, ProductPlan> = {
  'cloud-small': {
    marketingId: 'cloud-small',
    mPanelId: 'plan_cloud_small',
    productType: 'cloud',
    name: 'Cloud Small',
    monthlyPrice: CLOUD_PRICES.small,
    annualPrice: CLOUD_PRICES.small * 12,
  },
  'cloud-large': {
    marketingId: 'cloud-large',
    mPanelId: 'plan_cloud_large',
    productType: 'cloud',
    name: 'Cloud Large',
    monthlyPrice: CLOUD_PRICES.large,
    annualPrice: CLOUD_PRICES.large * 12,
  },
};

/**
 * MANAGED WORDPRESS PLANS
 * Prices synced from catalog.ts WORDPRESS_PRICES
 */
export const WORDPRESS_PLANS: Record<string, ProductPlan> = {
  'student': {
    marketingId: 'student',
    mPanelId: 'plan_wp_student',
    productType: 'wordpress',
    name: 'Student',
    monthlyPrice: WORDPRESS_PRICES.student,
    annualPrice: WORDPRESS_PRICES.student * 12,
  },
  'starter': {
    marketingId: 'starter',
    mPanelId: 'plan_wp_starter',
    productType: 'wordpress',
    name: 'Starter',
    monthlyPrice: WORDPRESS_PRICES.starter,
    annualPrice: WORDPRESS_PRICES.starter * 12,
  },
  'pro': {
    marketingId: 'pro',
    mPanelId: 'plan_wp_pro',
    productType: 'wordpress',
    name: 'Pro',
    monthlyPrice: WORDPRESS_PRICES.pro,
    annualPrice: WORDPRESS_PRICES.pro * 12,
  },
  'business': {
    marketingId: 'business',
    mPanelId: 'plan_wp_business',
    productType: 'wordpress',
    name: 'Business',
    monthlyPrice: WORDPRESS_PRICES.business,
    annualPrice: WORDPRESS_PRICES.business * 12,
  },
};

/**
 * EMAIL PLANS
 * Prices synced from catalog.ts EMAIL_PRICES
 */
export const EMAIL_PLANS: Record<string, ProductPlan> = {
  'basic': {
    marketingId: 'basic',
    mPanelId: 'plan_email_basic',
    productType: 'email',
    name: 'Basic',
    monthlyPrice: EMAIL_PRICES.basic,
    annualPrice: EMAIL_PRICES.basic * 12,
  },
  'pro': {
    marketingId: 'pro',
    mPanelId: 'plan_email_pro',
    productType: 'email',
    name: 'Pro',
    monthlyPrice: EMAIL_PRICES.pro,
    annualPrice: EMAIL_PRICES.pro * 12,
  },
  'enterprise': {
    marketingId: 'enterprise',
    mPanelId: 'plan_email_enterprise',
    productType: 'email',
    name: 'Enterprise',
    monthlyPrice: EMAIL_PRICES.enterprise,
    annualPrice: EMAIL_PRICES.enterprise * 12,
  },
};

/**
 * ALL PLANS COMBINED
 */
export const ALL_PLANS = {
  hosting: HOSTING_PLANS,
  vps: VPS_PLANS,
  cloud: CLOUD_PLANS,
  wordpress: WORDPRESS_PLANS,
  email: EMAIL_PLANS
};

/**
 * Helper function to get mPanel plan ID from marketing ID
 */
export function getMPanelPlanId(marketingId: string, productType: string): string | null {
  const plans = ALL_PLANS[productType as keyof typeof ALL_PLANS];
  if (!plans) return null;
  
  const plan = plans[marketingId];
  return plan ? plan.mPanelId : null;
}

/**
 * Helper function to get product details by marketing ID
 */
export function getProductPlan(marketingId: string, productType: string): ProductPlan | null {
  const plans = ALL_PLANS[productType as keyof typeof ALL_PLANS];
  if (!plans) return null;
  
  return plans[marketingId] || null;
}

/**
 * Validate if a plan exists
 */
export function isPlanValid(marketingId: string, productType: string): boolean {
  return getMPanelPlanId(marketingId, productType) !== null;
}

/**
 * Get all plans for a specific product type
 */
export function getPlansByType(productType: string): Record<string, ProductPlan> {
  return ALL_PLANS[productType as keyof typeof ALL_PLANS] || {};
}
