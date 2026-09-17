import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AiAccessError, type AiAllowance } from "@/lib/ai/quota";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { checkRateLimit, rateLimitResponse, rateLimiters } from "@/lib/rate-limit";
import { improveProposalDraft } from "@/lib/ai/certo-ai";

const bodySchema = z.object({
  draft: z
    .string()
    .trim()
    .min(10, "Escreva uma proposta um pouco mais completa")
    .max(5000, "Sua proposta ficou muito longa para otimizar de uma vez"),
  projectTitle: z
    .string()
    .trim()
    .min(1, "O projeto precisa ter um título")
    .max(160, "O título do projeto é muito longo"),
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
    let allowance: AiAllowance | undefined;
    const improved = await improveProposalDraft(
      parsed.data.draft,
      parsed.data.projectTitle,
      { userId: user.id, accountId: user.id, onAllowance: (value) => { allowance = value; }, metadata: { route: "/api/ai/improve-proposal" } },
    );

    return NextResponse.json({ improved, plan: allowance?.plan, remainingFree: allowance?.remainingFree });
  } catch (error) {
    if (error instanceof AiAccessError) return NextResponse.json({ error: error.message, upgrade: error.upgrade, plan: error.upgrade ? "pro" : undefined }, { status: error.status });
    console.error("improve-proposal falhou:", error);
    return NextResponse.json(
      { error: "Não foi possível melhorar o texto agora. Sua proposta original está segura." },
      { status: 502 },
    );
  }
}
