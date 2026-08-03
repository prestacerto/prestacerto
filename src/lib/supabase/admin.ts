import { createServiceClient } from "@/lib/supabase/service";

// O e-mail de login vive em auth.users, não em profiles — só a service role
// consegue ler isso, via a Admin API do GoTrue.
export async function getUserEmailById(userId: string): Promise<string | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !data.user) return null;
    return data.user.email ?? null;
  } catch (error) {
    console.error("getUserEmailById falhou:", error);
    return null;
  }
}
