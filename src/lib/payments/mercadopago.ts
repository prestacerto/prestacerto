// Integração com o Mercado Pago no modelo de split payment (marketplace).
// O dinheiro vai direto pra conta MP do freelancer — a PrestaCerto nunca
// recebe nem retém o valor, só acompanha o status via webhook.
//
// Docs usadas como referência (jul/2026):
// - OAuth:      https://www.mercadopago.com.br/developers/en/docs/security/oauth/creation
// - Split 1:1:  https://www.mercadopago.com.br/developers/en/docs/split-payments/split-1-1/integration-configuration/integrate-marketplace
// - Webhooks:   https://www.mercadopago.com.br/developers/en/docs/checkout-pro/payment-notifications

const MP_AUTH_URL = "https://auth.mercadopago.com/authorization";
const MP_API_URL = "https://api.mercadopago.com";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ${name} não configurada.`);
  return value;
}

export function getMpAuthorizationUrl(state: string) {
  const clientId = requireEnv("MERCADOPAGO_CLIENT_ID");
  const redirectUri = `${requireEnv("NEXT_PUBLIC_SITE_URL")}/api/mercadopago/oauth/callback`;

  const url = new URL(MP_AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("platform_id", "mp");
  url.searchParams.set("state", state);
  url.searchParams.set("redirect_uri", redirectUri);
  return url.toString();
}

type MpTokenResponse = {
  access_token: string;
  refresh_token: string;
  user_id: number;
  public_key?: string;
  expires_in: number;
};

export async function exchangeCodeForToken(code: string): Promise<MpTokenResponse> {
  const redirectUri = `${requireEnv("NEXT_PUBLIC_SITE_URL")}/api/mercadopago/oauth/callback`;

  const res = await fetch(`${MP_API_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: requireEnv("MERCADOPAGO_CLIENT_ID"),
      client_secret: requireEnv("MERCADOPAGO_CLIENT_SECRET"),
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao trocar code por access_token do Mercado Pago (${res.status}).`);
  }
  return res.json();
}

// Access token da própria aplicação PrestaCerto (client_credentials) — usado
// só pra consultar pagamentos no webhook, nunca pra criar cobrança.
let appTokenCache: { token: string; expiresAt: number } | null = null;

async function getAppAccessToken(): Promise<string> {
  if (appTokenCache && appTokenCache.expiresAt > Date.now()) {
    return appTokenCache.token;
  }

  const res = await fetch(`${MP_API_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: requireEnv("MERCADOPAGO_CLIENT_ID"),
      client_secret: requireEnv("MERCADOPAGO_CLIENT_SECRET"),
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao obter access_token da aplicação (${res.status}).`);
  }
  const data: MpTokenResponse = await res.json();
  appTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60_000,
  };
  return data.access_token;
}

export async function createSplitPreference(params: {
  sellerAccessToken: string;
  title: string;
  amount: number;
  externalReference: string;
}) {
  const siteUrl = requireEnv("NEXT_PUBLIC_SITE_URL");

  const res = await fetch(`${MP_API_URL}/checkout/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.sellerAccessToken}`,
    },
    body: JSON.stringify({
      items: [
        {
          id: params.externalReference,
          title: params.title,
          currency_id: "BRL",
          quantity: 1,
          unit_price: params.amount,
        },
      ],
      // Sem comissão: PrestaCerto não cobra marketplace_fee.
      marketplace_fee: 0,
      external_reference: params.externalReference,
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      back_urls: {
        success: `${siteUrl}/dashboard/projects`,
        pending: `${siteUrl}/dashboard/projects`,
        failure: `${siteUrl}/dashboard/projects`,
      },
      auto_return: "approved",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Falha ao criar preference no Mercado Pago (${res.status}): ${body}`);
  }

  return res.json() as Promise<{ id: string; init_point: string }>;
}

export type MpPayment = {
  id: number;
  status: "pending" | "approved" | "rejected" | "in_process" | "cancelled" | "refunded";
  external_reference: string | null;
};

export async function getPaymentById(paymentId: string): Promise<MpPayment> {
  const token = await getAppAccessToken();
  const res = await fetch(`${MP_API_URL}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar pagamento ${paymentId} no Mercado Pago (${res.status}).`);
  }
  return res.json();
}
