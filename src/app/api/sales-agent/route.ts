import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP, rateLimitResponse, rateLimiters } from '@/lib/rate-limit';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_TURNS = 20;
const MAX_CHARS = 4000;

const SYSTEM_PROMPT = `Você é um agente de vendas IA especializado em prospecção B2B para pequenas e médias empresas (PMEs).

Seu objetivo é:
1. Entender o perfil do prospect (empresa, setor, tamanho, dor principal)
2. Pesquisar informações relevantes
3. Gerar uma estratégia de abordagem personalizada
4. Criar um template de mensagem de outreach
5. Sugerir timing e canais (email, whatsapp, linkedin)
6. Qualificar o lead (hot/warm/cold)

Quando o usuário descrever um prospect, você deve:
- Fazer perguntas clarificadoras se necessário
- Analisar o potencial de venda
- Gerar uma mensagem de outreach personalizada
- Sugerir próximos passos
- Calcular um score de probabilidade de conversão (0-100)

Sempre seja conciso, direto e focado em ação.
Responda em português.`;

export async function POST(request: NextRequest) {
  const { success, reset } = await checkRateLimit(rateLimiters.ai, getClientIP(request));
  if (!success) return rateLimitResponse(reset);

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Converte mensagens para o formato esperado pela API
    const conversationHistory: Anthropic.Beta.BetaMessageParam[] = messages
      .slice(-MAX_TURNS)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: String(msg.content ?? '').slice(0, MAX_CHARS),
      }));

    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      max_tokens: 8000,
      output_config: { effort: 'low' },
      system: SYSTEM_PROMPT,
      messages: conversationHistory,
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({
        message: 'Não consigo ajudar com esse pedido. Descreva um prospect B2B para eu analisar.',
        stop_reason: response.stop_reason,
      });
    }

    const agentMessage = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    return NextResponse.json({
      message: agentMessage,
      stop_reason: response.stop_reason,
    });
  } catch (error) {
    console.error('Sales Agent Error:', error);
    return NextResponse.json(
      {
        error: 'Erro ao processar requisição do agente',
        message:
          error instanceof Error
            ? error.message
            : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
