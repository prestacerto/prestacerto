import { createClient } from '@/lib/supabase/server';
import { getClientProductCheckoutUrl, CLIENT_PRODUCTS } from '@/lib/client-products';
import { readJsonObject } from '@/lib/http/request-body';
import { rateLimiters, checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json(
      { error: 'Entre na sua conta para acessar este produto.' },
      { status: 401 }
    );
  }

  const limit = await checkRateLimit(rateLimiters.checkout, user.id);
  if (!limit.success) return rateLimitResponse(limit.reset);

  const input = await readJsonObject(request, 2048);
  if (input.response) return input.response;

  const productId = input.data.product_id;
  if (!productId || typeof productId !== 'string') {
    return Response.json(
      { error: 'ID do produto inválido.' },
      { status: 400 }
    );
  }

  const product = CLIENT_PRODUCTS.find((p) => p.id === productId);
  if (!product) {
    return Response.json(
      { error: 'Produto não encontrado.' },
      { status: 404 }
    );
  }

  if (product.pricing.model === 'free') {
    return Response.json(
      { error: 'Este é um produto gratuito. Não requer checkout.' },
      { status: 400 }
    );
  }

  try {
    const checkoutUrl = getClientProductCheckoutUrl(productId);

    if (!checkoutUrl) {
      return Response.json(
        {
          error: 'Este produto ainda não possui checkout disponível.',
          product_id: productId,
          status: 'coming_soon'
        },
        { status: 503 }
      );
    }

    const url = new URL(checkoutUrl);

    // Validar que é um URL válido do Assiny
    if (!url.origin.includes('assiny.com.br') && !url.origin.includes('assinify.com')) {
      throw new Error('Invalid checkout URL');
    }

    // Adicionar parâmetros de contexto
    url.searchParams.set('client_product', productId);
    url.searchParams.set('user_id', user.id);
    url.searchParams.set('email', user.email || '');

    return Response.json(
      {
        url: url.toString(),
        product: {
          id: product.id,
          name: product.name,
          price: product.pricing.monthlyPrice || 0,
          model: product.pricing.model,
        }
      },
      {
        headers: { 'Cache-Control': 'private, no-store' }
      }
    );
  } catch (error) {
    console.error('Client checkout error:', error);
    return Response.json(
      { error: 'Não foi possível abrir o checkout agora.' },
      { status: 503 }
    );
  }
}
