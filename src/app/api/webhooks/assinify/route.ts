import { NextRequest, NextResponse } from "next/server";
import { validWebhookToken, assinyEventHash } from "@/lib/payments/assiny";
import { parseNativeAssinyEvent, type NativeAssinyEvent } from "@/lib/payments/assiny-native";
import { verifyCheckoutReference } from "@/lib/payments/checkout-reference";
import { createServiceClient, hasServiceCredentials } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function providedToken(request: NextRequest) {
  return (
    request.headers.get("x-assiny-token") ??
    request.headers.get("x-assinify-token") ??
    request.headers.get("x-assiny-signature") ??
    request.headers.get("x-assinify-signature") ??
    request.nextUrl.searchParams.get("secret")
  );
}

export async function GET() {
  return json({ ok: true, service: "assiny-webhook" });
}

export async function POST(request: NextRequest) {
  const secret = process.env.ASSINY_WEBHOOK_SECRET?.trim() ?? "";
  if (!secret) return json({ error: "webhook_secret_not_configured" }, 500);
  const provided = providedToken(request)?.trim() ?? null;
  if (!validWebhookToken(secret, provided)) {
    // Diagnóstico sem vazar segredo: só nomes de headers, tamanho e prefixo curto.
    console.warn("[ASSINY] auth falhou", {
      headers: [...request.headers.keys()].filter((h) => /assin|token|secret|signature/i.test(h)),
      tokenLen: provided?.length ?? 0, tokenPrefix: provided?.slice(0, 4) ?? null,
      expectedLen: secret.length, expectedPrefix: secret.slice(0, 4),
    });
    return json({ error: "unauthorized" }, 401);
  }
  if (!hasServiceCredentials()) return json({ error: "service_credentials_missing" }, 500);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // O formato real do Assiny ainda não foi observado em produção: guardar o
  // payload bruto no log é o que permite ajustar o parser após a primeira venda.
  console.info("[ASSINY] payload", JSON.stringify(payload).slice(0, 4000));

  const parsed = parseNativeAssinyEvent(payload);
  if (parsed.kind === "ignored") return json({ outcome: "ignored", event: parsed.event });
  if (parsed.kind === "invalid") {
    if (parsed.reason === "unknown_assiny_offer") {
      console.info("[ASSINY] oferta fora dos planos Pro/Business (produto avulso) — ignorada");
      return json({ outcome: "ignored", reason: parsed.reason });
    }
    console.warn("[ASSINY] evento inválido", parsed.reason);
    return json({ error: parsed.reason }, 400);
  }

  const db = createServiceClient();
  let event: NativeAssinyEvent;

  if (parsed.kind === "unresolved") {
    const { data } = await db
      .from("assiny_events")
      .select("subscription_id")
      .eq("mode", "live")
      .eq("event_id", parsed.purchaseEventId)
      .maybeSingle();
    if (!data?.subscription_id) {
      console.warn("[ASSINY] reembolso/chargeback sem compra registrada", parsed.purchaseEventId);
      return json({ outcome: "unresolved", purchaseEventId: parsed.purchaseEventId });
    }
    event = { ...parsed.event, subscriptionId: data.subscription_id };
  } else {
    event = parsed;
  }

  const { data: ingest, error: ingestError } = await db.rpc("ingest_assiny_event", {
    p_mode: "live",
    p_event_id: event.eventId,
    p_subscription_id: event.subscriptionId,
    p_event_type: event.event,
    p_email: event.email,
    p_plan: event.plan,
    p_active: event.active,
    p_occurred_at: event.occurredAt,
    p_payload_hash: assinyEventHash(event),
  });
  if (ingestError) {
    console.error("[ASSINY] ingest_assiny_event falhou", ingestError.message);
    return json({ error: "ledger_write_failed" }, 500);
  }
  const outcome = (ingest as { outcome?: string } | null)?.outcome ?? "unknown";

  // Relatório financeiro (valor e método). Tabela pode ainda não existir: não bloqueia a ativação.
  const { error: paymentError } = await db.from("assiny_payments").insert({
    mode: "live", event_id: event.eventId, subscription_id: event.subscriptionId, event_type: event.event,
    plan: event.plan, offer_id: event.offerId, amount_cents: event.amountCents, payment_method: event.paymentMethod,
    customer_email: event.email, occurred_at: event.occurredAt,
  });
  if (paymentError && !/duplicate|23505/.test(paymentError.message + (paymentError.code ?? ""))) {
    console.warn("[ASSINY] assiny_payments indisponível:", paymentError.message);
  }

  let binding: string = "not_attempted";
  if (event.checkoutReference && ["applied", "pending_binding", "duplicate"].includes(outcome)) {
    const userId = verifyCheckoutReference(event.checkoutReference, event.plan, secret, event.occurredAt);
    if (!userId) {
      binding = "invalid_reference";
    } else {
      const { error: bindError } = await db.rpc("bind_verified_assiny_subscription", {
        p_subscription_id: event.subscriptionId,
        p_user_id: userId,
        p_verification_reference: event.checkoutReference,
        p_verified_by: "webhook:checkout-reference",
      });
      binding = bindError ? `bind_failed:${bindError.message}` : "bound";
      if (bindError) console.error("[ASSINY] bind_verified_assiny_subscription falhou", bindError.message);
    }
  }

  console.info("[ASSINY] processado", { event: event.event, plan: event.plan, active: event.active, outcome, binding });
  return json({ outcome, binding, eventId: event.eventId });
}
