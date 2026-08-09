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
    const user = await getAuthenticatedUser();
    if (!user) {
      console.log("[getProfile] No authenticated user");
      return null;
    }

    // Try service client first (for production where RLS is bypassed)
    try {
      const { createServiceClient } = await import("@/lib/supabase/service");
      const serviceSupabase = createServiceClient();

      const { data: profile, error } = await serviceSupabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      console.log("[getProfile] Got profile via serviceClient:", profile?.id);
      return profile;
    } catch (serviceError) {
      console.warn("[getProfile] serviceClient failed, trying authenticated client:", serviceError);

      // Fallback: use authenticated client (RLS will apply)
      const supabase = await createClient();
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("[getProfile] Both clients failed:", error);
        return null;
      }

      console.log("[getProfile] Got profile via authenticated client:", profile?.id);
      return profile;
    }
  } catch (error) {
    console.error("[getProfile] Unexpected error:", error);
    return null;
  }
}
