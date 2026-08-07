import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface ScopeAnalysis {
  category: string;
  budget_min?: number;
  budget_max?: number;
  deadline_days?: number;
  skills: string[];
  summary: string;
  urgency: "low" | "medium" | "high";
  confidence: number;
}

/**
 * Analisar mensagem do cliente via IA
 * Extrai: categoria, orçamento, prazo, habilidades necessárias
 */
export async function analyzeScopeFromMessage(messageText: string): Promise<ScopeAnalysis> {
  const prompt = `Você é um assistente de marketplace de freelancers. Analise esta mensagem de cliente procurando por um freelancer e extraia:

1. Categoria de trabalho (ex: "Desenvolvimento", "Design", "Marketing", "Copywriting")
2. Orçamento (min e max em BRL)
3. Prazo estimado (em dias)
4. Habilidades/tecnologias necessárias
5. Resumo breve do projeto
6. Urgência (low/medium/high)
7. Confiança da análise (0-100)

Mensagem do cliente:
"${messageText}"

Responda APENAS em JSON, sem explicações:
{
  "category": "string",
  "budget_min": number or null,
  "budget_max": number or null,
  "deadline_days": number or null,
  "skills": ["string"],
  "summary": "string",
  "urgency": "low" | "medium" | "high",
  "confidence": number
}`;

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON response
    const analysis = JSON.parse(responseText) as ScopeAnalysis;

    // Validações básicas
    if (!analysis.category) {
      analysis.category = "Outros Serviços";
    }
    if (!analysis.skills || analysis.skills.length === 0) {
      analysis.skills = ["generalista"];
    }
    if (!analysis.summary) {
      analysis.summary = messageText.substring(0, 200);
    }
    if (analysis.confidence === undefined) {
      analysis.confidence = 75;
    }

    return analysis;
  } catch (error) {
    console.error("AI scope analysis error:", error);

    // Fallback se IA falhar
    return {
      category: "Outros Serviços",
      skills: ["generalista"],
      summary: messageText.substring(0, 200),
      urgency: "medium",
      confidence: 30,
    };
  }
}

/**
 * Gerar prompt pra cliente confirmar escopo
 */
export function generateConfirmationPrompt(analysis: ScopeAnalysis): string {
  let prompt = `Entendi! Você procura um ${analysis.category.toLowerCase()} freelancer`;

  if (analysis.budget_min && analysis.budget_max) {
    prompt += ` com orçamento entre R$ ${analysis.budget_min.toLocaleString()} e R$ ${analysis.budget_max.toLocaleString()}`;
  } else if (analysis.budget_min) {
    prompt += ` com orçamento a partir de R$ ${analysis.budget_min.toLocaleString()}`;
  }

  if (analysis.deadline_days) {
    prompt += `, prazo de ${analysis.deadline_days} dias`;
  }

  prompt += `.`;

  if (analysis.urgency === "high") {
    prompt += " ⚡ Detectei que é urgente.";
  }

  prompt += "\n\nIsso tá certo?";
  return prompt;
}
