import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client com a service role key — ignora RLS. Só pode ser usado em código
// que roda no servidor e nunca é exposto ao browser (route handlers de
// pagamento: checkout e webhook do Mercado Pago). NUNCA importe isto em um
// componente client.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
