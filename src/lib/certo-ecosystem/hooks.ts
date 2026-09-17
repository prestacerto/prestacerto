// HOOKS REUTILIZÁVEIS DO CERTO ECOSYSTEM

import { useCallback, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CertoProduct, CertoUserProduct, CertoProductUsage } from './types';

const supabase = createClientComponentClient();

// Hook: Verificar se user tem um product ativo
export function useCertoProduct(productSlug: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAccess = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasAccess(false);
        return;
      }

      const { data: product } = await supabase
        .from('certo_products')
        .select('id')
        .eq('slug', productSlug)
        .single();

      if (!product) {
        setHasAccess(false);
        return;
      }

      const { data: subscription } = await supabase
        .from('certo_user_products')
        .select('subscription_status')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('subscription_status', 'active')
        .single();

      setHasAccess(!!subscription);
    } catch (error) {
      console.error('Erro ao verificar acesso ao produto:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [productSlug]);

  return { hasAccess, isLoading, checkAccess };
}

// Hook: Rastrear uso do produto
export function useCertoProductUsage(productSlug: string) {
  const track = useCallback(async (action: string, metadata = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: product } = await supabase
        .from('certo_products')
        .select('id')
        .eq('slug', productSlug)
        .single();

      if (!product) return;

      await supabase.from('certo_product_usage').insert({
        user_id: user.id,
        product_id: product.id,
        action,
        metadata,
      });
    } catch (error) {
      console.error('Erro ao rastrear uso:', error);
    }
  }, [productSlug]);

  return { track };
}

// Hook: Puxar dados do user no ecosystem
export function useCertoUserData() {
  const [userPoints, setUserPoints] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [activeProducts, setActiveProducts] = useState<CertoProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Pontos
      const { data: pointsData } = await supabase
        .from('certo_user_points')
        .select('total_points, badges_earned')
        .eq('user_id', user.id)
        .single();

      if (pointsData) {
        setUserPoints(pointsData.total_points);
        setBadges(pointsData.badges_earned || []);
      }

      // Produtos ativos
      const { data: userProducts } = await supabase
        .from('certo_user_products')
        .select(`
          *,
          product:certo_products(*)
        `)
        .eq('user_id', user.id)
        .eq('subscription_status', 'active');

      if (userProducts) {
        setActiveProducts(userProducts.map((up: any) => up.product));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userPoints, badges, activeProducts, isLoading, fetchUserData };
}

// Hook: Adicionar pontos (gamification)
export function useCertoPoints() {
  const addPoints = useCallback(async (points: number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Busca user points
      const { data: current } = await supabase
        .from('certo_user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (current) {
        // Atualiza
        await supabase
          .from('certo_user_points')
          .update({
            total_points: current.total_points + points,
            level: Math.floor((current.total_points + points) / 1000) + 1,
          })
          .eq('user_id', user.id);
      } else {
        // Cria
        await supabase.from('certo_user_points').insert({
          user_id: user.id,
          total_points: points,
          level: Math.floor(points / 1000) + 1,
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
    }
  }, []);

  return { addPoints };
}

// Hook: Listar todos os produtos
export function useCertoProducts(category?: string) {
  const [products, setProducts] = useState<CertoProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      let query = supabase.from('certo_products').select('*');

      if (category) {
        query = query.eq('category', category);
      }

      const { data } = await query;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  return { products, isLoading, fetchProducts };
}

// Hook: Assinar um produto
export function useCertoSubscription() {
  const subscribe = useCallback(async (productSlug: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: product } = await supabase
        .from('certo_products')
        .select('id')
        .eq('slug', productSlug)
        .single();

      if (!product) throw new Error('Product not found');

      const { error } = await supabase.from('certo_user_products').insert({
        user_id: user.id,
        product_id: product.id,
        subscription_status: 'active',
      });

      if (error) throw error;

      // Adiciona pontos quando subscreve
      const { addPoints } = useCertoPoints();
      addPoints(100, `Subscribed to ${productSlug}`);

      return { success: true };
    } catch (error) {
      console.error('Erro ao assinar produto:', error);
      return { success: false, error };
    }
  }, []);

  return { subscribe };
}
