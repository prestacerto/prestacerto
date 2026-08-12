import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Force Vercel rebuild - login-static endpoint
  try {
    const { access_token, refresh_token } = await request.json();

    if (!access_token) {
      return NextResponse.json({ error: "Token ausente" }, { status: 400 });
    }

    const response = NextResponse.redirect(new URL("/dashboard", request.url), {
      status: 303,
    });

    response.cookies.set({
      name: "supabase-auth-token",
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    if (refresh_token) {
      response.cookies.set({
        name: "supabase-refresh-token",
        value: refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao processar login" },
      { status: 500 }
    );
  }
}
