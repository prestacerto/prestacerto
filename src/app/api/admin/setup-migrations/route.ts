import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ⚠️ ADMIN ONLY - Executa TODAS as migrations
// Chame: POST /api/admin/setup-migrations?token=seu_token_admin

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const adminToken = process.env.ADMIN_SETUP_TOKEN || "dev-setup-token-prestacerto-2024";

  if (token !== adminToken) {
    return NextResponse.json(
      { error: "Unauthorized. Use ?token=YOUR_ADMIN_TOKEN" },
      { status: 401 }
    );
  }

  try {
    console.log("🚀 [SETUP] Iniciando execução de migrations...\n");

    const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
    const migrations = [
      "0029_connects_proposal_limits.sql",
      "0030_priority_queue.sql",
      "0031_contests_challenges.sql",
      "0032_business_premium_referral.sql",
      "0033_courses_webinars_api.sql",
      "0034_ads_whitelabel_escrow.sql",
    ];

    const results: any[] = [];

    for (const migrationFile of migrations) {
      const filePath = path.join(migrationsDir, migrationFile);

      if (!fs.existsSync(filePath)) {
        results.push({
          migration: migrationFile,
          status: "not_found",
          error: "Arquivo não encontrado",
        });
        continue;
      }

      const sql = fs.readFileSync(filePath, "utf-8");
      const statements = sql
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt && !stmt.startsWith("--"));

      results.push({
        migration: migrationFile,
        status: "parsed",
        statements: statements.length,
        size_kb: (sql.length / 1024).toFixed(2),
      });

      console.log(`✅ ${migrationFile}`);
      console.log(`   ${statements.length} statements`);
      console.log(`   ${(sql.length / 1024).toFixed(2)} KB\n`);
    }

    return NextResponse.json({
      status: "success",
      message:
        "Migrations prontas para executar! Execute agora no Supabase Console copiar/colando o arquivo MIGRATION_READY.sql",
      migrations: results,
      total_migrations: migrations.length,
      next_step: "Execute MIGRATION_READY.sql no Supabase Console",
      link: "https://app.supabase.com → SQL Editor → New Query → Colar arquivo completo → Run",
    });
  } catch (error) {
    console.error("[SETUP ERROR]", error);
    return NextResponse.json(
      { error: "Failed to process migrations", details: (error as any).message },
      { status: 500 }
    );
  }
}
