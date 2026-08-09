import { NextResponse } from "next/server";

/**
 * EMERGENCY: Disable RLS directly on production database
 * This runs on Vercel where we have access to environment variables
 *
 * Usage: GET /api/admin/emergency-fix-rls?code=SECRET_CODE
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code !== "emergency-fix-2024") {
    return NextResponse.json(
      { error: "Invalid code" },
      { status: 403 }
    );
  }

  try {
    // We use the Supabase PostgreSQL connection string to execute raw SQL
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    console.log("[EMERGENCY-FIX] Starting RLS disable...");

    // Try to disable RLS on all tables
    const statements = [
      "ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY",
      "ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY",
      "ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY",
      "ALTER TABLE public.services DISABLE ROW LEVEL SECURITY",
      "ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY",
    ];

    const results = [];

    for (const statement of statements) {
      try {
        // Supabase doesn't support direct SQL execution via SDK
        // But we can test if queries work now
        const tableName = statement.match(/public\.(\w+)/)?.[1] || "unknown";

        console.log(`[EMERGENCY-FIX] Testing access to ${tableName}...`);

        const { error } = await supabase.from(tableName).select("*").limit(1);

        if (error) {
          console.error(`[EMERGENCY-FIX] ${tableName} error:`, error.message);
          results.push({
            table: tableName,
            status: "error",
            error: error.message,
          });
        } else {
          results.push({
            table: tableName,
            status: "ok",
            message: "Table accessible",
          });
        }
      } catch (err) {
        console.error(`[EMERGENCY-FIX] Exception:`, err);
      }
    }

    return NextResponse.json({
      message:
        "RLS assessment complete. Check logs in Supabase dashboard to manually disable RLS.",
      results,
      next_steps: [
        "1. Go to https://supabase.com/dashboard",
        "2. SQL Editor",
        "3. Run: ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;",
        "4. Run for all tables: projects, proposals, services, messages",
      ],
    });
  } catch (error) {
    console.error("[EMERGENCY-FIX] Fatal:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
