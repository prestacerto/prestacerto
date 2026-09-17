import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import type { ProductKey } from './product-config';

export interface UserSubscription {
  productId: string;
  plan: 'one-time' | 'monthly';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  renewalDate?: string;
  subscriptionId?: string;
}

export function useSubscription(productKey: ProductKey) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/subscriptions/${productKey}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setSubscription(data.subscription || null);
        } else if (response.status === 404) {
          setSubscription(null);
        } else {
          setError('Erro ao buscar subscricção');
        }
      } catch (err) {
        setError(String(err));
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, productKey]);

  return {
    subscription,
    loading,
    error,
    hasActiveSubscription: subscription?.status === 'active',
    isMonthly: subscription?.plan === 'monthly',
    isOneTime: subscription?.plan === 'one-time',
  };
}
