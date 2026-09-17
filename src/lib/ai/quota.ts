import "server-only";
import { createServiceClient, hasServiceCredentials } from "@/lib/supabase/service";

export class AiAccessError extends Error {
  constructor(public status: number, message: string, public upgrade = false) {
    super(message);
  }
}

export type AiAllowance = {
  id: string;
  plan: "free" | "pro" | "business";
  remainingFree: number | null;
};

export async function reserveAi(
  userId: string | null | undefined,
  feature: "rewrite" | "brief",
): Promise<AiAllowance> {
  if (!userId) throw new AiAccessError(401, "Entre na sua conta para usar o Certo AI.");
  if (!hasServiceCredentials() || !process.env.OPENAI_API_KEY) {
    throw new AiAccessError(503, "O Certo AI está em preparação. Você pode continuar escrevendo normalmente.");
  }
  // The reservation is priced for this exact text-only provider/model.
  if (
    (process.env.OPENAI_MODEL ?? "gpt-4o-mini") !== "gpt-4o-mini" ||
    (process.env.OPENAI_API_URL ?? "https://api.openai.com/v1/chat/completions") !== "https://api.openai.com/v1/chat/completions"
  ) {
    throw new AiAccessError(503, "O Certo AI está em preparação.");
  }

  const { data, error } = await createServiceClient().rpc("reserve_certo_ai", {
    p_user_id: userId,
    p_feature: feature,
  });
  if (error || !data || typeof data.allowed !== "boolean") {
    throw new AiAccessError(503, "Não foi possível verificar seu limite agora. Seu texto foi preservado.");
  }
  if (!data.allowed) {
    if (data.reason === "quota") {
      throw new AiAccessError(429, "Você usou as 3 solicitações gratuitas deste mês para este recurso.", true);
    }
    if (data.reason === "budget") {
      throw new AiAccessError(429, "Você atingiu o limite mensal de uso do Certo AI. Seu texto foi preservado.");
    }
    throw new AiAccessError(503, "O Certo AI está temporariamente indisponível. Seu texto foi preservado.");
  }
  if (typeof data.id !== "string" || !["free", "pro", "business"].includes(data.plan)) {
    throw new AiAccessError(503, "Não foi possível verificar seu limite agora.");
  }
  return data as AiAllowance;
}

export async function finishAi(
  id: string,
  response: { id?: string; usage?: { prompt_tokens?: number; completion_tokens?: number } },
) {
  const input = response.usage?.prompt_tokens;
  const output = response.usage?.completion_tokens;
  if (!response.id || !Number.isInteger(input) || !Number.isInteger(output) || input! < 0 || output! < 0) return;
  try {
    const { error } = await createServiceClient().rpc("finish_certo_ai", {
      p_id: id,
      p_request_id: response.id,
      p_input: input,
      p_output: output,
    });
    if (error) throw error;
  } catch {
    // A timeout or failed settlement retains the full reservation, never free usage.
    console.error("[certo-ai] Usage settlement failed; reservation retained.");
  }
}
