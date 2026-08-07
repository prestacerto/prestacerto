import { createServiceClient } from "@/lib/supabase/service";

// Três linhas de receita novas — destaque de projeto, badge de verificado e
// antecipação de recebimento. Escritas via service role porque quem chama
// (rota de pagamento/webhook) já validou o pagamento antes de gravar; não
// são operações que o usuário faz direto.
//
// Destaque e badge têm histórico próprio (project_highlights,
// freelancer_badges) em vez de um booleano direto em projects/profiles —
// um projeto pode ser destacado mais de uma vez ao longo do tempo, e cada
// cobrança fica registrada em payment_transactions pra dar rastro de
// auditoria (ver 0005_monetization_tables.sql).

export async function addProjectHighlight(
  clientId: string,
  projectId: string,
  daysHighlighted: number,
  amount: number,
  mpPaymentId: string
): Promise<void> {
  const supabase = createServiceClient();
  const validUntil = new Date(
    Date.now() + daysHighlighted * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error: highlightError } = await supabase.from("project_highlights").insert({
    project_id: projectId,
    valid_until: validUntil,
    days_purchased: daysHighlighted,
    payment_id: mpPaymentId,
  });
  if (highlightError) throw highlightError;

  const { error: transactionError } = await supabase.from("payment_transactions").insert({
    user_id: clientId,
    payment_type: "highlight",
    reference_id: projectId,
    amount,
    mercado_pago_id: mpPaymentId,
    status: "approved",
    metadata: { days: daysHighlighted },
  });
  if (transactionError) throw transactionError;
}

export async function addVerificationBadge(
  freelancerId: string,
  amount: number,
  mpPaymentId: string
): Promise<void> {
  const supabase = createServiceClient();
  const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  const { error: badgeError } = await supabase.from("freelancer_badges").insert({
    freelancer_id: freelancerId,
    badge_type: "verified",
    valid_until: validUntil,
    payment_id: mpPaymentId,
  });
  if (badgeError) throw badgeError;

  const { error: transactionError } = await supabase.from("payment_transactions").insert({
    user_id: freelancerId,
    payment_type: "badge",
    reference_id: freelancerId,
    amount,
    mercado_pago_id: mpPaymentId,
    status: "approved",
  });
  if (transactionError) throw transactionError;
}

export async function createEarlyPaymentRequest(
  proposalId: string,
  freelancerId: string,
  amount: number,
  feePercentage = 0.0299
): Promise<string> {
  const supabase = createServiceClient();
  const fee = amount * feePercentage;
  const netAmount = amount - fee;

  const { data, error } = await supabase
    .from("early_payment_requests")
    .insert({
      proposal_id: proposalId,
      freelancer_id: freelancerId,
      original_amount: amount,
      fee_percentage: feePercentage,
      fee_amount: fee,
      net_amount: netAmount,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateEarlyPaymentStatus(
  requestId: string,
  status: "pending" | "captured" | "failed",
  mpPaymentId?: string
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("early_payment_requests")
    .update({
      status,
      ...(mpPaymentId ? { mp_payment_id: mpPaymentId } : {}),
    })
    .eq("id", requestId);

  if (error) throw error;
}
