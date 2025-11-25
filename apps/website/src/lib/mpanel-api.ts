/**
 * mPanel Marketing API Client
 * Complete integration with mPanel Control Panel Marketing API
 * 
 * @see /.github/copilot-instructions.md for full API documentation
 */

const MPANEL_API_URL = import.meta.env.VITE_MPANEL_API_URL || 'https://migrapanel.com/api';
const MPANEL_CONTROL_PANEL_URL = import.meta.env.VITE_MPANEL_CONTROL_PANEL_URL || 'https://migrapanel.com';

// ========== TYPE DEFINITIONS ==========

export interface MPanelProduct {
  id: string;
  name: string;
  category: 'shared-hosting' | 'vps' | 'cloud' | 'wordpress' | 'email' | 'reseller';
  description: string;
  billing_cycles: {
    monthly?: number;
    annual?: number;
    biennial?: number;
    triennial?: number;
  };
  features: string[];
  resources: {
    disk_space?: string;
    bandwidth?: string;
    cpu_cores?: number;
    ram?: string;
    websites?: number;
    databases?: number;
    email_accounts?: number;
  };
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MPanelProductCatalog {
  success: boolean;
  data: MPanelProduct[];
  meta: {
    total: number;
    category?: string;
  };
}

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
  components: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    last_checked: string;
  }[];
  incidents: {
    id: string;
    title: string;
    severity: 'info' | 'warning' | 'critical';
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    created_at: string;
    updated_at: string;
  }[];
  uptime_percentage: number;
  timestamp: string;
}

export interface CreateAccountRequest {
  email: string;
  name: string;
  company?: string;
  phone?: string;
  plan_id?: string;
  marketing_source?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface CreateAccountResponse {
  success: boolean;
  data: {
    account_id: string;
    email: string;
    reset_token: string;
    reset_token_expires: string;
    control_panel_url: string;
  };
  message: string;
}

export interface MPanelAPIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// ========== API CLIENT ==========

class MPanelAPI {
  private baseURL: string;
  private controlPanelURL: string;

  constructor() {
    this.baseURL = MPANEL_API_URL;
    this.controlPanelURL = MPANEL_CONTROL_PANEL_URL;
  }

  /**
   * Get all products from the catalog
   * @param category - Optional filter by category
   */
  async getProducts(category?: string): Promise<MPanelProductCatalog> {
    const url = category 
      ? `${this.baseURL}/marketing-api/products/catalog?category=${category}`
      : `${this.baseURL}/marketing-api/products/catalog`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single product by ID
   */
  async getProduct(productId: string): Promise<{ success: boolean; data: MPanelProduct }> {
    const response = await fetch(
      `${this.baseURL}/marketing-api/products/${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get system status and uptime information
   */
  async getSystemStatus(): Promise<{ success: boolean; data: SystemStatus }> {
    const response = await fetch(
      `${this.baseURL}/marketing-api/status/system`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch system status: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get current incidents
   */
  async getIncidents(): Promise<{
    success: boolean;
    data: SystemStatus['incidents'];
  }> {
    const response = await fetch(
      `${this.baseURL}/marketing-api/status/incidents`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch incidents: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new account (called from backend to protect API key)
   * This method should be called from your backend API, not directly from frontend
   */
  async createAccount(data: CreateAccountRequest): Promise<CreateAccountResponse> {
    // This should go through your backend API to protect the API key
    const response = await fetch('/api/accounts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Account creation failed');
    }

    return response.json();
  }

  /**
   * Get control panel URL for redirects
   */
  getControlPanelURL(): string {
    return this.controlPanelURL;
  }

  /**
   * Build control panel URL with path
   */
  buildControlPanelURL(path: string): string {
    return `${this.controlPanelURL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      return response.json();
    } catch (error) {
      console.error('mPanel health check failed:', error);
      throw error;
    }
  }
}

// ========== SINGLETON INSTANCE ==========

export const mpanelApi = new MPanelAPI();

// ========== UTILITY FUNCTIONS ==========

/**
 * Capture UTM parameters from URL
 */
export function captureUTMParams(): {
  campaign?: string | null;
  source?: string | null;
  medium?: string | null;
  content?: string | null;
  term?: string | null;
} {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utmData = {
    campaign: params.get('utm_campaign'),
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    content: params.get('utm_content'),
    term: params.get('utm_term'),
  };

  // Store in localStorage (30-day persistence)
  Object.entries(utmData).forEach(([key, value]) => {
    if (value) {
      localStorage.setItem(`utm_${key}`, value);
    }
  });

  return utmData;
}

/**
 * Get stored UTM parameters from localStorage
 */
export function getStoredUTMParams(): {
  campaign?: string | null;
  source?: string | null;
  medium?: string | null;
  content?: string | null;
  term?: string | null;
} {
  if (typeof window === 'undefined') return {};

  return {
    campaign: localStorage.getItem('utm_campaign'),
    source: localStorage.getItem('utm_source'),
    medium: localStorage.getItem('utm_medium'),
    content: localStorage.getItem('utm_content'),
    term: localStorage.getItem('utm_term'),
  };
}

/**
 * Clear stored UTM parameters
 */
export function clearUTMParams(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('utm_campaign');
  localStorage.removeItem('utm_source');
  localStorage.removeItem('utm_medium');
  localStorage.removeItem('utm_content');
  localStorage.removeItem('utm_term');
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate annual savings
 */
export function calculateAnnualSavings(monthlyPrice: number, annualPrice: number): {
  savings: number;
  percentage: number;
  formattedSavings: string;
} {
  const totalMonthly = monthlyPrice * 12;
  const savings = totalMonthly - annualPrice;
  const percentage = (savings / totalMonthly) * 100;

  return {
    savings,
    percentage,
    formattedSavings: formatPrice(savings),
  };
}

/**
 * Get Stripe price ID mapping (for backward compatibility with existing checkout)
 * This bridges the gap between mPanel products and existing Stripe price IDs
 */
export function getStripePriceId(planId: string, billingCycle: 'monthly' | 'annual' | 'biennial' | 'triennial'): string | null {
  // Map mPanel plan IDs to Stripe price IDs
  // Update these mappings based on your actual Stripe price IDs
  const priceMapping: Record<string, Record<string, string>> = {
    'starter': {
      monthly: import.meta.env.VITE_PRICE_STARTER_MONTHLY || '',
      annual: import.meta.env.VITE_PRICE_STARTER_ANNUAL || '',
      biennial: import.meta.env.VITE_PRICE_STARTER_BIENNIAL || '',
      triennial: import.meta.env.VITE_PRICE_STARTER_TRIENNIAL || '',
    },
    'premium': {
      monthly: import.meta.env.VITE_PRICE_PREMIUM_MONTHLY || '',
      annual: import.meta.env.VITE_PRICE_PREMIUM_ANNUAL || '',
      biennial: import.meta.env.VITE_PRICE_PREMIUM_BIENNIAL || '',
      triennial: import.meta.env.VITE_PRICE_PREMIUM_TRIENNIAL || '',
    },
    'business': {
      monthly: import.meta.env.VITE_PRICE_BUSINESS_MONTHLY || '',
      annual: import.meta.env.VITE_PRICE_BUSINESS_ANNUAL || '',
      biennial: import.meta.env.VITE_PRICE_BUSINESS_BIENNIAL || '',
      triennial: import.meta.env.VITE_PRICE_BUSINESS_TRIENNIAL || '',
    },
  };

  return priceMapping[planId]?.[billingCycle] || null;
}
