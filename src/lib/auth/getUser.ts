import { createClient } from "@/lib/supabase/server";

// Wrapper fino, mas com uma regra importante: sempre usar getUser(), nunca
// getSession() isoladamente. getSession() só lê o cookie local sem
// revalidar contra o servidor — getUser() faz uma chamada real de
// verificação. É a camada 2 da defesa em profundidade (middleware é a
// camada 1, RLS no Postgres é a camada 3).
export async function getAuthenticatedUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    // Nunca deixe uma falha de rede/config do Supabase derrubar a página —
    // trata como visitante deslogado. Rotas realmente protegidas continuam
    // seguras: o proxy.ts e a RLS do Postgres não dependem desta função.
    console.error("getAuthenticatedUser falhou:", error);
    return null;
  }
}

export async function getProfile() {
  try {
    const supabase = await createClient();
    const user = await getAuthenticatedUser();
    if (!user) return null;

    // Use service client to bypass RLS (temporary - until RLS is properly configured)
    const { createServiceClient } = await import("@/lib/supabase/service");
    const serviceSupabase = createServiceClient();

    const { data: profile } = await serviceSupabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return profile;
  } catch (error) {
    console.error("getProfile failed:", error);
    return null;
  }
}
