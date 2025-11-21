// Pricing configuration for mPanel integration
// This bridges the catalog data with pricing components

export type HostingBillingCycle = 'monthly' | 'oneYear' | 'twoYears' | 'threeYears';
export type WordPressBillingCycle = 'monthly' | 'oneYear' | 'twoYears' | 'threeYears';

// Hosting Plans
export const hostingPlans = {
  billingCycles: ['monthly', 'oneYear', 'twoYears', 'threeYears'] as HostingBillingCycle[],
  currency: 'USD',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small websites',
      pricing: {
        monthly: 7.99,
        oneYear: 2.49,
        twoYears: 1.99,
        threeYears: 1.49
      },
      prices: {
        monthly: 7.99,
        oneYear: 2.49,
        twoYears: 1.99,
        threeYears: 1.49
      },
      features: [
        '1 website',
        '30 GB NVMe storage',
        'Unmetered bandwidth',
        'Free SSL certificate',
        'Daily backups',
        '24/7 support'
      ],
      notes: []
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Great for growing sites',
      pricing: {
        monthly: 8.99,
        oneYear: 3.49,
        twoYears: 2.99,
        threeYears: 2.49
      },
      prices: {
        monthly: 8.99,
        oneYear: 3.49,
        twoYears: 2.99,
        threeYears: 2.49
      },
      features: [
        'Up to 50 websites',
        '75 GB NVMe storage',
        'Unmetered bandwidth',
        '10 MySQL databases',
        'Unlimited email accounts',
        'Free migrations',
        'Priority support'
      ],
      notes: []
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For professional websites',
      pricing: {
        monthly: 9.99,
        oneYear: 4.99,
        twoYears: 4.49,
        threeYears: 3.99
      },
      prices: {
        monthly: 9.99,
        oneYear: 4.99,
        twoYears: 4.49,
        threeYears: 3.99
      },
      features: [
        'Unlimited websites',
        '100 GB NVMe storage',
        'Unmetered bandwidth',
        'Unlimited databases',
        'Unlimited mailboxes',
        'Free migrations',
        'Priority support',
        'Free dedicated IP'
      ],
      notes: []
    }
  ]
};

// WordPress Plans
export const wordpressPlans = {
  billingCycles: ['monthly', 'oneYear', 'twoYears', 'threeYears'] as WordPressBillingCycle[],
  currency: 'USD',
  plans: [
    {
      id: 'wp-starter',
      name: 'WP Starter',
      description: 'Perfect for WordPress beginners',
      pricing: {
        monthly: 8.99,
        oneYear: 3.49,
        twoYears: 2.99,
        threeYears: 2.49
      },
      prices: {
        monthly: 8.99,
        oneYear: 3.49,
        twoYears: 2.99,
        threeYears: 2.49
      },
      features: [
        '1 WordPress site',
        '30 GB NVMe storage',
        'Optimized for WordPress',
        'Free SSL certificate',
        'Automatic updates',
        'Daily backups'
      ],
      notes: []
    },
    {
      id: 'wp-premium',
      name: 'WP Premium',
      description: 'For professional WordPress sites',
      pricing: {
        monthly: 12.99,
        oneYear: 6.49,
        twoYears: 5.99,
        threeYears: 5.49
      },
      prices: {
        monthly: 12.99,
        oneYear: 6.49,
        twoYears: 5.99,
        threeYears: 5.49
      },
      features: [
        'Up to 10 WordPress sites',
        '75 GB NVMe storage',
        'Advanced caching',
        'Staging environment',
        'Malware scanning',
        'Priority support'
      ],
      notes: []
    }
  ]
};

// Email Plans
export const mailPlans = {
  billingCycles: ['monthly', 'oneYear'] as HostingBillingCycle[],
  currency: 'USD',
  plans: [
    {
      id: 'email-basic',
      name: 'Email Basic',
      description: 'Professional email hosting',
      pricing: { monthly: 2.99, oneYear: 2.49, twoYears: 2.49, threeYears: 2.49 },
      prices: { monthly: 2.99, oneYear: 2.49, twoYears: 2.49, threeYears: 2.49 },
      features: ['10 GB storage', '5 email accounts', 'Webmail access'],
      notes: []
    }
  ]
};

// VPS Plans
export const vpsPlans = {
  billingCycles: ['monthly', 'oneYear'] as HostingBillingCycle[],
  currency: 'USD',
  plans: [
    {
      id: 'vps-basic',
      name: 'VPS Basic',
      description: 'Entry-level VPS',
      pricing: { monthly: 19.99, oneYear: 17.99, twoYears: 17.99, threeYears: 17.99 },
      prices: { monthly: 19.99, oneYear: 17.99, twoYears: 17.99, threeYears: 17.99 },
      features: ['2 vCPU', '4 GB RAM', '50 GB SSD'],
      notes: []
    }
  ]
};

// Cloud Plans
export const cloudPlans = {
  billingCycles: ['monthly', 'oneYear'] as HostingBillingCycle[],
  currency: 'USD',
  plans: [
    {
      id: 'cloud-basic',
      name: 'Cloud Basic',
      description: 'Scalable cloud hosting',
      pricing: { monthly: 29.99, oneYear: 27.99, twoYears: 27.99, threeYears: 27.99 },
      prices: { monthly: 29.99, oneYear: 27.99, twoYears: 27.99, threeYears: 27.99 },
      features: ['Auto-scaling', 'Load balancing', '99.99% uptime'],
      notes: []
    }
  ]
};

// Storage Plans
export const storagePlans = {
  billingCycles: ['monthly', 'oneYear'] as HostingBillingCycle[],
  currency: 'USD',
  plans: [
    {
      id: 'storage-basic',
      name: 'Storage Basic',
      description: 'Cloud storage solution',
      pricing: { monthly: 9.99, oneYear: 8.99, twoYears: 8.99, threeYears: 8.99 },
      prices: { monthly: 9.99, oneYear: 8.99, twoYears: 8.99, threeYears: 8.99 },
      features: ['100 GB storage', 'FTP/SFTP access', 'Automatic backups'],
      notes: []
    }
  ]
};

// Utility functions
export function formatPrice(price: number, currency = 'USD'): string {
  return `$${price.toFixed(2)}`;
}

export function getBillingCycleLabel(cycle: HostingBillingCycle | WordPressBillingCycle): string {
  const labels: Record<string, string> = {
    monthly: 'Monthly',
    oneYear: '1 Year',
    twoYears: '2 Years',
    threeYears: '3 Years'
  };
  return labels[cycle] || cycle;
}

export function getMonthsForCycle(cycle: HostingBillingCycle | WordPressBillingCycle): number {
  const months: Record<string, number> = {
    monthly: 1,
    oneYear: 12,
    twoYears: 24,
    threeYears: 36
  };
  return months[cycle] || 1;
}

export function getPriceWithSavings(
  monthlyPrice: number,
  discountedPrice: number,
  months: number
): { total: number; savings: number; savingsPercent: number } {
  const total = discountedPrice * months;
  const regularTotal = monthlyPrice * months;
  const savings = regularTotal - total;
  const savingsPercent = Math.round((savings / regularTotal) * 100);
  
  return { total, savings, savingsPercent };
}
