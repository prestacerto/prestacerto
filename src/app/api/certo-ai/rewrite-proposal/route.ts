import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { userId, proposalText, category, budget } = await req.json();
    const db = createServiceClient();

    // Validar usuário (verificar se tem subscription ativa ou créditos)
    const { data: profile } = await db
      .from("profiles")
      .select("plan, subscription_status")
      .eq("id", userId)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verificar se é premium ou tem créditos
    const isPremium =
      profile.plan === "pro" || profile.subscription_status === "active";

    if (!isPremium) {
      return NextResponse.json(
        { error: "Premium feature - upgrade to use Certo AI", locked: true },
        { status: 403 }
      );
    }

    // Chamar OpenAI pra reescrever
    const systemPrompt = `Você é Certo AI, especialista em propostas vencedoras para freelancers no Brasil.
Sua missão é reescrever propostas para ser mais persuasiva e profissional.

Regras:
- Mantenha a ideia principal
- Aumente profissionalismo
- Destaque experiência relevante
- Seja conciso (200-300 palavras)
- Tom: confiante mas não arrogante
- Mencione se relevante: prazos, metodologia, suporte pós-projeto
${category ? `- Categoria: ${category}` : ""}
${budget ? `- Orçamento esperado: R$ ${budget}` : ""}

Responda APENAS com a proposta reescrita, sem explicações.`;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Reescreva esta proposta:\n\n${proposalText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI Error:", error);
      return NextResponse.json(
        { error: "Failed to rewrite proposal" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as any;
    const rewrittenText =
      data.choices?.[0]?.message?.content || proposalText;

    // Salvar histórico (opcional)
    await db.from("proposal_rewrites").insert({
      user_id: userId,
      original_text: proposalText,
      rewritten_text: rewrittenText,
      category,
      tokens_used: data.usage?.total_tokens || 0,
      created_at: new Date(),
    });

    // Decrementar crédito se pagar por uso
    // (implementar depois se necessário)

    return NextResponse.json({
      success: true,
      rewrittenText,
      tokensUsed: data.usage?.total_tokens,
    });
  } catch (error) {
    console.error("Certo AI Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
