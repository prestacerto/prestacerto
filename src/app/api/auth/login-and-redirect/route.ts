import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: "Configuração do servidor incompleta" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return Response.json({ error: error?.message || "Falha ao fazer login" }, { status: 401 });
    }

    // Set auth cookies
    const cookieStore = await cookies();
    cookieStore.set("supabase-auth-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return Response.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return Response.json({ error: err.message || "Erro ao fazer login" }, { status: 500 });
  }
}
