/**
 * Centralized Pricing Configuration
 * Single source of truth for all product pricing across MigraHosting
 * 
 * Usage:
 *   import { hostingPlans, wpPlans, vpsPlans } from '@/config/pricingConfig';
 *   const plan = hostingPlans.plans.find(p => p.id === 'starter');
 *   const price = plan.pricing.oneYear; // 1.99
 */

export type HostingBillingCycle = "monthly" | "oneYear" | "twoYears" | "threeYears";
export type SimpleBillingCycle = "monthly" | "yearly";

export type HostingPlanId = "student" | "starter" | "premium" | "business";
export type WpPlanId = "wp-starter" | "wp-growth" | "wp-business" | "wp-agency";
export type MailPlanId = "mail-basic" | "mail-pro" | "mail-business";
export type VpsPlanId = "vps-essential" | "vps-plus" | "vps-pro";
export type CloudPlanId = "cloud-start" | "cloud-scale" | "cloud-enterprise";
export type StoragePlanId = "storage-personal" | "storage-team" | "storage-business";

// ===== SHARED HOSTING =====
export const hostingPlans = {
  currency: "USD",
  billingCycles: ["monthly", "oneYear", "twoYears", "threeYears"] as HostingBillingCycle[],
  plans: [
    {
      id: "student" as HostingPlanId,
      name: "Student",
      type: "shared-hosting" as const,
      mPanelId: "plan_student_hosting", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 0,
        oneYear: 0,
        twoYears: 0,
        threeYears: 0,
      },
      notes: "Requires academic verification.",
    },
    {
      id: "starter" as HostingPlanId,
      name: "Starter",
      type: "shared-hosting" as const,
      mPanelId: "plan_starter_hosting", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 7.95,
        oneYear: 1.99,
        twoYears: 1.69,
        threeYears: 1.49,
      },
    },
    {
      id: "premium" as HostingPlanId,
      name: "Premium",
      type: "shared-hosting" as const,
      mPanelId: "plan_premium_hosting", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 8.95,
        oneYear: 3.19,
        twoYears: 2.79,
        threeYears: 2.49,
      },
    },
    {
      id: "business" as HostingPlanId,
      name: "Business",
      type: "shared-hosting" as const,
      mPanelId: "plan_business_hosting", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 9.95,
        oneYear: 4.79,
        twoYears: 4.39,
        threeYears: 3.99,
      },
    },
  ],
} as const;

// ===== MANAGED WORDPRESS =====
export const wpPlans = {
  currency: "USD",
  billingCycles: ["monthly", "oneYear", "twoYears", "threeYears"] as HostingBillingCycle[],
  plans: [
    {
      id: "wp-starter" as WpPlanId,
      name: "WP Starter",
      type: "managed-wordpress" as const,
      mPanelId: "plan_wp_starter", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 11.95,
        oneYear: 8.95,
        twoYears: 7.95,
        threeYears: 6.95,
      },
    },
    {
      id: "wp-growth" as WpPlanId,
      name: "WP Growth",
      type: "managed-wordpress" as const,
      mPanelId: "plan_wp_growth", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 16.95,
        oneYear: 12.95,
        twoYears: 11.45,
        threeYears: 9.95,
      },
    },
    {
      id: "wp-business" as WpPlanId,
      name: "WP Business",
      type: "managed-wordpress" as const,
      mPanelId: "plan_wp_business", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 24.95,
        oneYear: 19.95,
        twoYears: 17.95,
        threeYears: 15.95,
      },
    },
    {
      id: "wp-agency" as WpPlanId,
      name: "WP Agency",
      type: "managed-wordpress" as const,
      mPanelId: "plan_wp_agency", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 39.95,
        oneYear: 32.95,
        twoYears: 29.95,
        threeYears: 26.95,
      },
    },
  ],
} as const;

// ===== EMAIL =====
export const mailPlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "mail-basic" as MailPlanId,
      name: "MigraMail Basic",
      type: "email" as const,
      mPanelId: "plan_email_basic", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 1.5,
        yearly: 1.2,
      },
    },
    {
      id: "mail-pro" as MailPlanId,
      name: "MigraMail Pro",
      type: "email" as const,
      mPanelId: "plan_email_pro", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 2.5,
        yearly: 2.0,
      },
    },
    {
      id: "mail-business" as MailPlanId,
      name: "MigraMail Business",
      type: "email" as const,
      mPanelId: "plan_email_business", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 3.5,
        yearly: 3.0,
      },
    },
  ],
} as const;

