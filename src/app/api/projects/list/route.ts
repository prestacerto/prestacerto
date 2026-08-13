import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    // Busca projetos abertos OU meus projetos
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .or(`status.eq.aberto,client_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects: projects || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
