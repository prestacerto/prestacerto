import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export interface ProjectBriefSuggestion {
  title: string;
  description: string;
  skills: string[];
  budget_min: number | null;
  budget_max: number | null;
  deadline_days: number | null;
}

/**
 * Copiloto "Certo AI" — ajuda o cliente a transformar uma ideia solta num
 * briefing estruturado. Não decide nada sozinho: só sugere, o cliente revisa
 * e edita antes de publicar.
 */
export async function structureProjectBrief(
  rawIdea: string,
  categoryHint?: string
): Promise<ProjectBriefSuggestion> {
  const prompt = `Você ajuda clientes de uma plataforma de freelancers brasileira a transformar uma ideia solta num briefing de projeto claro.

Ideia do cliente${categoryHint ? ` (categoria sugerida: ${categoryHint})` : ""}:
"${rawIdea}"

Gere um briefing estruturado. Se o orçamento não for mencionado, deixe null (não invente número). Responda APENAS em JSON, sem explicação:
{
  "title": "título curto e claro, até 80 caracteres",
  "description": "descrição detalhada do escopo, em português, 3-5 frases",
  "skills": ["habilidade1", "habilidade2"],
  "budget_min": number ou null,
  "budget_max": number ou null,
  "deadline_days": number ou null
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  const parsed = JSON.parse(text) as ProjectBriefSuggestion;

  return {
    title: parsed.title ?? "",
    description: parsed.description ?? rawIdea,
    skills: parsed.skills ?? [],
    budget_min: parsed.budget_min ?? null,
    budget_max: parsed.budget_max ?? null,
    deadline_days: parsed.deadline_days ?? null,
  };
}

/**
 * Ajuda o freelancer a melhorar o texto de uma proposta antes de enviar.
 */
export async function improveProposalDraft(
  draft: string,
  projectTitle: string
): Promise<string> {
  const prompt = `Você ajuda freelancers brasileiros a escrever proposta melhor pra um projeto numa plataforma de freelancer.

Projeto: "${projectTitle}"
Rascunho do freelancer: "${draft}"

Reescreva de forma mais persuasiva e profissional, mantendo o tom natural da pessoa (não deixe robótico), em português, no máximo 150 palavras. Responda APENAS com o texto da proposta reescrita, sem explicação nem aspas.`;

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content[0].type === "text" ? message.content[0].text.trim() : draft;
}
