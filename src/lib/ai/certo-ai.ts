import "server-only";

import { z } from "zod";
import { AiAccessError, reserveAi, finishAi, type AiAllowance } from "@/lib/ai/quota";
import { type AiMeteringContext, openAiUsage, recordAiUsage } from "@/lib/ai/metering";
type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type ChatCompletionResponse = {
  id?: string;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    prompt_tokens_details?: { cached_tokens?: number };
  };
  choices?: Array<{
    finish_reason?: string | null;
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

const projectBriefSchema = z.object({
  title: z.string().trim().min(5).max(80),
  description: z.string().trim().min(20).max(10000),
  skills: z.array(z.string().trim().min(1).max(80)).max(20),
  budget_min: z.number().finite().positive().max(99999999.99).nullable(),
  budget_max: z.number().finite().positive().max(99999999.99).nullable(),
  deadline_days: z.number().int().positive().max(730).nullable(),
}).refine(
  (brief) => brief.budget_min === null || brief.budget_max === null || brief.budget_min <= brief.budget_max,
);

function getTextContent(response: ChatCompletionResponse) {
  return response.choices?.[0]?.message?.content?.trim() ?? "";
}

async function complete(messages: ChatMessage[], maxTokens: number, context: AiMeteringContext & { onAllowance?: (value: AiAllowance) => void }) {
  if (Buffer.byteLength(JSON.stringify(messages), "utf8") > 24000 || maxTokens > 500) {
    throw new AiAccessError(400, "O texto ficou muito longo para otimizar de uma vez.");
  }
  const allowance = await reserveAi(context.userId, context.metadata?.feature === "scope-project" ? "brief" : "rewrite");
  context.onAllowance?.(allowance);

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
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    console.error("Certo AI provider error:", response.status);
    throw new Error("O serviço de IA não respondeu agora.");
  }

  const completion = (await response.json()) as ChatCompletionResponse;
  await finishAi(allowance.id, completion);
  await recordAiUsage({
    provider: "openai",
    model: completion.model ?? OPENAI_MODEL,
    requestId: completion.id ?? crypto.randomUUID(),
    usage: openAiUsage(completion),
    context,
    metadata: { endpoint: "chat.completions" },
  });
  // Even an incomplete or filtered answer incurs provider usage, but is not a usable result.
  if (completion.choices?.[0]?.finish_reason !== "stop") {
    throw new Error("O serviço retornou uma resposta incompleta.");
  }
  return completion;
}

/**
 * Copiloto para clientes: transforma uma ideia solta em um briefing estruturado.
 * A IA apenas sugere; o cliente revisa antes de publicar.
 */
export async function structureProjectBrief(
  rawIdea: string,
  categoryHint?: string,
  metering?: Omit<AiMeteringContext, "product"> & { onAllowance?: (value: AiAllowance) => void },
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
    { ...metering, product: "prestacerto", metadata: { ...metering?.metadata, feature: "scope-project" } },
  );

  const text = getTextContent(response).replace(/^```json\s*|\s*```$/g, "");
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("O serviço retornou um briefing inválido.");
  }

  const suggestion = projectBriefSchema.safeParse(parsed);
  if (!suggestion.success) throw new Error("O serviço retornou um briefing inválido.");
  return suggestion.data;
}

/**
 * Melhora uma proposta mantendo a voz e os fatos informados pelo freelancer.
 * O resultado é sempre uma sugestão: o freelancer deve revisar antes do envio.
 */
export async function improveProposalDraft(
  draft: string,
  projectTitle: string,
  metering?: Omit<AiMeteringContext, "product"> & { onAllowance?: (value: AiAllowance) => void },
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
    { ...metering, product: "prestacerto", metadata: { ...metering?.metadata, feature: "improve-proposal" } },
  );

  const improved = getTextContent(response);
  if (!improved) throw new Error("O serviço retornou uma resposta vazia.");
  return improved;
}
