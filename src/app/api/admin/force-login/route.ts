import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

/**
 * ADMIN ONLY: Force create a test user and return login credentials
 *
 * This is a TEMPORARY EMERGENCY endpoint to test if the dashboard works
 * Usage: POST /api/admin/force-login?key=ADMIN_KEY
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get("key");

  // Simple admin check
  if (adminKey !== "emergency-login-2024") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const supabase = createServiceClient();

    // Email for test user
    const testEmail = `test-${Date.now()}@prestacerto.com.br`;
    const testPassword = "TestPassword123!";

    console.log("[FORCE-LOGIN] Creating user:", testEmail);

    // Step 1: Create auth user via Admin API (no email verification needed)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      console.error("[FORCE-LOGIN] Auth creation failed:", authError);
      return NextResponse.json(
        { error: "Failed to create user: " + authError.message },
        { status: 500 }
      );
    }

    console.log("[FORCE-LOGIN] Auth user created:", authUser.user?.id);

    // Step 2: Create profile entry
    if (authUser.user?.id) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authUser.user.id,
          full_name: "Test User",
          email: testEmail,
          is_active: true,
          plan: "free",
        });

      if (profileError) {
        console.warn("[FORCE-LOGIN] Profile creation warning:", profileError);
        // Don't fail - profile creation error is non-critical
      }

      console.log("[FORCE-LOGIN] Profile created");
    }

    return NextResponse.json({
      success: true,
      credentials: {
        email: testEmail,
        password: testPassword,
      },
      message: "Test user created! Use these credentials to login.",
      instructions: "1. Go to /login\n2. Enter the email and password above\n3. You should now access the dashboard",
    });
  } catch (error) {
    console.error("[FORCE-LOGIN] Error:", error);
    return NextResponse.json(
      { error: "Failed to create test user" },
      { status: 500 }
    );
  }
}
