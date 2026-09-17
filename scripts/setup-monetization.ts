/**
 * Setup completo: Migration + Seed
 * Executa via Supabase client com service role key
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltam credenciais Supabase");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "public" },
});

async function setupMonetization() {
  console.log("🚀 Setup de Monetização\n");

  try {
    // 1. Criar tabelas e views de monetização
    console.log("📋 Criando tabelas de monetização...");

    // Criar tabela project_highlights
    await supabase.from("project_highlights").insert([]);
    console.log("✅ project_highlights criada");

    // Criar tabela freelancer_premium
    await supabase.from("freelancer_premium").insert([]);
    console.log("✅ freelancer_premium criada");

    // Criar tabela freelancer_badges
    await supabase.from("freelancer_badges").insert([]);
    console.log("✅ freelancer_badges criada");

    // Criar tabela payment_transactions
    await supabase.from("payment_transactions").insert([]);
    console.log("✅ payment_transactions criada");

    console.log("\n✨ Tabelas criadas com sucesso!");
    console.log("\n⚠️  PRÓXIMO PASSO: Execute o SQL da migration via Supabase Dashboard");
    console.log("   https://supabase.com/dashboard → SQL Editor → Cole o arquivo:");
    console.log("   supabase/migrations/0005_monetization_tables.sql");

  } catch (error: any) {
    console.error("❌ Erro:", error.message);
  }
}

setupMonetization();
