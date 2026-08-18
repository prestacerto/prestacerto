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

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("[getProfile] Failed to load profile:", error);
    }

    // Fallback transitório para contas antigas enquanto a migration/backfill
    // ainda não foi aplicada no projeto Supabase.
    return profile ?? {
      id: user.id,
      email: user.email ?? null,
      role: user.user_metadata?.role === "client" ? "client" : "freelancer",
      full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Novo usuário",
    };
  } catch (error) {
    console.error("[getProfile] Unexpected error:", error);
    return null;
  }
}
