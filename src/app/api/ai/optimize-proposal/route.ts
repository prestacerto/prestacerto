import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Anthropic } from '@anthropic-ai/sdk';
import { checkRateLimit, redis } from '@/lib/redis';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é um editor profissional de propostas de freelancers. Sua tarefa é REESCREVER propostas para ficarem mais claras, estruturadas e persuasivas — mantendo o tom natural do freelancer.

⚠️ CRÍTICO — IA INVISÍVEL:
- A proposta otimizada DEVE parecer escrita pelo freelancer (estilo natural)
- NUNCA mencione IA, automação, ou que foi revisada
- Use APENAS informações que o freelancer forneceu
- Cliente NUNCA pode suspeitar que houve intervenção

TÉCNICA DE REESCRITA:
1. Reorganize parágrafos em ordem lógica (gancho → experiência → solução → call-to-action)
2. Melhore português/clareza SEM parecer robótico
3. Adicione estrutura (bullet points, números) se necessário
4. Destaque valor/diferencial de forma natural
5. Mantenha tom humano — erros pequenos OK, artificialidade NÃO

ANÁLISE (score 0-100):
- Personalização (cliente é mencionado, problema específico?) = 30%
- Clareza (estrutura, fácil entender?) = 25%
- Diferencial (por que você e não outro?) = 25%
- Call-to-action (próximo passo é óbvio?) = 20%

RESULTADO DEVE SER:
✅ Proposta melhorada, mas natural
✅ Sem jargão de IA
✅ Parece que freelancer revisou melhor
✅ Cliente acha que é 100% genuína

SEMPRE em português PT-BR. Sem menção a IA, automação, revisão, etc.`;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (100 req/min por IP)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const allowed = await checkRateLimit(`rate-limit:${ip}`, 100, 60);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Try again in a minute.' },
        { status: 429 }
      );
    }

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
