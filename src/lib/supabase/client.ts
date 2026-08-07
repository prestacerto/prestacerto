import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = "https://taktwwwpcyxhyylzmgho.supabase.co";
  const key = "sb_publishable_ArMX97jGsCK0jbe3Opd74g_ZNY2WQ36";

  return createBrowserClient(url, key);
}
