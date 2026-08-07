import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://taktwwwpcyxhyylzmgho.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_ArMX97jGsCK0jbe3Opd74g_ZNY2WQ36";

  return createBrowserClient(url, key);
}
