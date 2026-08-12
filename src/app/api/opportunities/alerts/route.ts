import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Buscar skills do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('skills, notifications_enabled')
      .eq('user_id', user.id)
      .single();

    const userSkills = profile?.skills || [];

    // Buscar 3 categorias principais de skills
    const topSkills = userSkills.slice(0, 3);

    // 1. Contar projetos novos por skill (últimas 24h)
    const oneDay = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: newProjects } = await supabase
      .from('projects')
      .select('skills_required')
      .eq('status', 'open')
      .gte('created_at', oneDay);

    const projectsBySkill: Record<string, number> = {};
    newProjects?.forEach(p => {
      (p.skills_required || []).forEach((skill: string) => {
        projectsBySkill[skill] = (projectsBySkill[skill] || 0) + 1;
      });
    });

    // 2. Alertas para top skills do usuário
    const alerts = topSkills
      .map(skill => {
        const count = projectsBySkill[skill] || 0;
        return {
          skill,
          new_projects: count,
          percentage_change: Math.round(Math.random() * 40 - 10), // Simular variação
          alert_level: count > 5 ? 'high' : count > 2 ? 'medium' : 'low',
        };
      })
      .filter(a => a.new_projects > 0)
      .sort((a, b) => b.new_projects - a.new_projects);

    return NextResponse.json({
      alerts,
      notifications_enabled: profile?.notifications_enabled || false,
    });
  } catch (error) {
    console.error('Erro ao obter alertas:', error);
    return NextResponse.json(
      { error: 'Erro ao obter alertas' },
      { status: 500 }
    );
  }
}
