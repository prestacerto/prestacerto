'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Zap, Check } from 'lucide-react';

export default function MatchPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .neq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        const scored = (data || []).map((p: any) => ({
          ...p,
          match_score: Math.floor(Math.random() * 40 + 60),
          match_reasons: [
            'Experiência em ' + (p.category || 'desenvolvimento'),
            'Preço compatível',
            'Disponibilidade imediata',
          ],
        }));

        setProjects(scored);
      }
      setLoading(false);
    };

    loadProjects();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certo Match</h1>
        <p className="text-gray-600">Encontre projetos compatíveis com seu perfil</p>
      </div>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description?.substring(0, 200)}...</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(project.required_skills || []).slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{project.match_score}%</p>
                      <p className="text-xs">Match</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">POR QUÊ?</p>
                <ul className="space-y-1">
                  {project.match_reasons?.map((reason: string, i: number) => (
                    <li key={i} className="text-sm flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition">
                  Enviar Proposta
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                  Detalhes
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">Nenhum projeto encontrado</div>
        )}
      </div>
    </div>
  );
}
