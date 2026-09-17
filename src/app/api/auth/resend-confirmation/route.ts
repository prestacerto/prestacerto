import { safeDestination } from "@/lib/auth/destination";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { readJsonObject } from "@/lib/http/request-body";
import { rateLimiters, getClientIP, rateLimitResponse } from "@/lib/rate-limit";

function confirmationRedirectUrl(next: unknown) {
  const appUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://prestacerto.com.br").replace(/\/$/, "");
  return `${appUrl}/callback?${new URLSearchParams({ next: safeDestination(next) })}`;
}

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimiters.recovery.limit(getClientIP(request));
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(request, 8192);
    if (input.response) return input.response;
    const body = input.data;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: confirmationRedirectUrl(body.next) },
    });

    if (error) {
      console.error("Erro ao reenviar confirmação:", error.message);
      return NextResponse.json({ error: "Não foi possível reenviar o e-mail agora." }, { status: 400 });
    }

    // A resposta é propositalmente neutra para não revelar se o e-mail existe.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar reenvio de confirmação:", error);
    return NextResponse.json({ error: "Não foi possível reenviar o e-mail agora." }, { status: 500 });
  }
}
