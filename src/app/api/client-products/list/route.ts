import { CLIENT_PRODUCTS, formatProductPrice, calculateClientProductsMRR } from '@/lib/client-products';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache por 1 hora

export async function GET() {
  const mrr = calculateClientProductsMRR();

  return Response.json({
    products: CLIENT_PRODUCTS.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      emoji: product.emoji,
      description: product.description,
      pricing: {
        model: product.pricing.model,
        monthlyPrice: product.pricing.monthlyPrice,
        commissionRate: product.pricing.commissionRate,
        currency: product.pricing.currency,
        formatted: formatProductPrice(product),
      },
      features: product.features,
      dashboardRoute: product.dashboardRoute,
      tier: product.tier,
      hasCheckout: product.assinifyCheckoutUrl ? true : false,
      comingSoon: product.comingSoon ?? false,
    })),
    summary: {
      totalProducts: CLIENT_PRODUCTS.length,
      monthlyProducts: mrr.monthlyProducts,
      commissionProducts: mrr.commissionProducts,
      freeProducts: CLIENT_PRODUCTS.filter((p) => p.pricing.model === 'free').length,
      estimatedMRR: mrr.totalMonthlyMRR,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
}
