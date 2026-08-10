#!/usr/bin/env node
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔍 Testing RLS status via REST API...\n");

const response = await fetch(`${url}/rest/v1/profiles?limit=1`, {
  headers: { apikey: key }
});

console.log("Status:", response.status);
console.log("RLS is", response.status === 401 ? "ACTIVE ❌" : "DISABLED ✅ or ACCESSIBLE");
