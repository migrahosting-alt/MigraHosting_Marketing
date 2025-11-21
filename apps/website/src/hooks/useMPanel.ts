/**
 * React hook for mPanel integration
 * Provides easy access to mPanel plans and checkout functionality
 */

import { useState, useEffect } from 'react';
import { mpanelClient, type MPanelPlan } from '../lib/mpanel';

export function useMPanel() {
  const [plans, setPlans] = useState<MPanelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPlans = await mpanelClient.getPlans();
      setPlans(fetchedPlans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans');
      console.error('Error loading mPanel plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (
    planId: string,
    term: 'monthly' | 'annually',
    email: string
  ): Promise<string> => {
    try {
      const session = await mpanelClient.createCheckout(planId, term, email);
      return session.url;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create checkout');
    }
  };

  return {
    plans,
    loading,
    error,
    createCheckout,
    reload: loadPlans
  };
}
