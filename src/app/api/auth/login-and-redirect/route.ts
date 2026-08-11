import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://taktwwwpcyxhyylzmgho.supabase.co";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ArMX97jGsCK0jbe3Opd74g_ZNY2WQ36";

    const supabase = createClient(url, key);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: "Sessão inválida" },
        { status: 400 }
      );
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL("/dashboard", request.url), {
      status: 303,
    });

    // Set auth cookies
    response.cookies.set("sb-auth-token", data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    response.cookies.set("sb-refresh-token", data.session.refresh_token || "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 1 month
    });

    return response;
  } catch (err: any) {
    console.error("[LOGIN API] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Erro no servidor" },
      { status: 500 }
    );
  }
}
