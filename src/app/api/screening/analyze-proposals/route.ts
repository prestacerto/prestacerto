import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { proposals, projectDescription } = await req.json();

    if (!proposals || proposals.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma proposta para analisar' },
        { status: 400 }
      );
    }

    // Score cada proposta
    const scoredProposals = await Promise.all(
      proposals.map(async (proposal: any) => {
        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 500,
          system: `Você é um especialista em avaliar propostas de freelancers.
Analise a proposta baseado em:
- Relevância da experiência (0-25 pontos)
- Qualidade do pitch/clareza (0-25 pontos)
- Portfolio match (0-25 pontos)
- Preço justo vs. mercado (0-25 pontos)
TOTAL: 0-100 pontos

Retorne JSON: { score: number, reason: string, verdict: "excellent"|"good"|"ok"|"skip" }`,
          messages: [
            {
              role: 'user',
              content: `Projeto: ${projectDescription}\n\nProposta: ${proposal.content}`,
            }
          ]
        });

        const content = message.content[0];
        if (content.type === 'text') {
          try {
            const parsed = JSON.parse(content.text);
            return {
              ...proposal,
              score: parsed.score,
              reason: parsed.reason,
              verdict: parsed.verdict,
            };
          } catch {
            return { ...proposal, score: 50, reason: 'Análise parcial', verdict: 'ok' };
          }
        }
        return { ...proposal, score: 50, verdict: 'ok' };
      })
    );

    // Top 5
    const topProposals = scoredProposals
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Save screening result
    await supabase
      .from('screening_results')
      .insert({
        client_id: user.id,
        total_proposals: proposals.length,
        top_proposals: topProposals,
        project_description: projectDescription,
      });

    return NextResponse.json({
      success: true,
      total: proposals.length,
      topProposals,
      savedTime: `${(proposals.length - 5) * 2} minutos economizados`, // ~2 min por proposta
    });
  } catch (error) {
    console.error('Erro ao analisar propostas:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer screening' },
      { status: 500 }
    );
  }
}
