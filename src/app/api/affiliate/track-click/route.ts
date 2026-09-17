import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { affiliateCode } = await req.json();
    const db = createServiceClient();

    // Registrar clique
    await db.rpc("record_affiliate_click", { code: affiliateCode });

    // Buscar partner info
    const { data: link } = await db
      .from("affiliate_links")
      .select("id, user_id, partner_id, partners(website_url)")
      .eq("affiliate_code", affiliateCode)
      .single();

    if (!link) {
      return NextResponse.json(
        { error: "Invalid affiliate code" },
        { status: 400 }
      );
    }

    // Registrar transação
    await db.from("affiliate_transactions").insert({
      affiliate_link_id: link.id,
      user_id: link.user_id,
      partner_id: link.partner_id,
      transaction_type: "click",
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      redirectUrl: (link.partners as any)?.[0]?.website_url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
