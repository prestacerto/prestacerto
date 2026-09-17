import { type NextRequest, NextResponse } from 'next/server';
import { PHASE2_PRODUCTS, getPhase2CheckoutUrl } from '@/lib/phase2-products';

/**
 * GET /api/products/phase2
 * Retorna lista de 8 produtos FASE 2 com links de checkout
 */
export async function GET(request: NextRequest) {
  const products = PHASE2_PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    billingType: product.billingType,
    features: product.features,
    icon: product.icon,
    checkoutUrl: getPhase2CheckoutUrl(product),
    isActive: !!getPhase2CheckoutUrl(product),
  }));

  // Agrupar por tipo de cobrança
  const monthly = products.filter((p) => p.billingType === 'monthly');
  const oneTime = products.filter((p) => p.billingType === 'one-time');

  const summary = {
    total: products.length,
    monthly: monthly.length,
    oneTime: oneTime.length,
    active: products.filter((p) => p.isActive).length,
    estimatedMRR: monthly.reduce((sum, p) => sum + p.price, 0).toFixed(2),
  };

  return NextResponse.json({
    status: 'ok',
    summary,
    products: {
      all: products,
      monthly,
      oneTime,
    },
    links: {
      admin: '/admin/fase2/produtos',
      dashboard: '/ferramentas/fase2',
    },
  });
}
