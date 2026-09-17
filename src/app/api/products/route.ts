import { NextRequest, NextResponse } from 'next/server';
import { COMMUNITY_PRODUCTS, getCheckoutUrl } from '@/lib/community-products-data';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const id = searchParams.get('id');

  try {
    if (id) {
      // Get single product
      const product = COMMUNITY_PRODUCTS.find(p => p.id === id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const checkoutUrl = getCheckoutUrl(product);
      return NextResponse.json({
        ...product,
        checkoutUrl,
      });
    }

    // List products
    let products = COMMUNITY_PRODUCTS;
    if (status && ['live', 'beta', 'coming-soon'].includes(status)) {
      products = products.filter(p => p.status === status);
    }

    const productsWithCheckout = products.map(p => ({
      ...p,
      checkoutUrl: getCheckoutUrl(p),
    }));

    return NextResponse.json({
      total: productsWithCheckout.length,
      products: productsWithCheckout,
    });
  } catch (error) {
    console.error('[PRODUCTS_API]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
