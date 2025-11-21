export type PlanKey = "student" | "starter" | "premium" | "business";
export type TermKey = "monthly" | "annually" | "biennially" | "triennially";

export const TERM_LABELS: Record<TermKey, string> = {
  monthly: "Monthly",
  annually: "Annually (1 year)",
  biennially: "Biennially (2 years)",
  triennially: "Triennially (3 years)",
};

// Trial configuration
export const TRIAL_ENABLED: Record<PlanKey, boolean> = {
  student: false,
  starter: true,  // 14-day trial available
  premium: false,
  business: false,
};

export const TRIAL_DAYS = 14;

export const TERM_MONTHS: Record<TermKey, number> = {
  monthly: 1,
  annually: 12,
  biennially: 24,
  triennially: 36,
};

export const DISPLAY_PER_MONTH: Record<PlanKey, Record<TermKey, string>> = {
  student: { monthly: "0.00", annually: "0.00", biennially: "0.00", triennially: "0.00" },
  starter: { monthly: "7.99", annually: "2.49", biennially: "1.99", triennially: "1.49" },
  premium: { monthly: "8.99", annually: "3.49", biennially: "2.99", triennially: "2.49" },
  business: { monthly: "9.99", annually: "4.99", biennially: "4.49", triennially: "3.99" },
};

export const FEATURES: Record<PlanKey, string[]> = {
  student: ["Subdomain only", "2 GB SSD", "50 GB/mo bandwidth", "1 MySQL database", "1 mailbox", "Free SSL"],
  starter: ["14-day free trial", "1 website", "30 GB NVMe storage", "Unmetered bandwidth", "Free SSL", "Daily backups"],
  premium: ["Up to 50 websites", "75 GB NVMe storage", "10 MySQL databases", "Unlimited email accounts", "Free migrations"],
  business: ["Unlimited websites", "100 GB NVMe storage", "Unmetered bandwidth", "Unlimited mailboxes per site", "Priority support"],
};

export const PRICE_IDS: Record<PlanKey, Record<TermKey, string>> = {
  student: {
    monthly: "",
    annually: "",
    biennially: "",
    triennially: "",
  },
  starter: {
    monthly: "price_1SQcISPwKgOrBJUApZmVknSP",
    annually: "price_1SQcrFPwKgOrBJUAFmFXOG5T",
    biennially: "price_1SQcrXPwKgOrBJUAcMfAAcZ0",
    triennially: "price_1SQcsZPwKgOrBJUAIqGL80n9",
  },
  premium: {
    monthly: "price_1SQcJ2PwKgOrBJUA99qX0j3W",
    annually: "price_1SQcpUPwKgOrBJUAjtRWxkre",
    biennially: "price_1SQcpmPwKgOrBJUATMrytn3f",
    triennially: "price_1SQcqHPwKgOrBJUANuwraEKI",
  },
  business: {
    monthly: "price_1SQcJZPwKgOrBJUAzxYp5rBg",
    annually: "price_1SQcmWPwKgOrBJUAHef1Erzv",
    biennially: "price_1SQcnPPwKgOrBJUAxakV0pNZ",
    triennially: "price_1SQcnzPwKgOrBJUA0Rh8M5Yh",
  },
};

export const PLAN_NAMES: Record<PlanKey, string> = {
  student: "Student",
  starter: "Starter",
  premium: "Premium",
  business: "Business",
};

// ===== ADDITIONAL PRICING CONSTANTS =====

// Setup fee for non-student hosting plans
export const SETUP_FEE = 2.85;

// Domain pricing (per year)
export const DOMAIN_PRICES = {
  com: 12.99,
  net: 14.99,
  org: 13.99,
  io: 38.99,
  cloud: 19.99,
  dev: 14.99,
  app: 17.99,
  co: 28.99,
  ai: 99.99,
  tech: 49.99,
  shop: 34.99,
  online: 34.99,
  default: 12.99, // Default domain price (fallback)
} as const;

// Email hosting pricing (per mailbox/month)
export const EMAIL_PRICES = {
  basic: 2.99,
  pro: 7.99,
  enterprise: 14.99,
} as const;

// VPS pricing (per month)
export const VPS_PRICES = {
  starter: 9.99,
  standard: 19.99,
  advanced: 39.99,
} as const;

// Cloud hosting pricing (per month)
export const CLOUD_PRICES = {
  small: 29.99,
  large: 59.99,
} as const;

// WordPress hosting pricing (per month)
export const WORDPRESS_PRICES = {
  student: 0.00,
  starter: 3.99,
  pro: 7.99,
  business: 14.99,
} as const;

// Storage pricing (per month)
export const STORAGE_PRICES = {
  personal: 4.99,
  team: 14.99,
  business: 49.99,
} as const;

// Addon pricing
export const ADDON_PRICES = {
  ssl: 9.99, // per year
  backup: {
    basic: 3.64,   // monthly
    pro: 6.99,     // monthly
    business: 11.99 // monthly
  },
  email_basic: 1.99, // per mailbox (promotional)
} as const;

// Get the lowest price for a hosting plan (3-year term)
export const getLowestPrice = (plan: PlanKey): string => {
  return DISPLAY_PER_MONTH[plan].triennially;
};
