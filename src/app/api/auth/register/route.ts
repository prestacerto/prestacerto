import { safeDestination } from "@/lib/auth/destination";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { readJsonObject } from "@/lib/http/request-body";
import { rateLimiters, getClientIP, rateLimitResponse } from "@/lib/rate-limit";
import { createEmailQueue } from "@/lib/email/queue";

const MIN_PASSWORD_LENGTH = 6;
const VALID_ROLES = new Set(["freelancer", "client"]);

function confirmationRedirectUrl(next: unknown) {
  const appUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://prestacerto.com.br").replace(/\/$/, "");
  return `${appUrl}/callback?${new URLSearchParams({ next: safeDestination(next) })}`;
}

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimiters.register.limit(getClientIP(request));
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(request, 8192);
    if (input.response) return input.response;
    const body = input.data;
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = typeof body.role === 'string' && VALID_ROLES.has(body.role) ? body.role : "freelancer";

    if (fullName.length < 2 || fullName.length > 80) {
      return NextResponse.json({ error: "Informe seu nome completo." }, { status: 400 });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }
    if (password.length < MIN_PASSWORD_LENGTH || password.length > 1024) {
      return NextResponse.json(
        { error: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` },
        { status: 400 },
      );
    }

    const authResponse = NextResponse.next({ request });
    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              authResponse.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: confirmationRedirectUrl(body.next),
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Criar fila de e-mails em background (não bloqueia resposta)
    createEmailQueue(
      data.user?.id || email,
      email,
      role === "client" ? "CLIENTE" : "PRESTADOR"
    ).catch((err) => {
      console.error("Erro ao criar fila de e-mails:", err);
    });

    const response = NextResponse.json(
      {
        success: true,
        session: Boolean(data.session),
        requires_email_confirmation: !data.session,
        user: data.user,
      },
      { status: 200 },
    );

    authResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json({ error: "Não foi possível criar sua conta agora." }, { status: 500 });
  }
}
