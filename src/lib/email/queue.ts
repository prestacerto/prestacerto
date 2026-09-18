import { createServiceClient } from "@/lib/supabase/service";

let supabaseClient: ReturnType<typeof createServiceClient> | null = null;
const getSupabase = () => (supabaseClient ??= createServiceClient());

export type EmailSequence = "CLIENTE" | "PRESTADOR";

export type EmailQueueEntry = {
  id: string;
  user_id: string;
  email: string;
  sequence: EmailSequence;
  step: number;
  send_at: Date;
  status: "pending" | "sent" | "failed";
  sent_at?: Date;
  created_at: Date;
};

// Criar tabela se não existir
export async function ensureEmailQueueTable() {
  const { error } = await getSupabase().rpc("ensure_email_queue_table", {});
  if (error) console.error("Failed to ensure email_queue table:", error);
}

// Criar fila de e-mails quando usuário se registra
export async function createEmailQueue(
  user_id: string,
  email: string,
  sequence: EmailSequence
) {
  const now = new Date();
  const delays = [0, 1, 3, 5, 7]; // dias (step 0 = imediato)

  for (let i = 0; i < 5; i++) {
    const send_at = new Date(now);
    send_at.setDate(send_at.getDate() + delays[i]);
    if (i > 0) send_at.setHours(9, 0, 0, 0); // 09:00 da manhã (menos o step 0 que é imediato)

    await getSupabase().from("email_queue").insert({
      user_id,
      email,
      sequence,
      step: i,
      send_at,
      status: "pending",
    });
  }
}

// Pegar e-mails pendentes pra enviar
export async function getPendingEmails() {
  const { data, error } = await getSupabase()
    .from("email_queue")
    .select("*")
    .eq("status", "pending")
    .lte("send_at", new Date().toISOString())
    .order("send_at", { ascending: true });

  if (error) throw error;
  return data as EmailQueueEntry[];
}

// Marcar e-mail como enviado
export async function markEmailAsSent(id: string) {
  const { error } = await getSupabase()
    .from("email_queue")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

// Marcar e-mail como erro
export async function markEmailAsFailed(id: string) {
  const { error } = await getSupabase()
    .from("email_queue")
    .update({ status: "failed" })
    .eq("id", id);

  if (error) throw error;
}

// Cancelar sequência (quando usuário já fez a ação)
export async function cancelEmailSequence(
  user_id: string,
  sequence: EmailSequence
) {
  const { error } = await getSupabase()
    .from("email_queue")
    .delete()
    .eq("user_id", user_id)
    .eq("sequence", sequence)
    .eq("status", "pending");

  if (error) throw error;
}
