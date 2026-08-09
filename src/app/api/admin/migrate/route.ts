import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const adminToken = req.headers.get("x-admin-token");

  if (adminToken !== "prestacerto_migrate_admin_2026") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Get all migration files
    const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const results = [];

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      try {
        // Execute SQL via rpc if available, otherwise skip
        const { error } = await supabase.rpc("exec_sql", {
          sql_text: sql,
        });

        if (error) {
          // If rpc doesn't exist, try creating a test record instead
          console.warn(`RPC might not exist for ${file}:`, error.message);
          results.push({
            file,
            status: "skipped_rpc_missing",
            message: error.message,
          });
        } else {
          results.push({ file, status: "success" });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        results.push({
          file,
          status: "error",
          message: errorMsg,
        });
      }
    }

    return NextResponse.json({
      success: true,
      total: files.length,
      results,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error, success: false },
      { status: 500 }
    );
  }
}
