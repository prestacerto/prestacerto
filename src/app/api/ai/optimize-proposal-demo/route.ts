import { NextResponse } from 'next/server';

const DEMO_OPTIMIZATIONS = {
  "Sou dev React, faço sites": {
    optimized: "Sou desenvolvedor React especializado em criar websites modernos e responsivos. Tenho experiência em criar aplicações web de alta performance utilizando as melhores práticas do mercado.",
    score: 78,
    win_rate: 0.78,
    issues: ["Proposta muito genérica", "Falta especificar tecnologias"],
    suggestions: ["Detalhe tipos de projetos que faz", "Mencione frameworks específicos", "Mostre velocidade de entrega"],
  },
  "Faço design": {
    optimized: "Sou designer criativo especializado em UI/UX para web e mobile. Crio interfaces intuitivas que resultam em melhor experiência do usuário e maior conversão. Trabalho com ferramentas modernas como Figma e tenho portfolio com projetos para empresas de diferentes segmentos.",
    score: 72,
    win_rate: 0.72,
    issues: ["Falta detalhe do tipo de design", "Sem diferencial claro"],
    suggestions: ["Especifique estilo (minimalist, bold, etc)", "Mostre casos de sucesso", "Mencione velocidade de criação"],
  },
  default: {
    optimized: "Profissional qualificado com experiência em entregar resultados. Comprometido com a qualidade e satisfação do cliente. Disponível para projetos desafiadores que exigem atenção ao detalhe e inovação.",
    score: 65,
    win_rate: 0.65,
    issues: ["Falta personalização", "Genérico demais"],
    suggestions: ["Adapte a proposta pro cliente específico", "Mencione números/resultados", "Mostre seu diferencial"],
  },
};

export async function POST(request: Request) {
  try {
    const { proposal, action } = await request.json();

    if (!proposal) {
      return NextResponse.json({ error: 'Proposta obrigatória' }, { status: 400 });
    }

    if (action !== 'optimize') {
      return NextResponse.json({ error: 'Action não suportada' }, { status: 400 });
    }

    // Encontra match na proposta
    let result =
      DEMO_OPTIMIZATIONS[proposal as keyof typeof DEMO_OPTIMIZATIONS] ||
      DEMO_OPTIMIZATIONS.default;

    // Se não encontrou exato, tenta partial match
    if (result === DEMO_OPTIMIZATIONS.default) {
      if (proposal.toLowerCase().includes('react') || proposal.toLowerCase().includes('dev'))
        result = DEMO_OPTIMIZATIONS["Sou dev React, faço sites"];
      else if (proposal.toLowerCase().includes('design'))
        result = DEMO_OPTIMIZATIONS["Faço design"];
    }

    return NextResponse.json({
      success: true,
      action: 'optimize',
      result: {
        ...result,
        estimatedWinRate: result.win_rate,
      },
      usage: {
        plan_type: 'demo',
        optimizations_used: 0,
        optimizations_remaining: 999,
      },
      note: '⚠️ MODO DEMO (AI real requer créditos Anthropic)',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
