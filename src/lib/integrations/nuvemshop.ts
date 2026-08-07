// Integração com o app parceiro da Nuvemshop.
// Fluxo OAuth confirmado contra a documentação oficial (dev.tiendanube.com):
// autorização em /apps/{app_id}/authorize, troca de código em
// /apps/authorize/token (POST, corpo JSON). O token da Nuvemshop NÃO expira
// sozinho — só é revogado quando o lojista desinstala o app — por isso não
// existe refresh_token aqui.

const NUVEMSHOP_BASE_URL = "https://www.nuvemshop.com.br";

export function getNuvemshopAuthorizeUrl(): string {
  const appId = process.env.NUVEMSHOP_APP_ID;
  if (!appId) throw new Error("NUVEMSHOP_APP_ID não configurado");
  return `${NUVEMSHOP_BASE_URL}/apps/${appId}/authorize`;
}

interface NuvemshopTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  user_id: number; // ID da loja
}

export async function exchangeNuvemshopCode(code: string): Promise<NuvemshopTokenResponse> {
  const clientId = process.env.NUVEMSHOP_CLIENT_ID;
  const clientSecret = process.env.NUVEMSHOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("NUVEMSHOP_CLIENT_ID/NUVEMSHOP_CLIENT_SECRET não configurados");
  }

  const res = await fetch(`${NUVEMSHOP_BASE_URL}/apps/authorize/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Falha ao trocar código Nuvemshop por token (${res.status}): ${body}`);
  }

  return res.json();
}

export async function getNuvemshopStoreInfo(
  storeId: string,
  accessToken: string
): Promise<{ name: string | null }> {
  try {
    const res = await fetch(`https://api.nuvemshop.com.br/2025-03/${storeId}/store`, {
      headers: {
        Authentication: `bearer ${accessToken}`,
        "User-Agent": "PrestaCerto (contato@prestacerto.com.br)",
      },
    });
    if (!res.ok) return { name: null };
    const data = await res.json();
    const name = data?.name?.pt ?? data?.name?.es ?? data?.name?.en ?? null;
    return { name };
  } catch (error) {
    console.error("Nuvemshop store info falhou:", error);
    return { name: null };
  }
}
