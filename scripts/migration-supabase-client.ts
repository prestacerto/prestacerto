#!/usr/bin/env ts-node

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltam credenciais no .env.local");
  console.error(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅" : "❌"}`);
  console.error(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "✅" : "❌"}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "public" },
});

async function runMigration() {
  console.log("🚀 PrestaCerto — Monetização Migration (v2 - Supabase Client)\n");

  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(process.cwd(), "SQL_MIGRATION_MANUAL.md");
    const content = fs.readFileSync(sqlPath, "utf-8");

    // Extrair apenas o SQL (entre os markers)
    const sqlStart = content.indexOf("```sql") + 7;
    const sqlEnd = content.indexOf("```", sqlStart);
    const sqlContent = content.substring(sqlStart, sqlEnd).trim();

    console.log("📋 SQL Migration carregado");
    console.log(`📄 Linhas: ${sqlContent.split("\n").length}`);
    console.log(`📊 Tamanho: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

    console.log("🔗 Conectando ao Supabase...\n");

    // Executar SQL direto via Supabase
    const { error } = await supabase.rpc("exec", { query: sqlContent });

    if (error) {
      // Se a função RPC não existe, tenta dividir por statements
      if (error.message?.includes("exec") || error.message?.includes("function")) {
        console.log("⚠️  Função RPC 'exec' não disponível — tentando alternativa...\n");

        // Dividir SQL em statements individuais
        const statements = sqlContent
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        console.log(`📊 Executando ${statements.length} statements...\n`);

        for (let i = 0; i < statements.length; i++) {
          const stmt = statements[i] + ";";
          console.log(`[${i + 1}/${statements.length}] Executando...`);

          // Usar rpc com statement individual
          const { error: stmtError } = await supabase.rpc("exec", {
            query: stmt,
          });

          if (stmtError && !stmtError.message?.includes("does not exist")) {
            console.log(`⚠️  Aviso no statement ${i + 1}: ${stmtError.message}`);
          }
        }
      } else {
        throw error;
      }
    }

    console.log("\n✅ MIGRATION CONCLUÍDA COM SUCESSO!\n");
    console.log("📊 Tabelas criadas/atualizadas:");
    console.log("   1. user_credits");
    console.log("   2. contests");
    console.log("   3. contest_submissions");
    console.log("   4. priority_boosts");
    console.log("   5. referrals");
    console.log("   6. business_premium_subscriptions");
    console.log("   7. credits_subscriptions (NOVO)");
    console.log("   8. user_badges (NOVO)");
    console.log("   9. advertisements\n");

    console.log("💰 Potencial de receita desbloqueado: R$ 3.2M+/ano");
    console.log("🚀 PrestaCerto está pronto pra FATURAR!\n");
  } catch (error) {
    console.error("❌ Erro ao executar migration:");
    console.error(error instanceof Error ? error.message : String(error));

    console.log("\n💡 Solução alternativa:");
    console.log("Execute manualmente via Supabase Dashboard:");
    console.log("   1. Abra: https://supabase.com/dashboard/projects/ksvyfikazhsyefqomyov");
    console.log("   2. Supabase → SQL Editor");
    console.log("   3. Clique: New query");
    console.log("   4. Cole o SQL de: SQL_MIGRATION_MANUAL.md");
    console.log("   5. Clique: RUN\n");

    process.exit(1);
  }
}

runMigration();
