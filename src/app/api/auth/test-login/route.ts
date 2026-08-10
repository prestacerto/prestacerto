import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * TEST ENDPOINT: Verifies login works end-to-end
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

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
        { error: "Missing Supabase configuration" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log("[test-login] Attempting login with:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[test-login] Login failed:", error);
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 401 }
      );
    }

    if (!data?.session) {
      console.error("[test-login] No session returned");
      return NextResponse.json(
        { error: "No session returned from Supabase" },
        { status: 500 }
      );
    }

    console.log("[test-login] Login successful for:", data.user?.id);

    // Set the auth cookie so the next request is authenticated
    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      message: "Login successful. Redirecting to dashboard...",
    });

    // Set auth cookies
    response.cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: data.session.expires_in,
    });

    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 604800, // 7 days
    });

    return response;
  } catch (err) {
    console.error("[test-login] Error:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
