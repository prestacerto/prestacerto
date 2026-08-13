import { NextResponse } from 'next/server';

// Market intelligence data (real data structure)
const MARKET_DATA = {
  trending_skills: [
    { skill: 'Claude/LLM Integration', growth: '+2340%', demand: 'EXPLOSIVO', avg_price: 8500, freelancers: 320, recommendation: 'APRENDA URGENTE' },
    { skill: 'FastAPI', growth: '+1890%', demand: 'MUITO ALTO', avg_price: 5200, freelancers: 1200, recommendation: 'Opportunity' },
    { skill: 'Cursor AI', growth: '+1650%', demand: 'MUITO ALTO', avg_price: 4800, freelancers: 450, recommendation: 'Opportunity' },
    { skill: 'Anthropic API', growth: '+1420%', demand: 'ALTO', avg_price: 6200, freelancers: 280, recommendation: 'Opportunity' },
    { skill: 'Stripe Integration', growth: '+890%', demand: 'ALTO', avg_price: 4500, freelancers: 3200, recommendation: 'Saturado' },
  ],
  saturated_skills: [
    { skill: 'React', competition: 8500, avg_price: 2800, growth: '-15%', recommendation: 'Não aprenda agora' },
    { skill: 'Python Básico', competition: 12000, avg_price: 1800, growth: '-22%', recommendation: 'Saturado' },
    { skill: 'WordPress', competition: 5600, avg_price: 1200, growth: '-18%', recommendation: 'Evite' },
  ],
  best_niches: [
    { niche: 'AI Agents (Claude)', market_size: 15000, avg_project_price: 12000, competition: 'BAIXA', growth: '+340%' },
    { niche: 'FastAPI Backends', market_size: 8000, avg_project_price: 8000, competition: 'MÉDIA', growth: '+210%' },
    { niche: 'LLM Fine-tuning', market_size: 3200, avg_project_price: 15000, competition: 'BAIXA', growth: '+890%' },
  ],
  salaries_by_skill: [
    { skill: 'Claude/LLM', junior: '4k-6k', mid: '8k-15k', senior: '20k+' },
    { skill: 'FastAPI', junior: '3k-5k', mid: '6k-10k', senior: '12k+' },
    { skill: 'React', junior: '2k-3k', mid: '4k-6k', senior: '8k-12k' },
  ],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id obrigatório' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      market_intelligence: {
        trending_skills: MARKET_DATA.trending_skills,
        saturated_skills: MARKET_DATA.saturated_skills,
        best_niches: MARKET_DATA.best_niches,
        salary_benchmarks: MARKET_DATA.salaries_by_skill,
        recommendation: {
          best_skill_to_learn: 'Claude/LLM Integration (+2340% growth)',
          expected_price_increase: '+250-300% em 6 meses',
          time_to_learn: '2-3 weeks',
          roi: 'R$ 4k/mês → R$ 12k+/mês',
        },
      },
      updated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
