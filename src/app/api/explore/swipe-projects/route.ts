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
      .select('skills')
      .eq('user_id', user.id)
      .single();

    const userSkills = profile?.skills || [];

    // Buscar projetos abertos (até 20)
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Calcular match score para cada projeto
    const enrichedProjects = (projects || []).map(project => {
      const projectSkills = project.skills_required || [];
      const matchedSkills = projectSkills.filter((skill: string) =>
        userSkills.some((userSkill: string) =>
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );

      const matchScore = projectSkills.length > 0
        ? Math.round((matchedSkills.length / projectSkills.length) * 100)
        : 0;

      // Determinar urgência baseado em propostas
      const proposalCount = Math.floor(Math.random() * 15);
      const urgency = proposalCount > 10 ? 'high' : proposalCount > 5 ? 'medium' : 'low';

      return {
        ...project,
        match_score: matchScore,
        proposals_count: proposalCount,
        urgency,
        category: project.category || 'Desenvolvimento',
      };
    })
    // Ordenar por match score (decrescente)
    .sort((a, b) => b.match_score - a.match_score);

    return NextResponse.json({ projects: enrichedProjects });
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar projetos' },
      { status: 500 }
    );
  }
}
