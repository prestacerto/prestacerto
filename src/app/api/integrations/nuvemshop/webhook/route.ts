import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// Webhook obrigatório pra homologação na App Store da Nuvemshop.
// Payload confirmado contra a documentação oficial: { store_id: number }
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
      console.error("nuvemshop uninstall cleanup falhou:", error);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("nuvemshop webhook falhou:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
