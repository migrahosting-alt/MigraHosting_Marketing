/**
 * MIGRA ECOSYSTEM - CENTRALIZED PRICING CONFIG
 * 
 * Single source of truth for all product pricing across the Migra ecosystem.
 * All prices are in USD. 
 * 
 * Usage:
 * import { hostingPlans } from "@/config/pricing";
 * const starterPlan = hostingPlans.plans.find(p => p.id === "starter");
 * 
 * Last updated: November 16, 2025
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type HostingBillingCycle = "monthly" | "oneYear" | "twoYears" | "threeYears";
export type SimpleBillingCycle = "monthly" | "yearly";

// ==========================================
// SHARED HOSTING - MigraHosting
// ==========================================

export const hostingPlans = {
  currency: "USD",
  billingCycles: ["monthly", "oneYear", "twoYears", "threeYears"] as HostingBillingCycle[],
  plans: [
    {
      id: "student",
      name: "Student",
      type: "shared-hosting",
      pricing: {
        monthly: 0,
        oneYear: 0,
        twoYears: 0,
        threeYears: 0,
      },
      notes: "Requires academic verification.",
    },
    {
      id: "starter",
      name: "Starter",
      type: "shared-hosting",
      pricing: {
        monthly: 7.95,
        oneYear: 1.99,
        twoYears: 1.69,
        threeYears: 1.49,
      },
    },
    {
      id: "premium",
      name: "Premium",
      type: "shared-hosting",
      pricing: {
        monthly: 8.95,
        oneYear: 3.19,
        twoYears: 2.79,
        threeYears: 2.49,
      },
    },
    {
      id: "business",
      name: "Business",
      type: "shared-hosting",
      pricing: {
        monthly: 9.95,
        oneYear: 4.79,
        twoYears: 4.39,
        threeYears: 3.99,
      },
    },
  ],
} as const;

// ==========================================
// MANAGED WORDPRESS - MigraWP
// ==========================================

export const wpPlans = {
  currency: "USD",
  billingCycles: ["monthly", "oneYear", "twoYears", "threeYears"] as HostingBillingCycle[],
  plans: [
    {
      id: "wp-starter",
      name: "WP Starter",
      type: "managed-wordpress",
      pricing: {
        monthly: 11.95,
        oneYear: 8.95,
        twoYears: 7.95,
        threeYears: 6.95,
      },
    },
    {
      id: "wp-growth",
      name: "WP Growth",
      type: "managed-wordpress",
      pricing: {
        monthly: 16.95,
        oneYear: 12.95,
        twoYears: 11.45,
        threeYears: 9.95,
      },
    },
    {
      id: "wp-business",
      name: "WP Business",
      type: "managed-wordpress",
      pricing: {
        monthly: 24.95,
        oneYear: 19.95,
        twoYears: 17.95,
        threeYears: 15.95,
      },
    },
    {
      id: "wp-agency",
      name: "WP Agency",
      type: "managed-wordpress",
      pricing: {
        monthly: 39.95,
        oneYear: 32.95,
        twoYears: 29.95,
        threeYears: 26.95,
      },
    },
  ],
} as const;

// ==========================================
// EMAIL - MigraMail (Per Mailbox)
// ==========================================

export const mailPlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "mail-basic",
      name: "MigraMail Basic",
      pricing: {
        monthly: 1.5,
        yearly: 1.2,
      },
    },
    {
      id: "mail-pro",
      name: "MigraMail Pro",
      pricing: {
        monthly: 2.5,
        yearly: 2.0,
      },
    },
    {
      id: "mail-business",
      name: "MigraMail Business",
      pricing: {
        monthly: 3.5,
        yearly: 3.0,
      },
    },
  ],
} as const;

// ==========================================
// VPS - MigraVPS
// ==========================================

export const vpsPlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "vps-essential",
      name: "VPS Essential",
      pricing: {
        monthly: 7.95,
        yearly: 6.95,
      },
    },
    {
      id: "vps-plus",
      name: "VPS Plus",
      pricing: {
        monthly: 14.95,
        yearly: 12.95,
      },
    },
    {
      id: "vps-pro",
      name: "VPS Pro",
      pricing: {
        monthly: 29.95,
        yearly: 24.95,
      },
    },
  ],
} as const;

// ==========================================
// CLOUD SERVERS - MigraCloud
// ==========================================

export const cloudPlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "cloud-start",
      name: "MigraCloud Start",
      pricing: {
        monthly: 19.95,
        yearly: 16.95,
      },
    },
    {
      id: "cloud-scale",
      name: "MigraCloud Scale",
      pricing: {
        monthly: 39.95,
        yearly: 32.95,
      },
    },
    {
      id: "cloud-enterprise",
      name: "MigraCloud Enterprise",
      pricing: {
        monthly: 79.95,
        yearly: 64.95,
      },
    },
  ],
} as const;

// ==========================================
// CLOUD STORAGE - MigraDrive
// ==========================================

export const storagePlans = {
  currency: "USD",
  billingCycles: ["monthly", "yearly"] as SimpleBillingCycle[],
  plans: [
    {
      id: "storage-personal",
      name: "MigraDrive Personal",
      pricing: {
        monthly: 4.95,
        yearly: 3.95,
      },
    },
    {
      id: "storage-team",
      name: "MigraDrive Team",
      pricing: {
        monthly: 9.95,
        yearly: 8.45,
      },
    },
    {
      id: "storage-business",
      name: "MigraDrive Business",
      pricing: {
        monthly: 24.95,
        yearly: 19.95,
      },
    },
  ],
} as const;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return price === 0 ? "Free" : `$${price.toFixed(2)}`;
};

/**
 * Calculate total for a billing cycle
 */
export const calculateTotal = (monthlyRate: number, months: number): number => {
  return monthlyRate * months;
};

/**
 * Calculate savings percentage
 */
export const calculateSavings = (monthly: number, discounted: number): number => {
  if (monthly === 0 || discounted === 0) return 0;
  return Math.round(((monthly - discounted) / monthly) * 100);
};
