import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// Obrigatório pra homologação (LGPD). Disparado quando o lojista pede pra
// apagar os dados da loja pelo painel da Nuvemshop.
// Payload confirmado: { store_id }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const storeId = body?.store_id ? String(body.store_id) : null;
    if (!storeId) {
      return NextResponse.json({ error: "store_id ausente" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("nuvemshop_connections")
      .delete()
      .eq("store_id", storeId);

    if (error) {
      console.error("nuvemshop store-redact falhou:", error);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("nuvemshop store-redact falhou:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
