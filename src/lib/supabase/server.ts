import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

// Use em Server Components e Route Handlers. NUNCA reaproveite a mesma
// instância entre requests — Server Components rodam por request.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // set() chamado de um Server Component sem contexto de resposta
          // (ex: durante render estático). O proxy cuida do refresh quando
          // houver um contexto de request com resposta.
        }
      },
    },
  });
}
