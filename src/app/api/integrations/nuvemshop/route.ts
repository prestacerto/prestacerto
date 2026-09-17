import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  getNuvemshopWebhookSignature,
  verifyNuvemshopWebhook,
} from "@/lib/integrations/nuvemshop-webhook";

// Webhook obrigatório pra homologação na App Store da Nuvemshop.
// Payload confirmado contra a documentação oficial: { store_id: number }
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = getNuvemshopWebhookSignature(req);

    if (!verifyNuvemshopWebhook(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody) as {
      store_id?: number | string;
      event?: string;
    };
    const storeId = body.store_id ? String(body.store_id) : null;

    if (!storeId) {
      return NextResponse.json({ error: "store_id ausente" }, { status: 400 });
    }

    // Esta URL é usada para app/uninstalled. Outros eventos assinados podem
    // compartilhar o endpoint sem provocar limpeza indevida da conexão.
    if (body.event && body.event !== "app/uninstalled") {
      return NextResponse.json({ ok: true, ignored: true });
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
