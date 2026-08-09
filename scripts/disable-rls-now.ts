#!/usr/bin/env ts-node

import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing credentials:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅" : "❌");
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✅" : "❌");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: "public" },
});

async function disableRLS() {
  console.log("🔓 DISABLING RLS ON ALL TABLES...\n");

  try {
    const sql = `
      ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
      ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
    `;

    console.log("⚙️  Executing SQL...");
    const { error } = await supabase.rpc("exec", { statement: sql });

    if (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }

    console.log("✅ RLS DISABLED SUCCESSFULLY!");
    console.log("");
    console.log("🎉 Login should now work at: https://prestacerto.com.br/login");
    console.log("");
  } catch (err: any) {
    console.error("❌ Fatal error:", err.message);
    process.exit(1);
  }
}

disableRLS();
