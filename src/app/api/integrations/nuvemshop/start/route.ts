import { NextResponse } from "next/server";
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
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login?redirect=/dashboard/integrations`
    );
  }

  return NextResponse.redirect(getNuvemshopAuthorizeUrl());
}
