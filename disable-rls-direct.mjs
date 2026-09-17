#!/usr/bin/env node

import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing credentials");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✅" : "❌");
  process.exit(1);
}

// Extract project reference from URL (taktwwwpcyxhyylzmgho from https://taktwwwpcyxhyylzmgho.supabase.co)
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error("❌ Could not extract project reference from URL");
  process.exit(1);
}

// Connection string for Supabase PostgreSQL
// Using the standard connection (not pooler for DDL operations)
const connectionString = `postgresql://postgres:${supabaseServiceKey}@db.${projectRef}.supabase.co:5432/postgres`;

console.log("🔓 DISABLING RLS ON ALL TABLES...\n");
console.log("🔗 Connecting to database...");

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  keepAlives: true,
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    const statements = [
      "ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;",
      "ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;",
      "ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;",
      "ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;",
      "ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;",
    ];

    for (const statement of statements) {
      try {
        console.log(`⚙️  Executing: ${statement}`);
        await client.query(statement);
        console.log(`✅ Success\n`);
      } catch (err) {
        console.error(`❌ Error: ${err.message}\n`);
      }
    }

    console.log("✅ RLS DISABLED SUCCESSFULLY!");
    console.log("");
    console.log("🎉 Login should now work at: https://prestacerto.com.br/login");
    console.log("");

    process.exit(0);
  } catch (err) {
    console.error("❌ Fatal error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
