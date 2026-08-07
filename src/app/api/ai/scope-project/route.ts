import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { checkRateLimit, rateLimitResponse, rateLimiters } from "@/lib/rate-limit";
import { structureProjectBrief } from "@/lib/ai/certo-ai";

const bodySchema = z.object({
  idea: z.string().min(10, "Descreva um pouco mais o que você precisa"),
  categoryHint: z.string().optional(),
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
    const suggestion = await structureProjectBrief(parsed.data.idea, parsed.data.categoryHint);
    return NextResponse.json(suggestion);
  } catch (error) {
    console.error("scope-project falhou:", error);
    return NextResponse.json(
      { error: "Não foi possível gerar o briefing agora. Tente descrever manualmente." },
      { status: 502 }
    );
  }
}
