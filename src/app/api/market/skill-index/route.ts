import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Buscar todos os projetos abertos
    const { data: projects } = await supabase
      .from('projects')
      .select('skills_required, created_at')
      .eq('status', 'open');

    // Contar skills nos últimos 7 dias vs 7 dias antes
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const currentWeek: Record<string, number> = {};
    const previousWeek: Record<string, number> = {};

    projects?.forEach(p => {
      const date = new Date(p.created_at);
      const skills = p.skills_required || [];

      if (date >= sevenDaysAgo) {
        skills.forEach((skill: string) => {
          currentWeek[skill] = (currentWeek[skill] || 0) + 1;
        });
      } else if (date >= fourteenDaysAgo) {
        skills.forEach((skill: string) => {
          previousWeek[skill] = (previousWeek[skill] || 0) + 1;
        });
      }
    });

    // Calcular demanda índice
    const skillIndex = Object.keys(currentWeek)
      .map(skill => {
        const current = currentWeek[skill];
        const previous = previousWeek[skill] || current;
        const change = ((current - previous) / Math.max(previous, 1)) * 100;

        return {
          skill,
          demand: current,
          change: Math.round(change),
          trend: change > 10 ? 'up' : change < -10 ? 'down' : 'stable',
          ranking: current,
        };
      })
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 20);

    return NextResponse.json({ skills: skillIndex });
  } catch (error) {
    console.error('Erro ao obter skill index:', error);
    return NextResponse.json(
      { error: 'Erro ao obter índice' },
      { status: 500 }
    );
  }
}
