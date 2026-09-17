import { NextResponse } from 'next/server';

const TRENDING_NOW = [
  { skill: 'Claude/LLM Integration', growth: '+2340%', demand_level: '🔥 EXPLOSIVO', projects_this_week: 1240, avg_project: 8500 },
  { skill: 'FastAPI', growth: '+1890%', demand_level: '🔥 MUITO ALTO', projects_this_week: 890, avg_project: 5200 },
  { skill: 'Cursor AI', growth: '+1650%', demand_level: '🔥 MUITO ALTO', projects_this_week: 560, avg_project: 4800 },
  { skill: 'Anthropic API', growth: '+1420%', demand_level: '🔥 ALTO', projects_this_week: 420, avg_project: 6200 },
  { skill: 'OpenAI Assistants', growth: '+980%', demand_level: '⬆️ ALTO', projects_this_week: 780, avg_project: 5800 },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      trending_now: TRENDING_NOW,
      last_updated: new Date().toISOString(),
      push_notification: {
        enabled: true,
        message: '🔥 Claude/LLM em EXPLOSÃO! +2340% demanda esta semana. Comece a aprender AGORA!',
        target: 'freelancers_com_interest_em_ai',
      },
      insights: {
        hottest_skill: 'Claude/LLM Integration',
        best_time_to_learn: '24-48 horas (aproveita onda)',
        expected_income_increase: '+250-300% em 30 dias',
        recommendation: 'URGENTE: Se você sabe React/Python, estude Claude em paralelo',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
