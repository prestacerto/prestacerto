import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { readJsonObject } from "@/lib/http/request-body";
import { rateLimiters, getClientIP, rateLimitResponse } from "@/lib/rate-limit";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimiters.login.limit(getClientIP(request));
    if (!limit.success) return rateLimitResponse(limit.reset);
    const input = await readJsonObject(request, 8192);
    if (input.response) return input.response;
    const body = input.data;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || email.length > 254 || !password || password.length > 1024) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
    }

    const cookiesToSet: CookieToSet[] = [];
    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookies) {
            cookiesToSet.push(...cookies);
          },
        },
      },
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.session) {
      return NextResponse.json({ error: "Não foi possível iniciar sua sessão." }, { status: 400 });
    }

    const response = NextResponse.json(
      {
        success: true,
        session: true,
        user: data.user,
      },
      { status: 200 },
    );

    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (error) {
    console.error("Erro ao entrar:", error);
    return NextResponse.json({ error: "Não foi possível entrar agora." }, { status: 500 });
  }
}
