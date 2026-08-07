import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  try {
    const { userId, partnerId } = await req.json();
    const db = createServiceClient();

    // Verificar se já existe link
    const { data: existing } = await db
      .from("affiliate_links")
      .select()
      .eq("user_id", userId)
      .eq("partner_id", partnerId)
      .single();

    if (existing) {
      return NextResponse.json({
        affiliateCode: existing.affiliate_code,
        affiliateLink: `${process.env.NEXT_PUBLIC_APP_URL}/go/${existing.affiliate_code}`,
      });
    }

    // Gerar novo link
    const affiliateCode = `aff_${userId.substring(0, 8)}_${partnerId.substring(0, 8)}_${Date.now()}`;

    const { data, error } = await db
      .from("affiliate_links")
      .insert({
        user_id: userId,
        partner_id: partnerId,
        affiliate_code: affiliateCode,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      affiliateCode: data.affiliate_code,
      affiliateLink: `${process.env.NEXT_PUBLIC_APP_URL}/go/${data.affiliate_code}`,
      trackingCode: data.utm_source,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
