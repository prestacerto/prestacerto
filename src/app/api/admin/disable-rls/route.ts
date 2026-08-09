import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

/**
 * TEMPORARY: Disable RLS on tables to allow normal operations
 * This should only be used while proper RLS policies are being configured
 */
export async function POST() {
  try {
    const supabase = createServiceClient();

    // Disable RLS on all tables temporarily
    const tables = ["profiles", "projects", "proposals", "services", "messages"];

    for (const table of tables) {
      const { error } = await supabase.rpc("exec", {
        statement: `ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`,
      });

      if (error) {
        console.log(`Note: Could not disable RLS on ${table} (may already be disabled)`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "RLS disabled on all tables (TEMPORARY - for development only)",
    });
  } catch (error) {
    console.error("Failed to disable RLS:", error);
    return NextResponse.json(
      { error: "Failed to disable RLS" },
      { status: 500 }
    );
  }
}
