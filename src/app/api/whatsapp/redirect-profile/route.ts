/**
 * POST /api/whatsapp/redirect-profile
 *
 * Endpoint seguro que valida se cliente foi recomendado esse freelancer
 * NUNCA expõe contato pessoal. Apenas redireciona pro perfil público.
 *
 * Query: ?conversation_id=xxx&freelancer_id=yyy
 * Response: redirect ou 404 se não foi recomendado
 */

import { NextRequest, NextResponse } from "next/server";
import { validateFreelancerAccess } from "@/lib/whatsapp/secure-conversations";

export async function GET(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get("conversation_id");
    const freelancerId = req.nextUrl.searchParams.get("freelancer_id");

    if (!conversationId || !freelancerId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Validar que este cliente foi recomendado esse freelancer
    const hasAccess = await validateFreelancerAccess(conversationId, freelancerId);

    if (!hasAccess) {
      console.warn(
        `[SECURITY] Attempted unauthorized access: convo=${conversationId}, freelancer=${freelancerId}`
      );
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Redirecionar pro perfil público. Usa /profile/[id] (funciona pra
    // qualquer freelancer) em vez de /@slug (só existe pra quem configurou
    // portfólio premium — nem todo freelancer tem um).
    const domain = process.env.NEXT_PUBLIC_SITE_URL ?? "https://prestacerto.com.br";
    const profileUrl = `${domain}/profile/${freelancerId}`;

    return NextResponse.redirect(profileUrl, { status: 302 });
  } catch (error) {
    console.error("[REDIRECT ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
