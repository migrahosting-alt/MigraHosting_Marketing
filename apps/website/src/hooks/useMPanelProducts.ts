/**
 * React hook for fetching products from mPanel
 */
import { useState, useEffect } from 'react';
import { mpanelApi, type MPanelProduct, type MPanelProductCatalog } from '../lib/mpanel-api';

interface UseMPanelProductsOptions {
  category?: 'shared-hosting' | 'vps' | 'cloud' | 'wordpress' | 'email' | 'reseller';
  enabled?: boolean;
}

interface UseMPanelProductsReturn {
  products: MPanelProduct[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useMPanelProducts(
  options: UseMPanelProductsOptions = {}
): UseMPanelProductsReturn {
  const { category, enabled = true } = options;
  const [products, setProducts] = useState<MPanelProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response: MPanelProductCatalog = await mpanelApi.getProducts(category);
      
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        throw new Error('Invalid response format from mPanel API');
      }
    } catch (err) {
      console.error('Failed to fetch mPanel products:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, enabled]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}

/**
 * Hook for fetching system status
 */
interface UseSystemStatusReturn {
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | null;
  uptime: number | null;
  isLoading: boolean;
  error: Error | null;
}

export function useSystemStatus(): UseSystemStatusReturn {
  const [status, setStatus] = useState<'operational' | 'degraded' | 'partial_outage' | 'major_outage' | null>(null);
  const [uptime, setUptime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await mpanelApi.getSystemStatus();
        
        if (response.success && response.data) {
          setStatus(response.data.status);
          setUptime(response.data.uptime_percentage);
        }
      } catch (err) {
        console.error('Failed to fetch system status:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { status, uptime, isLoading, error };
}
