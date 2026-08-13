import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY não configurada', status: 'missing-key' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: 'Você é um otimizador de propostas. Responda em JSON: {"status": "funcionando", "mensagem": "IA integrada!"}',
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Invalid response type' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: 'IA FUNCIONANDO',
      response: content.text,
      model: 'claude-3-5-sonnet-20241022',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        status: 'erro',
        type: error.constructor.name,
      },
      { status: 500 }
    );
  }
}
