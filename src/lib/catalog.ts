export type PlanKey = "student" | "starter" | "premium" | "business";
export type TermKey = "monthly" | "annually" | "biennially" | "triennially";

export const TERM_LABELS: Record<TermKey, string> = {
  monthly: "Monthly",
  annually: "Annually (1 year)",
  biennially: "Biennially (2 years)",
  triennially: "Triennially (3 years)",
};

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
  starter: ["1 website", "30 GB NVMe storage", "Unmetered bandwidth", "Free SSL", "Daily backups"],
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
