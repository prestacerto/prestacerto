import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface MPToken {
  id: string;
  freelancer_id: string;
  access_token: string;
  refresh_token: string;
  token_expiry: string;
  created_at: string;
}

/**
 * Save or update Mercado Pago OAuth tokens
 * Keeps refresh_token safe for auto-renewal
 */
export async function saveMPTokens(
  freelancer_id: string,
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number; // seconds
  }
) {
  const token_expiry = new Date(Date.now() + tokens.expires_in * 1000);

  const { data, error } = await supabase
    .from("mercado_pago_tokens")
    .upsert(
      {
        freelancer_id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: token_expiry.toISOString(),
      },
      { onConflict: "freelancer_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to save MP tokens:", error);
    throw error;
  }

  return data as MPToken;
}

/**
 * Get valid access token, refresh if needed
 * This should be called before EVERY Mercado Pago API call
 */
export async function getValidMPAccessToken(
  freelancer_id: string
): Promise<string> {
  // 1. Get stored token
  const { data: tokenData, error: fetchError } = await supabase
    .from("mercado_pago_tokens")
    .select("*")
    .eq("freelancer_id", freelancer_id)
    .single();

  if (fetchError || !tokenData) {
    throw new Error("Mercado Pago not connected. Please reconnect.");
  }

  const token = tokenData as MPToken;
  const expiryTime = new Date(token.token_expiry).getTime();
  const now = Date.now();
  const bufferMs = 86400000; // 1 day buffer

  // 2. Check if token is still valid (with 1 day buffer)
  if (expiryTime - bufferMs > now) {
    // Token still valid
    return token.access_token;
  }

  // 3. Token expired or expiring soon - refresh it
  console.log(`🔄 Refreshing MP token for freelancer ${freelancer_id}`);

  const refreshResponse = await fetch(
    "https://api.mercadopago.com/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.MERCADO_PAGO_CLIENT_ID,
        client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      }),
    }
  );

  if (!refreshResponse.ok) {
    console.error("Failed to refresh MP token:", await refreshResponse.text());
    throw new Error("Failed to refresh payment authorization. Please reconnect.");
  }

  const newTokens = await refreshResponse.json();

  // 4. Save new tokens
  await saveMPTokens(freelancer_id, {
    access_token: newTokens.access_token,
    refresh_token: newTokens.refresh_token,
    expires_in: newTokens.expires_in,
  });

  console.log(`✅ MP token refreshed for ${freelancer_id}`);

  return newTokens.access_token;
}

/**
 * Check if freelancer is connected to Mercado Pago
 */
export async function isMPConnected(freelancer_id: string): Promise<boolean> {
  const { data } = await supabase
    .from("mercado_pago_tokens")
    .select("id")
    .eq("freelancer_id", freelancer_id)
    .single();

  return !!data;
}

/**
 * Disconnect Mercado Pago (called when user revokes)
 */
export async function disconnectMP(freelancer_id: string) {
  const { error } = await supabase
    .from("mercado_pago_tokens")
    .delete()
    .eq("freelancer_id", freelancer_id);

  if (error) {
    console.error("Failed to disconnect MP:", error);
    throw error;
  }
}
