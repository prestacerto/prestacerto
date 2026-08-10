#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

console.log("🔐 Testing Supabase Authentication\n");
console.log("📌 URL:", supabaseUrl);
console.log("📌 Anon Key:", supabaseAnonKey.substring(0, 20) + "...\n");

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

(async () => {
  try {
    console.log("🔍 Attempting to sign in...");
    console.log("   Email: finaltest@prestacerto.com.br");
    console.log("   Password: Test123456!\n");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: "finaltest@prestacerto.com.br",
      password: "Test123456!",
    });

    if (error) {
      console.error("❌ Login failed:");
      console.error("   Code:", error.code);
      console.error("   Message:", error.message);
      console.error("   Status:", error.status);
      process.exit(1);
    }

    if (!data?.user) {
      console.error("❌ No user returned from login");
      process.exit(1);
    }

    console.log("✅ Login successful!");
    console.log("\n📋 User Details:");
    console.log("   ID:", data.user.id);
    console.log("   Email:", data.user.email);
    console.log("   Created:", data.user.created_at);
    console.log("\n🎉 Authentication is working!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