// ===== VPS =====
export const vpsPlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "vps-essential" as VpsPlanId,
      name: "VPS Essential",
      type: "vps" as const,
      mPanelId: "plan_vps_essential", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 7.95,
        yearly: 6.95,
      },
    },
    {
      id: "vps-plus" as VpsPlanId,
      name: "VPS Plus",
      type: "vps" as const,
      mPanelId: "plan_vps_plus", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 14.95,
        yearly: 12.95,
      },
    },
    {
      id: "vps-pro" as VpsPlanId,
      name: "VPS Pro",
      type: "vps" as const,
      mPanelId: "plan_vps_pro", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 29.95,
        yearly: 24.95,
      },
    },
  ],
} as const;

// ===== CLOUD =====
export const cloudPlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "cloud-start" as CloudPlanId,
      name: "MigraCloud Start",
      type: "cloud" as const,
      mPanelId: "plan_cloud_start", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 19.95,
        yearly: 16.95,
      },
    },
    {
      id: "cloud-scale" as CloudPlanId,
      name: "MigraCloud Scale",
      type: "cloud" as const,
      mPanelId: "plan_cloud_scale", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 39.95,
        yearly: 32.95,
      },
    },
    {
      id: "cloud-enterprise" as CloudPlanId,
      name: "MigraCloud Enterprise",
      type: "cloud" as const,
      mPanelId: "plan_cloud_enterprise", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 79.95,
        yearly: 64.95,
      },
    },
  ],
} as const;

// ===== STORAGE =====
export const storagePlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "storage-personal" as StoragePlanId,
      name: "MigraDrive Personal",
      type: "storage" as const,
      mPanelId: "plan_storage_personal", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 4.95,
        yearly: 3.95,
      },
    },
    {
      id: "storage-team" as StoragePlanId,
      name: "MigraDrive Team",
      type: "storage" as const,
      mPanelId: "plan_storage_team", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 9.95,
        yearly: 8.45,
      },
    },
    {
      id: "storage-business" as StoragePlanId,
      name: "MigraDrive Business",
      type: "storage" as const,
      mPanelId: "plan_storage_business", // UPDATE WITH REAL MPANEL ID
      pricing: {
        monthly: 24.95,
        yearly: 19.95,
      },
    },
  ],
} as const;

// ===== UTILITY FUNCTIONS =====

/**
 * Helper function to get plan by ID from any plan collection
 */
export function getPlanById<T extends { id: string }>(
  plans: readonly T[],
  id: string
): T | undefined {
  return plans.find(p => p.id === id);
}

/**
 * Helper function to get mPanel ID from any plan ID across all products
 */
export function getMPanelIdFromPlan(planId: string): string | null {
  // Check all plan types
  const allPlans = [
    ...hostingPlans.plans,
    ...wpPlans.plans,
    ...mailPlans.plans,
    ...vpsPlans.plans,
    ...cloudPlans.plans,
    ...storagePlans.plans
  ];

  const plan = allPlans.find(p => p.id === planId);
  return plan?.mPanelId || null;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Calculate total price for a billing cycle
 */
export function calculateTotal(
  monthlyPrice: number,
  cycle: HostingBillingCycle | SimpleBillingCycle
): number {
  const multipliers: Record<string, number> = {
    monthly: 1,
    oneYear: 12,
    twoYears: 24,
    threeYears: 36,
    yearly: 12,
  };
  return monthlyPrice * (multipliers[cycle] || 1);
}

/**
 * Calculate savings compared to monthly billing
 */
export function calculateSavings(
  monthlyPrice: number,
  discountedPrice: number,
  months: number
): number {
  return monthlyPrice * months - discountedPrice * months;
}

/**
 * Get billing cycle display label
 */
export function getBillingCycleLabel(cycle: HostingBillingCycle | SimpleBillingCycle): string {
  const labels: Record<string, string> = {
    monthly: "Monthly",
    yearly: "Yearly",
    oneYear: "1 Year",
    twoYears: "2 Years",
    threeYears: "3 Years",
  };
  return labels[cycle] || cycle;
}

/**
 * Get number of months for a billing cycle
 */
export function getMonthsForCycle(cycle: HostingBillingCycle | SimpleBillingCycle): number {
  const months: Record<string, number> = {
    monthly: 1,
    yearly: 12,
    oneYear: 12,
    twoYears: 24,
    threeYears: 36,
  };
  return months[cycle] || 1;
}

/**
 * Get price with savings calculation
 */
export function getPriceWithSavings(
  monthlyPrice: number,
  termPrice: number,
  months: number
): { price: number; savings: number; savingsPercent: number } {
  const totalMonthly = monthlyPrice * months;
  const savings = totalMonthly - termPrice;
  const savingsPercent = Math.round((savings / totalMonthly) * 100);
  
  return {
    price: termPrice,
    savings,
    savingsPercent,
  };
}
