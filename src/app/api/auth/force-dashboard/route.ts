import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * EMERGENCY: Force redirect to dashboard if user is authenticated
 * This bypasses the LoginForm if there are issues
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");
    const redirect = searchParams.get("redirect") || "/dashboard";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase config" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Try to login
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

    if (!data?.session) {
      return NextResponse.json(
        { error: "No session" },
        { status: 500 }
      );
    }

    // Create response that redirects to dashboard
    const response = NextResponse.redirect(new URL(redirect, request.url));

    // Set auth cookies
    response.cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: data.session.expires_in,
      path: "/",
    });

    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 604800,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[force-dashboard] Error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
