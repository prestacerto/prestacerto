import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é um especialista em propostas de freelancers. Sua missão é analisar, otimizar e comparar propostas para aumentar taxa de ganho.

REGRAS:
1. Identifique problemas: genérica, sem personalização, sem portfólio, sem timeline
2. Reescreva destacando: valor, casos similares, diferencial, urgência
3. Calcule score 0-100 baseado em: personalização, clarity, valor, diferencial
4. Estime taxa de ganho (win_rate) comparando com padrão de mercado
5. Sempre em português PT-BR
6. Mantenha tom profissional mas amigável`;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { action, proposal, proposal2 } = await req.json();

    if (!action || !proposal) {
      return NextResponse.json(
        { error: 'action e proposal são obrigatórios' },
        { status: 400 }
      );
    }

    // Check usage limits
    const { data: usage } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const planType = usage?.plan_type || 'free';

    if (planType === 'free' && usage?.optimizations_used >= 3) {
      return NextResponse.json(
        {
          error: 'Limite de otimizações atingido',
          message: 'Upgrade para Premium (R$ 19,90/mês) para ilimitado',
          remaining: 0,
        },
        { status: 429 }
      );
    }

    let result: any = {};

    if (action === 'optimize') {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `AÇÃO: Otimize esta proposta de freelancer

PROPOSTA ORIGINAL:
${proposal}

RESPONDA EM JSON:
{
  "optimized": "Proposta reescrita aqui",
  "score": 78,
  "win_rate": 0.78,
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["sugestão 1", "sugestão 2"],
  "analysis": {
    "strengths": ["força 1"],
    "weaknesses": ["fraqueza 1"],
    "market_comparison": "Comparação com mercado"
  }
}`
          }
        ]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        try {
          result = JSON.parse(content.text);
        } catch {
          result = {
            optimized: content.text,
            score: 65,
            win_rate: 0.65,
            issues: [],
            suggestions: []
          };
        }
      }

      // Log optimization
      await supabase
        .from('ai_optimizations')
        .insert({
          user_id: user.id,
          action: 'optimize',
          original_proposal: proposal,
          optimized_proposal: result.optimized,
          score: result.score || 65,
          win_rate: result.win_rate || 0.65,
          issues: result.issues || [],
          suggestions: result.suggestions || [],
          analysis: result.analysis || {},
          plan_type: planType,
        });

      // Update usage
      if (planType === 'free') {
        await supabase
          .from('ai_usage')
          .update({ optimizations_used: (usage?.optimizations_used || 0) + 1 })
          .eq('user_id', user.id);
      }
    }
    else if (action === 'compare') {
      if (!proposal2) {
        return NextResponse.json(
          { error: 'proposal2 obrigatório para comparação' },
          { status: 400 }
        );
      }

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `AÇÃO: Compare estas 2 propostas

PROPOSTA 1:
${proposal}

PROPOSTA 2:
${proposal2}

RESPONDA EM JSON:
{
  "proposal1_score": 78,
  "proposal2_score": 65,
  "winner": 1,
  "reason": "Proposta 1 é melhor porque...",
  "comparison": {
    "personalization": "Proposta 1 tem mais",
    "clarity": "Ambas são claras",
    "value_proposition": "Proposta 1 destaca mais"
  }
}`
          }
        ]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        try {
          result = JSON.parse(content.text);
        } catch {
          result = {
            proposal1_score: 70,
            proposal2_score: 60,
            winner: 1,
            reason: content.text,
          };
        }
      }

      // Log comparison
      await supabase
        .from('ai_optimizations')
        .insert({
          user_id: user.id,
          action: 'compare',
          original_proposal: proposal,
          comparison_proposal_2: proposal2,
          score: result.proposal1_score || 70,
          analysis: result,
          plan_type: planType,
        });
    }
    else if (action === 'tips') {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `AÇÃO: Dê 5 dicas práticas para melhorar esta proposta

PROPOSTA:
${proposal}

RESPONDA EM JSON:
{
  "tips": [
    "Dica 1",
    "Dica 2",
    "Dica 3",
    "Dica 4",
    "Dica 5"
  ]
}`
          }
        ]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        try {
          result = JSON.parse(content.text);
        } catch {
          result = {
            tips: [content.text],
          };
        }
      }

      // Log tips (grátis, não consome limite)
      await supabase
        .from('ai_optimizations')
        .insert({
          user_id: user.id,
          action: 'tips',
          original_proposal: proposal,
          analysis: result,
          plan_type: planType,
        });
    }

    // Get remaining usage
    const { data: updatedUsage } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      action,
      result,
      usage: {
        plan_type: planType,
        optimizations_used: updatedUsage?.optimizations_used || 0,
        optimizations_remaining: (updatedUsage?.optimizations_limit || 3) - (updatedUsage?.optimizations_used || 0),
      }
    });
  } catch (error) {
    console.error('Erro na IA:', error);
    return NextResponse.json(
      { error: 'Erro ao processar com IA' },
      { status: 500 }
    );
  }
}
