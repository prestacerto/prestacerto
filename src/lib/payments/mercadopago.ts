// Integração com o Mercado Pago no modelo de split payment (marketplace) com
// RETENÇÃO: o pagamento fica reservado (capturado manualmente) até o cliente
// confirmar que o serviço foi entregue — só então o valor é liberado pra
// conta do freelancer. A PrestaCerto nunca chega a receber ou guardar o
// dinheiro em nenhum momento; quem retém é o próprio Mercado Pago, sob
// autorização, entre a criação da order e a captura.
//
// ATENÇÃO — verificar antes de aceitar cartão de verdade em produção:
// os nomes de campo abaixo (`capture_mode`, o payload de /v1/orders) vêm da
// documentação pública do Mercado Pago (checkout-api-v2 / orders), mas NÃO
// foram testados contra o sandbox deles. Antes de ligar isso pra usuário
// real, rode uma transação de teste com cartão de teste e confirme que o
// status retornado é "action_required" / "waiting_capture" (retido) e não
// "approved" direto (o que significaria que a retenção não pegou).
//
// Docs usadas como referência (ago/2026):
// - OAuth:            https://www.mercadopago.com.br/developers/en/docs/security/oauth/creation
// - Split 1:1:        https://www.mercadopago.com.br/developers/en/docs/split-payments/split-1-1/integration-configuration/integrate-marketplace
// - Orders (captura):  https://www.mercadopago.com.br/developers/pt/docs/checkout-api-v2/payment-management/reserve-capture-cancel
// - Card Brick:        https://www.mercadopago.com.br/developers/pt/docs/checkout-api-orders/payment-integration/cards
// - Webhooks:          https://www.mercadopago.com.br/developers/en/docs/checkout-pro/payment-notifications

const MP_AUTH_URL = "https://auth.mercadopago.com/authorization";
const MP_API_URL = "https://api.mercadopago.com";

// Limite documentado do Mercado Pago pra captura manual — depois disso a
// reserva expira sozinha e o dinheiro volta pro cliente.
export const CAPTURE_WINDOW_DAYS = 5;

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

export async function refreshSellerToken(refreshToken: string): Promise<MpTokenResponse> {
  const res = await fetch(`${MP_API_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: requireEnv("MERCADOPAGO_CLIENT_ID"),
      client_secret: requireEnv("MERCADOPAGO_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Falha ao renovar token do freelancer no Mercado Pago (${res.status}).`);
  }
  return res.json();
}

// Access token da própria aplicação PrestaCerto (client_credentials) — usado
// só pra consultar orders no webhook, nunca pra criar ou capturar cobrança
// (isso exige o token do freelancer, dono da conta que recebe o dinheiro).
let appTokenCache: { token: string; expiresAt: number } | null = null;

export async function getAppAccessToken(): Promise<string> {
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

// Dados que o Card Payment Brick devolve no navegador após tokenizar o
// cartão — nunca vemos o número do cartão, só esse token de uso único.
export type CardPaymentSubmission = {
  token: string;
  payment_method_id: string;
  issuer_id?: string;
  installments: number;
};

export type MpOrder = {
  id: string;
  status: string; // ex.: "action_required" (retido), "processed" (capturado), "cancelled"
  status_detail?: string; // ex.: "waiting_capture"
  external_reference?: string | null;
};

export async function createHeldOrder(params: {
  sellerAccessToken: string;
  amount: number;
  externalReference: string;
  payerEmail: string;
  card: CardPaymentSubmission;
}): Promise<MpOrder> {
  const res = await fetch(`${MP_API_URL}/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.sellerAccessToken}`,
      "X-Idempotency-Key": params.externalReference,
    },
    body: JSON.stringify({
      type: "online",
      capture_mode: "manual",
      total_amount: params.amount.toFixed(2),
      external_reference: params.externalReference,
      payer: { email: params.payerEmail },
      transactions: {
        payments: [
          {
            amount: params.amount.toFixed(2),
            payment_method: {
              id: params.card.payment_method_id,
              type: "credit_card",
              token: params.card.token,
              installments: params.card.installments,
              ...(params.card.issuer_id ? { issuer_id: params.card.issuer_id } : {}),
            },
          },
        ],
      },
      // Sem comissão: PrestaCerto não cobra marketplace_fee.
      marketplace_fee: "0.00",
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const statusDetail =
      body?.status_detail ?? body?.transactions?.payments?.[0]?.status_detail;
    throw new MercadoPagoOrderError(
      `Falha ao criar cobrança retida no Mercado Pago (${res.status}): ${JSON.stringify(body)}`,
      statusDetail
    );
  }
  return body as MpOrder;
}

export class MercadoPagoOrderError extends Error {
  statusDetail?: string;
  constructor(message: string, statusDetail?: string) {
    super(message);
    this.name = "MercadoPagoOrderError";
    this.statusDetail = statusDetail;
  }
}

// Mapeia status_detail do Mercado Pago pra mensagem acionável em português.
// Referência: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/response-handling/collection-results
const DECLINE_MESSAGES: Record<string, string> = {
  cc_rejected_insufficient_amount: "Cartão recusado: saldo insuficiente.",
  cc_rejected_bad_filled_security_code: "Cartão recusado: CVV incorreto.",
  cc_rejected_bad_filled_date: "Cartão recusado: data de validade incorreta.",
  cc_rejected_bad_filled_card_number: "Cartão recusado: número do cartão incorreto.",
  cc_rejected_bad_filled_other: "Cartão recusado: confira os dados digitados.",
  cc_rejected_call_for_authorize:
    "Cartão recusado pelo banco — ligue pra autorizar essa compra ou tente outro cartão.",
  cc_rejected_card_disabled: "Cartão desativado — contate seu banco ou tente outro cartão.",
  cc_rejected_duplicated_payment: "Já existe uma cobrança igual em andamento pra esse projeto.",
  cc_rejected_high_risk: "Pagamento recusado por segurança. Tente outro método ou cartão.",
  cc_rejected_max_attempts: "Muitas tentativas com esse cartão. Tente outro cartão ou mais tarde.",
  cc_rejected_other_reason: "Cartão recusado pelo banco emissor. Tente outro cartão.",
};

export function getFriendlyDeclineMessage(statusDetail?: string): string {
  if (!statusDetail) {
    return "Não foi possível processar o pagamento. Tente outro método.";
  }
  return (
    DECLINE_MESSAGES[statusDetail] ??
    "Pagamento recusado pelo banco. Tente outro cartão ou método."
  );
}

// Libera pro freelancer um pagamento retido. Usa o token do PRÓPRIO
// freelancer (o mesmo que criou a order) — é a conta dele que recebe.
export async function captureOrder(orderId: string, sellerAccessToken: string): Promise<MpOrder> {
  const res = await fetch(`${MP_API_URL}/v1/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${sellerAccessToken}` },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      `Falha ao capturar order ${orderId} no Mercado Pago (${res.status}): ${JSON.stringify(body)}`
    );
  }
  return body as MpOrder;
}

export async function getOrderById(orderId: string): Promise<MpOrder> {
  const token = await getAppAccessToken();
  const res = await fetch(`${MP_API_URL}/v1/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Falha ao buscar order ${orderId} no Mercado Pago (${res.status}).`);
  }
  return res.json();
}
