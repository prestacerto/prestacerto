import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getNuvemshopAuthorizeUrl } from "@/lib/integrations/nuvemshop";

// NOTA: a documentação da Nuvemshop descreve uma implementação OAuth2
// "restrita" (só Authorization Code). Não confirmamos se a URL de
// autorização aceita um parâmetro `state` pra proteção CSRF — verificar
// antes de ir pra produção. A URL de redirect pós-autorização é
// configurada estaticamente no painel de parceiro, não passada aqui.
export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://prestacerto.com.br").replace(/\/$/, "");
    const loginUrl = new URL("/login", siteUrl);
    loginUrl.searchParams.set("redirect", "/dashboard/integrations");
    return NextResponse.redirect(loginUrl);
  }

  const state = randomBytes(32).toString("hex");
  const authorizeUrl = new URL(getNuvemshopAuthorizeUrl());
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("nuvemshop_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });
  return response;
}
