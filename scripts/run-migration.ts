/**
 * Executa a migration de monetização direto no Supabase
 * Usa: npx ts-node scripts/run-migration.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltam variáveis de ambiente:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL");
  console.error("   SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log("🚀 Executando migration de monetização...\n");

  try {
    // Ler arquivo SQL
    const sqlPath = path.join(
      __dirname,
      "../supabase/migrations/0005_monetization_tables.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf-8");

    // Executar SQL via admin API
    const { error } = await supabase.rpc("exec", { sql });

    if (error) {
      console.error("❌ Erro ao executar migration:", error.message);
      process.exit(1);
    }

    console.log("✅ Migration executada com sucesso!\n");
    console.log("✨ Tabelas criadas:");
    console.log("   • project_highlights");
    console.log("   • freelancer_premium");
    console.log("   • freelancer_badges");
    console.log("   • payment_transactions");
    console.log("   • active_highlights (view)");
    console.log("   • active_premium (view)");
    console.log("   • active_badges (view)");
    console.log("   • revenue_analytics (view)");

  } catch (error) {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  }
}

runMigration();
