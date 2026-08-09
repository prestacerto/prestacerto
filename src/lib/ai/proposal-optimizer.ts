import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ProposalAnalysis {
  original: string;
  optimized: string;
  score: number;
  issues: string[];
  suggestions: string[];
  estimatedWinRate: number;
}

export async function optimizeProposal(proposal: string, context?: { category?: string; budget?: number }): Promise<ProposalAnalysis> {
  try {
    const systemPrompt = `Você é um especialista em escrita de propostas freelance. Sua tarefa é:

1. Analisar a proposta e identificar pontos fracos
2. Reescrever de forma profissional, persuasiva e clara
3. Calcular a taxa de ganho estimada (0-100%)
4. Fornecer feedback construtivo

Dicas para propostas vencedoras:
- Personalização (citar o projeto específico)
- Demonstrar entendimento do problema
- Listar experiência relevante
- Ter chamada à ação clara
- Ser conciso (max 300 palavras)
- Oferecer timeline realista
- Mostrar portfólio relevante`;

    const userPrompt = `Analise e otimize esta proposta:

"${proposal}"

${context?.category ? `Categoria: ${context.category}` : ""}
${context?.budget ? `Orçamento do cliente: R$ ${context.budget}` : ""}

Retorne em JSON:
{
  "issues": ["lista de problemas encontrados"],
  "suggestions": ["lista de melhorias sugeridas"],
  "optimized": "proposta reescrita de forma profissional",
  "winRate": número entre 0-100 (taxa de ganho estimada),
  "feedback": "resumo das principais mudanças"
}`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      original: proposal,
      optimized: analysis.optimized || proposal,
      score: analysis.winRate || 0,
      issues: analysis.issues || [],
      suggestions: analysis.suggestions || [],
      estimatedWinRate: analysis.winRate || 0,
    };
  } catch (error) {
    console.error("[PROPOSAL OPTIMIZER ERROR]", error);
    throw error;
  }
}

export async function generateProposalTips(): Promise<string[]> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Gere 5 dicas CURTAS e PRÁTICAS para escrever uma proposta freelance vencedora.
        Formato: ["Dica 1", "Dica 2", ...]
        Máximo 15 palavras por dica.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "[]";
  const match = text.match(/\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : [];
}

export async function compareProposals(proposal1: string, proposal2: string): Promise<{ winner: 1 | 2; reasoning: string; scores: { proposal1: number; proposal2: number } }> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Compare estas 2 propostas e diga qual é melhor:

Proposta 1:
"${proposal1}"

Proposta 2:
"${proposal2}"

Retorne JSON:
{
  "winner": 1 ou 2,
  "reasoning": "por que uma é melhor",
  "scores": {"proposal1": 0-100, "proposal2": 0-100}
}`,
      },
    ],
  });

  const responseText = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid response format");

  return JSON.parse(jsonMatch[0]);
}
