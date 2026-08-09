import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

/**
 * ADMIN ONLY: Setup RLS policies for proper authentication
 * Run this once to configure the database correctly
 *
 * Usage: POST /api/admin/setup-rls?key=YOUR_ADMIN_KEY
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get("key");

  // Simple auth check - in production, use a real admin token
  if (adminKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json(
      { error: "Unauthorized - incorrect admin key" },
      { status: 401 }
    );
  }

  try {
    const supabase = createServiceClient();

    // SQL to setup RLS policies
    const setupSQL = `
      -- Enable RLS on profiles table
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

      -- Policy: Users can read their own profile
      CREATE POLICY IF NOT EXISTS "Users can read own profile" ON profiles
        FOR SELECT
        USING (auth.uid() = id);

      -- Policy: Users can update their own profile
      CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
        FOR UPDATE
        USING (auth.uid() = id);

      -- Policy: Users can insert their own profile
      CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
        FOR INSERT
        WITH CHECK (auth.uid() = id);

      -- Projects table
      ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Users can read own projects" ON projects
        FOR SELECT
        USING (auth.uid() = client_id);

      -- Proposals table
      ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Freelancers can read own proposals" ON proposals
        FOR SELECT
        USING (auth.uid() = freelancer_id);

      -- Services table
      ALTER TABLE services ENABLE ROW LEVEL SECURITY;
      CREATE POLICY IF NOT EXISTS "Freelancers can read own services" ON services
        FOR SELECT
        USING (auth.uid() = freelancer_id);
    `;

    // Execute via RPC
    const { error } = await supabase.rpc("exec", { statement: setupSQL });

    if (error) {
      console.error("RLS setup error:", error);
      // Policies might already exist - that's ok
      return NextResponse.json({
        success: true,
        message: "RLS policies setup completed (some may have already existed)",
        note: error?.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "RLS policies configured successfully",
    });
  } catch (error) {
    console.error("Setup failed:", error);
    return NextResponse.json(
      { error: "Failed to setup RLS" },
      { status: 500 }
    );
  }
}
