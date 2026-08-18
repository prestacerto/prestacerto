type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_API_URL ?? "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export interface ProjectBriefSuggestion {
  title: string;
  description: string;
  skills: string[];
  budget_min: number | null;
  budget_max: number | null;
  deadline_days: number | null;
}

function getTextContent(response: ChatCompletionResponse) {
  return response.choices?.[0]?.message?.content?.trim() ?? "";
}

async function complete(messages: ChatMessage[], maxTokens: number) {
  if (!OPENAI_API_KEY) {
    throw new Error("Certo AI ainda não foi configurado no servidor.");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.55,
      max_tokens: maxTokens,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error("Certo AI provider error:", response.status, details.slice(0, 500));
    throw new Error("O serviço de IA não respondeu agora.");
  }

  return (await response.json()) as ChatCompletionResponse;
}

/**
 * Copiloto para clientes: transforma uma ideia solta em um briefing estruturado.
 * A IA apenas sugere; o cliente revisa antes de publicar.
 */
export async function structureProjectBrief(
  rawIdea: string,
  categoryHint?: string,
): Promise<ProjectBriefSuggestion> {
  const response = await complete(
    [
      {
        role: "system",
        content:
          "Você ajuda clientes de uma plataforma brasileira de freelancers a escrever briefings claros. Nunca invente orçamento, prazo, experiência ou requisitos que não estejam no texto. Responda apenas com JSON válido, sem markdown.",
      },
      {
        role: "user",
        content: `Transforme esta ideia em um briefing objetivo.

Categoria sugerida: ${categoryHint || "não informada"}
Ideia do cliente:
${rawIdea}

Formato obrigatório:
{
  "title": "título curto, até 80 caracteres",
  "description": "descrição em português, 3 a 5 frases",
  "skills": ["habilidade1", "habilidade2"],
  "budget_min": number ou null,
  "budget_max": number ou null,
  "deadline_days": number ou null
}`,
      },
    ],
    500,
  );

  const text = getTextContent(response).replace(/^```json\s*|\s*```$/g, "");
  let parsed: Partial<ProjectBriefSuggestion> = {};

  try {
    parsed = JSON.parse(text) as Partial<ProjectBriefSuggestion>;
  } catch {
    parsed = {};
  }

  return {
    title: typeof parsed.title === "string" ? parsed.title : "",
    description:
      typeof parsed.description === "string" ? parsed.description : rawIdea,
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.filter((skill): skill is string => typeof skill === "string")
      : [],
    budget_min: typeof parsed.budget_min === "number" ? parsed.budget_min : null,
    budget_max: typeof parsed.budget_max === "number" ? parsed.budget_max : null,
    deadline_days:
      typeof parsed.deadline_days === "number" ? parsed.deadline_days : null,
  };
}

/**
 * Melhora uma proposta mantendo a voz e os fatos informados pelo freelancer.
 * O resultado é sempre uma sugestão: o freelancer deve revisar antes do envio.
 */
export async function improveProposalDraft(
  draft: string,
  projectTitle: string,
): Promise<string> {
  const response = await complete(
    [
      {
        role: "system",
        content:
          "Você é o Certo AI, um editor invisível de propostas para freelancers brasileiros. Melhore clareza, especificidade e organização, mantendo o tom natural da pessoa. Preserve rigorosamente todos os fatos fornecidos. Não invente clientes, números, anos de experiência, portfólio, certificações, prazos, garantias ou resultados. Se faltar informação, escreva de forma honesta e genérica. Responda apenas com a proposta final em português, sem aspas, introdução ou explicação. Use no máximo 180 palavras.",
      },
      {
        role: "user",
        content: `Projeto: ${projectTitle}

Rascunho do freelancer:
${draft}

Organize a proposta com uma abertura específica para o projeto, uma breve explicação de como a pessoa pode ajudar e um próximo passo claro. Não transforme o texto em uma promessa que o rascunho não sustenta.`,
      },
    ],
    400,
  );

  const improved = getTextContent(response);
  return improved || draft;
}
