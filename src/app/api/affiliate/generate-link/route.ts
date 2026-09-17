import { createServiceClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { readJsonObject } from "@/lib/http/request-body";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// O dono do link é SEMPRE o usuário da sessão. O userId nunca vem do corpo:
// isso permitia criar links de afiliado em nome de qualquer conta (IDOR).
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await readJsonObject(req);
    if (body.response) return body.response;

    const partnerId = body.data.partnerId;
    if (typeof partnerId !== "string" || !UUID.test(partnerId)) {
      return NextResponse.json({ error: "partnerId inválido." }, { status: 400 });
    }

    const db = createServiceClient();

    const { data: existing } = await db
      .from("affiliate_links")
      .select()
      .eq("user_id", user.id)
      .eq("partner_id", partnerId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        affiliateCode: existing.affiliate_code,
        affiliateLink: `${process.env.NEXT_PUBLIC_APP_URL}/go/${existing.affiliate_code}`,
      });
    }

    const affiliateCode = `aff_${user.id.substring(0, 8)}_${partnerId.substring(0, 8)}_${Date.now()}`;

    const { data, error } = await db
      .from("affiliate_links")
      .insert({
        user_id: user.id,
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
  } catch {
    return NextResponse.json(
      { error: "Não foi possível gerar o link de afiliado." },
      { status: 400 },
    );
  }
}
