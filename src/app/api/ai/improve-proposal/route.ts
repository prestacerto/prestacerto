import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { checkRateLimit, rateLimitResponse, rateLimiters } from "@/lib/rate-limit";
import { improveProposalDraft } from "@/lib/ai/certo-ai";

const bodySchema = z.object({
  draft: z.string().min(5, "Escreva um pouco antes de pedir ajuda da IA"),
  projectTitle: z.string(),
});

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitCheck = await checkRateLimit(rateLimiters.ai, user.id);
  if (!rateLimitCheck.success) {
    return rateLimitResponse(rateLimitCheck.reset);
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  try {
    const improved = await improveProposalDraft(parsed.data.draft, parsed.data.projectTitle);
    return NextResponse.json({ improved });
  } catch (error) {
    console.error("improve-proposal falhou:", error);
    return NextResponse.json(
      { error: "Não foi possível melhorar o texto agora. Sua proposta original está ok." },
      { status: 502 }
    );
  }
}
