import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, freelancer_skills, freelancer_experience } = body;

    // IA matching algorithm
    const skillMatch = project.skills.filter((s: string) =>
      freelancer_skills.some((fs: string) => fs.toLowerCase().includes(s.toLowerCase()))
    ).length / project.skills.length;

    const experienceMatch = freelancer_experience >= 2 ? 0.95 : 0.7;
    const demandMultiplier = project.skills.some((s: string) => ['Claude', 'FastAPI', 'LLM'].some(t => s.includes(t))) ? 1.2 : 1;

    const matchScore = Math.min(99, Math.round((skillMatch * 0.6 + experienceMatch * 0.4) * 100 * demandMultiplier));

    return NextResponse.json({
      success: true,
      match_score: matchScore,
      recommendation: matchScore > 80 ? '🟢 ENVIE AGORA' : matchScore > 60 ? '🟡 BOA CHANCE' : '🔴 DIFÍCIL',
      ai_generated_proposal: `Olá! Vi seu projeto de ${project.title}. Tenho ${freelancer_experience}+ anos em ${freelancer_skills.join(', ')}...`,
      pricing_recommendation: `Baseado na demanda, sugerimos cobrar R$ ${project.budget_cents / 100 + (matchScore > 85 ? 500 : 0)}`,
      suggested_improvements: [
        'Destaque sua experiência em ' + project.skills[0],
        'Mencione projetos similares anteriores',
        'Defina timeline clara',
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
