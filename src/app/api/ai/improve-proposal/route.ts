import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getUserPlan } from "@/lib/plans/features";
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

  const plan = await getUserPlan(user.id);
  const serviceClient = createServiceClient();
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  let freeUsageCount: number | null = null;

  if (plan === "free") {
    const { count, error: usageError } = await serviceClient
      .from("certo_ai_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("action", "rewrite")
      .gte("created_at", monthStart.toISOString());

    if (usageError) {
      console.error("Certo AI usage check failed:", usageError);
    } else {
      freeUsageCount = count ?? 0;
    }

    if (!usageError && (count ?? 0) >= 3) {
      return NextResponse.json(
        {
          error: "Você atingiu as 3 otimizações gratuitas deste mês.",
          upgrade: true,
          plan: "pro",
        },
        { status: 429 },
      );
    }
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  try {
    const improved = await improveProposalDraft(
      parsed.data.draft,
      parsed.data.projectTitle,
    );

    const { error: usageInsertError } = await serviceClient
      .from("certo_ai_usage")
      .insert({
        user_id: user.id,
        action: "rewrite",
        success: true,
      });

    if (usageInsertError) {
      console.error("Certo AI usage insert failed:", usageInsertError);
    }

    const remainingFree = plan === "free" && freeUsageCount !== null
      ? Math.max(0, 3 - freeUsageCount - 1)
      : null;

    return NextResponse.json({ improved, plan, remainingFree });
  } catch (error) {
    console.error("improve-proposal falhou:", error);
    return NextResponse.json(
      { error: "Não foi possível melhorar o texto agora. Sua proposta original está segura." },
      { status: 502 },
    );
  }
}
