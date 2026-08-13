import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Demo credentials
  const DEMO_EMAIL = "demo@prestacerto.com.br";
  const DEMO_PASSWORD = "Demo123!@#";

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    // Set auth cookies
    const response = NextResponse.json(
      {
        success: true,
        access_token: "demo_token_" + Date.now(),
        refresh_token: "demo_refresh_" + Date.now(),
        user: {
          id: "demo-user-123",
          email: DEMO_EMAIL,
          user_metadata: {
            name: "Demo User",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
          },
        },
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set("auth-token", "demo_token_" + Date.now(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("user-id", "demo-user-123", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  }

  // Try real Supabase if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createServerClient } = await import("@supabase/ssr");

      let response = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (!data.session) {
        return NextResponse.json({ error: "No session returned" }, { status: 400 });
      }

      response = NextResponse.json(
        {
          success: true,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          user: data.user,
        },
        { status: 200 }
      );

      return response;
    } catch (error) {
      console.error("Supabase login failed:", error);
      // Fall through to error response
    }
  }

  // Invalid credentials
  return NextResponse.json(
    { error: "Email ou senha incorretos. Use demo@prestacerto.com.br / Demo123!@#" },
    { status: 401 }
  );
}
