import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use em Server Components e Route Handlers. NUNCA reaproveite a mesma
// instância entre requests — Server Components rodam por request.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // set() chamado de um Server Component sem contexto de resposta
            // (ex: durante render estático). O middleware cuida do refresh
            // de sessão nesse caso, então é seguro ignorar aqui.
          }
        },
      },
    }
  );
}
