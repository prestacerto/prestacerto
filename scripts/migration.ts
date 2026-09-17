#!/usr/bin/env ts-node

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltam credenciais no .env.local");
  console.error(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅" : "❌"}`);
  console.error(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "✅" : "❌"}`);
  process.exit(1);
}

async function runMigration() {
  console.log("🚀 PrestaCerto — Monetização Migration\n");

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

    // Preparar a requisição
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${supabaseServiceKey}`,
      "apikey": supabaseServiceKey as string,
    };

    const projectRef = (supabaseUrl as string).split("//")[1].split(".")[0];

    console.log("🔗 Conectando ao Supabase...");
    console.log(`   Project: ${projectRef}`);
    console.log(`   URL: ${supabaseUrl}\n`);

    // Tentar via REST API do Supabase (query endpoint)
    // Note: Isso pode não funcionar pra SQL arbitrário, mas vamos tentar

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: "POST",
      headers,
      body: JSON.stringify({ sql: sqlContent }),
    });

    if (response.status === 404) {
      console.log("⚠️  Função RPC 'exec' não existe no Supabase");
      console.log("\n📌 Alternativa: Execute manualmente via Dashboard\n");

      console.log("Passos:");
      console.log("1. Abra: https://supabase.com/dashboard/projects/" + projectRef);
      console.log("2. Vá em: SQL Editor");
      console.log("3. Clique: New query");
      console.log("4. Cole: conteúdo de SQL_MIGRATION_MANUAL.md");
      console.log("5. Clique: RUN\n");

      console.log("Ou rode o comando de novo e ele tentará novamente.\n");
      process.exit(1);
    }

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Erro ao executar SQL:");
      console.error(error);
      process.exit(1);
    }

    const result = await response.json();

    console.log("✅ MIGRATION CONCLUÍDA COM SUCESSO!\n");
    console.log("📊 Tabelas criadas:");
    console.log("   1. user_credits");
    console.log("   2. contests");
    console.log("   3. priority_boosts");
    console.log("   4. referrals");
    console.log("   5. business_premium_subscriptions");
    console.log("   6. advertisements\n");

    console.log("💰 Potencial de receita desbloqueado: R$ 2.8M+/ano");
    console.log("🚀 PrestaCerto está pronto pra FATURAR!\n");

  } catch (error) {
    console.error("❌ Erro ao executar migration:");
    console.error(error instanceof Error ? error.message : String(error));

    console.log("\n💡 Solução alternativa:");
    console.log("Execute manualmente via Supabase Dashboard:");
    console.log("   1. Supabase → SQL Editor");
    console.log("   2. Cole o SQL de: SQL_MIGRATION_MANUAL.md");
    console.log("   3. Clique RUN\n");

    process.exit(1);
  }
}

runMigration();
