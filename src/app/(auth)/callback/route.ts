import { safeDestination, authDestination } from "@/lib/auth/destination";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Destino do redirect OAuth (Google). Troca o `code` da URL por uma sessão
// e manda o usuário pro dashboard.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/dashboard";
  const next = safeDestination(requestedNext);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${authDestination("login", next)}`);
}
