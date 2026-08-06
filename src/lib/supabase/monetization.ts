import { createServiceClient } from "@/lib/supabase/service";

// Três linhas de receita novas — ver MONETIZATION_GUIDE.md. Escritas via
// service role porque quem chama (webhook/rota de pagamento) já validou o
// pagamento antes de gravar; não são operações que o usuário faz direto.

export async function addProjectHighlight(
  projectId: string,
  daysHighlighted: number,
  mpPaymentId: string
): Promise<void> {
  const supabase = createServiceClient();
  const featuredUntil = new Date(
    Date.now() + daysHighlighted * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from("projects")
    .update({ is_featured: true, featured_until: featuredUntil })
    .eq("id", projectId);

  if (error) throw error;
  void mpPaymentId; // TODO: gravar numa tabela de cobranças da plataforma quando a integração MP entrar
}

export async function removeProjectHighlight(projectId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_featured: false, featured_until: null })
    .eq("id", projectId);

  if (error) throw error;
}

export async function addVerificationBadge(
  freelancerId: string,
  mpPaymentId: string
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_verified: true, verified_at: new Date().toISOString() })
    .eq("id", freelancerId);

  if (error) throw error;
  void mpPaymentId; // TODO: idem
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
