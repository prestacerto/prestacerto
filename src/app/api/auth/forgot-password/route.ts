import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";
import { readJsonObject } from "@/lib/http/request-body";
import { rateLimiters, getClientIP, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const limit = await rateLimiters.recovery.limit(getClientIP(req));
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(req, 8192);
    if (input.response) return input.response;
    const email = typeof input.data.email === 'string' ? input.data.email.trim().toLowerCase() : '';

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://prestacerto.com.br').replace(/\/$/, '');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Keep this aligned with the public recovery page used by the web form.
      // Sending users to a non-existent /auth route makes an otherwise valid
      // Supabase recovery link appear broken after they click it.
      redirectTo: `${siteUrl}/reset-password`,
    });

    if (error) {
      console.error("[FORGOT PASSWORD ERROR]", error.code || 'provider_error');
      return NextResponse.json(
        { error: "Erro ao enviar link de recuperação" },
        { status: error.status === 429 ? 429 : 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Se houver uma conta com esse e-mail, você receberá as instruções de recuperação.",
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
