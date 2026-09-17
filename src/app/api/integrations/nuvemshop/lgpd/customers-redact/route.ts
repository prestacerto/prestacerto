import { NextRequest, NextResponse } from "next/server";

// Obrigatório pra homologação (LGPD). Disparado quando um cliente da loja
// pede apagamento de dados. O PrestaCerto nunca acessa/armazena dado de
// cliente final da loja (só dados do próprio lojista que instalou o app) —
// por isso é um no-op: confirmamos recebimento, não há o que apagar aqui.
// Payload confirmado: { store_id, customer, orders_to_redact }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(
      `[LGPD] customers/redact recebido — store_id=${body?.store_id}, customer=${body?.customer?.id ?? "?"} (sem dado armazenado no PrestaCerto)`
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("nuvemshop customers-redact falhou:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
