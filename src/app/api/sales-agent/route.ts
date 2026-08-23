import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Converte mensagens para o formato esperado pela API
    const conversationHistory = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    );

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: conversationHistory,
    });

    const agentMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

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
