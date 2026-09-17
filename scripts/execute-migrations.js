#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Variáveis de ambiente não configuradas!");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function executeMigrations() {
  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  const migrations = [
    "0029_connects_proposal_limits.sql",
    "0030_priority_queue.sql",
  ];

  console.log("🚀 Executando migrations...\n");

  for (const migrationFile of migrations) {
    const filePath = path.join(migrationsDir, migrationFile);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Arquivo não encontrado: ${migrationFile}`);
      continue;
    }

    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`📝 Executando: ${migrationFile}`);

    try {
      // Split por ; pra executar statements individuais
      const statements = sql
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

      for (const statement of statements) {
        const { error } = await supabase.rpc("exec", {
          statement: statement + ";",
        }).catch(() => {
          // Se rpc exec não existe, tentar via raw query
          return supabase.query(statement + ";");
        });

        if (error) {
          console.warn(`  ⚠️  ${error.message}`);
        }
      }

      console.log(`✅ ${migrationFile} concluído\n`);
    } catch (error) {
      console.error(`❌ Erro ao executar ${migrationFile}:`, error.message);
    }
  }

  console.log("✨ Todas as migrations foram processadas!");
}

executeMigrations();
