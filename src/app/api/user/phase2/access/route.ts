import { type NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth/server';
import { createServiceClient } from '@/lib/supabase/service';
import type { Phase2ProductId } from '@/lib/phase2-products';

/**
 * GET /api/user/phase2/access
 * Retorna produtos FASE 2 que o usuário atual tem acesso
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuth();

    if (!auth.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = createServiceClient();

    // Obter produtos FASE 2 do usuário
    const { data, error } = await client.rpc('list_phase2_access', {
      user_id: auth.user.id,
    });

    if (error) {
      console.error('[Phase2] Erro ao listar produtos:', error);
      return NextResponse.json(
        { error: 'Failed to fetch access' },
        { status: 500 }
      );
    }

    // Extrair product_ids
    const products: Phase2ProductId[] = (data || []).map(
      (row: { product_id: string }) => row.product_id as Phase2ProductId
    );

    return NextResponse.json({
      status: 'ok',
      userId: auth.user.id,
      products,
      count: products.length,
      hasAccess: products.length > 0,
    });
  } catch (error) {
    console.error('[Phase2] Erro na API:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
