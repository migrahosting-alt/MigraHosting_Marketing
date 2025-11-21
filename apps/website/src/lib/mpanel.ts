/**
 * mPanel Integration Client for MigraHosting
 * Connects marketing site to mPanel control panel for checkout and provisioning
 */

const MPANEL_URL = import.meta.env.VITE_MPANEL_URL || 'https://migrapanel.com';

export interface MPanelPlan {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  disk_space?: string;
  bandwidth?: string;
  max_websites?: number;
  features?: string[];
}

export interface CheckoutSession {
  url: string;
  id: string;
}

export class MPanelClient {
  private baseURL: string;

  constructor(baseURL: string = MPANEL_URL) {
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  /**
   * Get available hosting plans from mPanel
   */
  async getPlans(): Promise<MPanelPlan[]> {
    const response = await fetch(`${this.baseURL}/api/public/plans`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch plans: ${response.statusText}`);
    }

    const data = await response.json();
    return data.plans || [];
  }

  /**
   * Create Stripe checkout session for a plan
   */
  async createCheckout(
    planId: string,
    term: 'monthly' | 'annually',
    email: string,
    successUrl?: string,
    cancelUrl?: string
  ): Promise<CheckoutSession> {
    const response = await fetch(`${this.baseURL}/api/public/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        term,
        email,
        successUrl: successUrl || `${window.location.origin}/checkout/success`,
        cancelUrl: cancelUrl || `${window.location.origin}/pricing`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return response.json();
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseURL}/api/health`);
    return response.json();
  }
}

// Singleton instance
export const mpanelClient = new MPanelClient();
