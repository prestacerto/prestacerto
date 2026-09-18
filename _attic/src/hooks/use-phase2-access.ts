'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/client';
import type { Phase2ProductId } from '@/lib/phase2-products';

interface Phase2AccessState {
  products: Phase2ProductId[];
  hasAccess: (productId: Phase2ProductId) => boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook: Obter produtos FASE 2 que o usuário tem acesso
 * Usa /api/user/phase2/access
 */
export function usePhase2Access(): Phase2AccessState {
  const { user } = useAuth();
  const [products, setProducts] = useState<Phase2ProductId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/user/phase2/access');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.products || []);
      setError(null);
    } catch (err) {
      console.error('[Phase2] Erro ao carregar acesso:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [user?.id]);

  const hasAccess = (productId: Phase2ProductId): boolean => {
    return products.includes(productId);
  };

  return {
    products,
    hasAccess,
    loading,
    error,
    refetch,
  };
}
