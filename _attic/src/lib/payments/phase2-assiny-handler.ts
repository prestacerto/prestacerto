import { createServiceClient } from '@/lib/supabase/service';
import type { ParsedEvent } from './assiny';

/**
 * Processar evento Assiny para FASE 2 (8 produtos)
 * Vincula subscription ao usuário e atualiza acesso
 */
export async function handlePhase2AssinyEvent(
  event: Extract<ParsedEvent, { kind: 'subscription' }>,
  userEmail: string
) {
  const client = createServiceClient();

  try {
    // Validar que é um produto FASE 2
    const phase2Products = [
      'dashboard-ia',
      'insights',
      'badge',
      'certificacao',
      'biblioteca-proposta',
      'portfolio-ia',
      'followup-ia',
      'contra-proposta-ia',
    ];

    // Extrair product_id do evento (pode estar em diferentes campos)
    const productId = extractProductId(event);

    if (!productId || !phase2Products.includes(productId)) {
      console.warn(`[Phase2] Produto não é FASE 2: ${productId}`);
      return null;
    }

    // Encontrar ou criar usuário
    const { data: user, error: userError } = await client.auth.admin.getUserByEmail(userEmail);

    if (userError || !user) {
      console.error(`[Phase2] Usuário não encontrado: ${userEmail}`, userError);
      return null;
    }

    // Inserir/atualizar subscription
    const subscriptionData = {
      user_id: user.id,
      product_id: productId,
      subscription_id: event.subscription_id,
      assiny_event_id: event.event_id,
      billing_type: event.plan_type === 'pro' ? 'monthly' : event.plan_type === 'business' ? 'monthly' : 'one-time',
      status: event.status === 'approved_purchase' ? 'active' : 'pending',
      started_at: new Date(event.occurred_at),
      last_event_id: event.event_id,
      last_event_at: new Date(event.occurred_at),
    };

    const { data, error } = await client
      .from('phase2_subscriptions')
      .upsert(
        {
          ...subscriptionData,
          updated_at: new Date(),
        },
        {
          onConflict: 'subscription_id',
        }
      )
      .select();

    if (error) {
      console.error(`[Phase2] Erro ao processar subscription:`, error);
      return null;
    }

    // Log de auditoria
    await client.from('phase2_subscription_events').insert({
      subscription_id: data?.[0]?.id,
      event_type: event.status,
      assiny_event_id: event.event_id,
      payload: event,
    });

    console.log(`[Phase2] Subscription processada: ${user.email} → ${productId}`);

    return {
      userId: user.id,
      productId,
      status: subscriptionData.status,
    };
  } catch (error) {
    console.error('[Phase2] Erro fatal:', error);
    return null;
  }
}

/**
 * Cancelar subscription FASE 2
 */
export async function cancelPhase2Subscription(
  subscriptionId: string,
  reason?: string
) {
  const client = createServiceClient();

  const { error } = await client
    .from('phase2_subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date(),
    })
    .eq('subscription_id', subscriptionId);

  if (error) {
    console.error('[Phase2] Erro ao cancelar:', error);
    return false;
  }

  return true;
}

/**
 * Extrair product_id do evento Assiny
 */
function extractProductId(event: any): string | null {
  // Tentar múltiplas localizações
  const candidates = [
    event.product_id,
    event.product?.id,
    event.offer?.product_id,
    event.data?.product_id,
    event.data?.offer?.product_id,
  ];

  for (const candidate of candidates) {
    if (candidate) return String(candidate).toLowerCase();
  }

  return null;
}

/**
 * Obter produtos FASE 2 que um usuário tem acesso
 */
export async function getUserPhase2Products(userId: string) {
  const client = createServiceClient();

  const { data, error } = await client
    .rpc('list_phase2_access', {
      user_id: userId,
    })
    .select();

  if (error) {
    console.error('[Phase2] Erro ao listar produtos:', error);
    return [];
  }

  return data || [];
}

/**
 * Verificar acesso a um produto FASE 2
 */
export async function hasPhase2Access(userId: string, productId: string): Promise<boolean> {
  const client = createServiceClient();

  const { data, error } = await client
    .rpc('has_phase2_access', {
      user_id: userId,
      product_id: productId,
    })
    .single();

  if (error) {
    console.error('[Phase2] Erro ao verificar acesso:', error);
    return false;
  }

  return data === true;
}
