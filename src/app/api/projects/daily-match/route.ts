import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // 1. Buscar skills do freelancer
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('skills')
      .eq('user_id', user.id)
      .single();

    const userSkills = profile?.skills || [];

    // 2. Buscar projetos abertos de hoje (com priority > 2)
    const today = new Date().toISOString().split('T')[0];
    const { data: todaysProjects } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'open')
      .gte('created_at', `${today}T00:00:00`)
      .order('created_at', { ascending: false })
      .limit(50);

    // 3. Calcular match score para cada projeto
    const matchedProjects = (todaysProjects || [])
      .map(project => {
        const projectSkills = project.skills_required || [];
        const matchedSkills = projectSkills.filter((skill: string) =>
          userSkills.some((userSkill: string) =>
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );

        const matchScore = projectSkills.length > 0
          ? Math.round((matchedSkills.length / projectSkills.length) * 100)
          : 0;

        return {
          ...project,
          match_score: matchScore,
        };
      })
      .filter(p => p.match_score >= 80) // Só mostrar 80%+ de compatibilidade
      .sort((a, b) => b.match_score - a.match_score)[0]; // Pegar o melhor

    if (!matchedProjects) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum projeto perfeito para você hoje',
        daily_match: null,
      });
    }

    // 4. Contar quantas propostas já foram enviadas para este projeto
    const { data: existingProposals } = await supabase
      .from('proposal_tracking')
      .select('*', { count: 'exact' })
      .eq('project_id', matchedProjects.id)
      .eq('status', 'sent');

    return NextResponse.json({
      success: true,
      daily_match: {
        ...matchedProjects,
        proposal_count: existingProposals?.length || 0,
        urgency_level: (existingProposals?.length || 0) > 5 ? 'high' : 'medium',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar projeto do dia:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar projeto' },
      { status: 500 }
    );
  }
}
