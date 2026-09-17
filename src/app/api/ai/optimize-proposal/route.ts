import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { improveProposalDraft } from "@/lib/ai/certo-ai";
import { AiAccessError, type AiAllowance } from "@/lib/ai/quota";
import { checkRateLimit, rateLimitResponse, rateLimiters } from "@/lib/rate-limit";

const schema = z.object({
  action: z.enum(["optimize", "compare", "tips"]),
  proposal: z.string().trim().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Entre na sua conta para usar o Certo AI." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Informe uma proposta entre 10 e 5.000 caracteres." }, { status: 400 });
  if (parsed.data.action !== "optimize") {
    return NextResponse.json({ error: "Este recurso está em preparação. A reescrita de propostas é o recurso disponível nesta versão." }, { status: 503 });
  }
  const limit = await checkRateLimit(rateLimiters.ai, user.id);
  if (!limit.success) return rateLimitResponse(limit.reset);
  try {
    let allowance: AiAllowance | undefined;
    const optimized = await improveProposalDraft(parsed.data.proposal, "projeto do cliente", {
      userId: user.id,
      accountId: user.id,
      onAllowance: (value) => { allowance = value; },
      metadata: { route: "/api/ai/optimize-proposal" },
    });
    return NextResponse.json({
      success: true,
      action: "optimize",
      result: { optimized, issues: [], suggestions: [] },
      usage: { plan_type: allowance?.plan, optimizations_remaining: allowance?.remainingFree },
    });
  } catch (error) {
    if (error instanceof AiAccessError) {
      return NextResponse.json({ error: error.message, upgrade: error.upgrade }, { status: error.status });
    }
    return NextResponse.json({ error: "Não foi possível melhorar o texto agora. Sua proposta original está segura." }, { status: 502 });
  }
}
