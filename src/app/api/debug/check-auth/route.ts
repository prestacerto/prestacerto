import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { NextResponse } from "next/server";

/**
 * DEBUG: Check authentication and profile access
 * Access via: /api/debug/check-auth
 *
 * This endpoint helps diagnose login issues by testing the auth flow
 */
export async function GET() {
  try {
    console.log("[DEBUG] Starting auth check...");

    // Step 1: Check if user is authenticated
    const user = await getAuthenticatedUser();
    console.log("[DEBUG] getAuthenticatedUser result:", user?.id);

    if (!user) {
      return NextResponse.json({
        status: "no-auth",
        message: "No authenticated user found",
        steps: {
          step1_getAuthenticatedUser: "FAILED - no user",
        },
      });
    }

    // Step 2: Try to get profile
    console.log("[DEBUG] Attempting getProfile for user:", user.id);
    const profile = await getProfile();
    console.log("[DEBUG] getProfile result:", profile?.id);

    // Step 3: Try direct query
    console.log("[DEBUG] Attempting direct Supabase query...");
    const supabase = await createClient();
    const { data: directProfile, error: directError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    console.log("[DEBUG] Direct query error:", directError?.message);
    console.log("[DEBUG] Direct query result:", directProfile?.id);

    return NextResponse.json({
      status: "ok",
      user: {
        id: user.id,
        email: user.email,
      },
      profile: {
        found: !!profile,
        id: profile?.id,
        full_name: profile?.full_name,
      },
      directQuery: {
        found: !!directProfile,
        id: directProfile?.id,
        error: directError?.message,
      },
      diagnosis:
        profile || directProfile
          ? "✅ Auth and profile access working!"
          : "❌ Profile query failed - check RLS policies in Supabase",
    });
  } catch (error) {
    console.error("[DEBUG] Auth check error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
