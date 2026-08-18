import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { checkRateLimit, rateLimitResponse, rateLimiters } from "@/lib/rate-limit";
import { improveProposalDraft } from "@/lib/ai/certo-ai";

const bodySchema = z.object({
  proposalText: z
    .string()
    .trim()
    .min(10, "Escreva uma proposta um pouco mais completa")
    .max(5000, "Sua proposta ficou muito longa para otimizar de uma vez"),
  category: z.string().trim().max(100).optional(),
  budget: z.number().finite().positive().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json(
      { error: "Entre na sua conta para usar o Certo AI." },
      { status: 401 },
    );
  }

  const rateLimitCheck = await checkRateLimit(rateLimiters.ai, user.id);
  if (!rateLimitCheck.success) {
    return rateLimitResponse(rateLimitCheck.reset);
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  try {
    const rewrittenText = await improveProposalDraft(
      parsed.data.proposalText,
      parsed.data.category || "projeto do cliente",
    );

    return NextResponse.json({ success: true, rewrittenText });
  } catch (error) {
    console.error("Certo AI rewrite falhou:", error);
    return NextResponse.json(
      { error: "Não foi possível melhorar a proposta agora." },
      { status: 502 },
    );
  }
}
