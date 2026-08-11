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

    if (!data.user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      access_token: data.session?.access_token,
    });
  } catch (err: any) {
    console.error("[LOGIN API] Exception:", err);
    return NextResponse.json(
      { error: err.message || "Erro no servidor" },
      { status: 500 }
    );
  }
}
