import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { exchangeNuvemshopCode, getNuvemshopStoreInfo } from "@/lib/integrations/nuvemshop";
import { encryptSecret } from "@/lib/crypto/token-cipher";

export async function GET(request: NextRequest) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://prestacerto.com.br").replace(/\/$/, "");
  const errorRedirect = (message: string) => {
    const redirectUrl = new URL("/dashboard", siteUrl);
    redirectUrl.searchParams.set("nuvemshopError", message);
    return NextResponse.redirect(redirectUrl);
  };

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("nuvemshop_oauth_state")?.value;
  if (!code || !state || !expectedState) {
    return errorRedirect("Autorização da Nuvemshop incompleta.");
  }

  const stateMatches =
    state.length === expectedState.length &&
    timingSafeEqual(Buffer.from(state), Buffer.from(expectedState));
  if (!stateMatches) {
    return errorRedirect("A sessão de autorização da Nuvemshop expirou. Tente novamente.");
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return errorRedirect("Sua sessão expirou. Faça login e tente novamente.");
  }

  try {
    const token = await exchangeNuvemshopCode(code);
    const storeId = String(token.user_id);
    const { name } = await getNuvemshopStoreInfo(storeId, token.access_token);

    const supabase = await createClient();
    const { error } = await supabase.from("nuvemshop_connections").upsert(
      {
        user_id: user.id,
        store_id: storeId,
        store_name: name,
        access_token: encryptSecret(token.access_token),
        scope: token.scope,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "store_id" }
    );

    if (error) {
      console.error("nuvemshop connections upsert falhou:", error);
      return errorRedirect("Não foi possível salvar a conexão com a Nuvemshop.");
    }
  } catch (err) {
    console.error("nuvemshop oauth callback falhou:", err);
    return errorRedirect("Não foi possível concluir a conexão com a Nuvemshop.");
  }

  const response = NextResponse.redirect(`${siteUrl}/dashboard?nuvemshopConnected=1`);
  response.cookies.delete("nuvemshop_oauth_state");
  return response;
}
