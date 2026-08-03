import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { exchangeCodeForToken } from "@/lib/payments/mercadopago";
import { encryptSecret } from "@/lib/crypto/token-cipher";

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const errorRedirect = (message: string) =>
    NextResponse.redirect(`${siteUrl}/dashboard?mpError=${encodeURIComponent(message)}`);

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !state) {
    return errorRedirect("Autorização do Mercado Pago incompleta.");
  }

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("mp_oauth_state")?.value;
  cookieStore.delete("mp_oauth_state");

  if (!expectedState || expectedState !== state) {
    return errorRedirect("Estado da autorização inválido. Tente conectar novamente.");
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return errorRedirect("Sua sessão expirou. Faça login e tente novamente.");
  }

  try {
    const token = await exchangeCodeForToken(code);
    const supabase = await createClient();

    const { error } = await supabase.from("mp_connections").upsert({
      freelancer_id: user.id,
      mp_user_id: String(token.user_id),
      access_token: encryptSecret(token.access_token),
      refresh_token: encryptSecret(token.refresh_token),
      public_key: token.public_key ?? null,
      expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
    });

    if (error) {
      return errorRedirect("Não foi possível salvar a conexão com o Mercado Pago.");
    }
  } catch {
    return errorRedirect("Não foi possível concluir a conexão com o Mercado Pago.");
  }

  return NextResponse.redirect(`${siteUrl}/dashboard?mpConnected=1`);
}
