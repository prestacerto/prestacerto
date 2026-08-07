import { NextRequest, NextResponse } from "next/server";

// Obrigatório pra homologação (LGPD). Disparado quando um cliente da loja
// pede uma cópia dos dados armazenados. Mesma lógica do customers/redact:
// o PrestaCerto não armazena dado de cliente final da loja, só do lojista
// que instalou o app — nada a reportar aqui.
// Payload confirmado: { store_id, customer, orders_requested,
// checkouts_requested, drafts_orders_requested, data_request: { id } }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(
      `[LGPD] customers/data_request recebido — store_id=${body?.store_id}, request_id=${body?.data_request?.id ?? "?"} (sem dado armazenado no PrestaCerto)`
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("nuvemshop customers-data-request falhou:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
