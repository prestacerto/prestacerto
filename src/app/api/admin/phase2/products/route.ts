import { type NextRequest, NextResponse } from 'next/server';
import { PHASE2_PRODUCTS, getPhase2CheckoutUrl } from '@/lib/phase2-products';
import { requireAdminAuth } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth(request);

    const products = PHASE2_PRODUCTS.map((product) => ({
      ...product,
      checkoutUrl: getPhase2CheckoutUrl(product),
      envVarName: `NEXT_PUBLIC_ASSINY_${product.id.toUpperCase().replace(/-/g, '_')}`,
      envVarValue: process.env[`NEXT_PUBLIC_ASSINY_${product.id.toUpperCase().replace(/-/g, '_')}`],
    }));

    return NextResponse.json({
      status: 'ok',
      count: products.length,
      products,
      summary: {
        monthly: products.filter((p) => p.billingType === 'monthly').length,
        oneTime: products.filter((p) => p.billingType === 'one-time').length,
        estimatedMRR: products
          .filter((p) => p.billingType === 'monthly')
          .reduce((sum, p) => sum + p.price, 0)
          .toFixed(2),
        totalOneTime: products
          .filter((p) => p.billingType === 'one-time')
          .reduce((sum, p) => sum + p.price, 0)
          .toFixed(2),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth(request);

    const body = await request.json();
    const { productId, checkoutUrl } = body;

    if (!productId || !checkoutUrl) {
      return NextResponse.json(
        { error: 'productId and checkoutUrl required' },
        { status: 400 }
      );
    }

    // Validar formato do URL
    if (
      !checkoutUrl.startsWith('https://pay.assiny.com.br/') ||
      !checkoutUrl.includes('/node/')
    ) {
      return NextResponse.json(
        { error: 'Invalid checkout URL format. Expected: https://pay.assiny.com.br/{account_id}/node/{product_id}' },
        { status: 400 }
      );
    }

    // Validar que o produto existe
    const product = PHASE2_PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product ${productId} not found` },
        { status: 404 }
      );
    }

    // Retornar instruções para adicionar a env var
    const envVarName = `NEXT_PUBLIC_ASSINY_${productId.toUpperCase().replace(/-/g, '_')}`;

    return NextResponse.json({
      status: 'ok',
      message: `Add this env var to your .env.local or Vercel dashboard:`,
      envVarName,
      envVarValue: checkoutUrl,
      instructions: {
        step1: `Copy the env var name: ${envVarName}`,
        step2: `Set value: ${checkoutUrl}`,
        step3: 'Redeploy your app',
        step4: 'Verify link works at /admin/fase2/produtos',
      },
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        billingType: product.billingType,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
