'use client';

import { useState, useEffect } from 'react';
import { Zap, Target, AlertCircle } from 'lucide-react';

interface MatchedProject {
  id: string;
  title: string;
  budget: number;
  skills: string[];
  match: number;
  reason: string;
  status: 'perfect' | 'good' | 'fair';
  client: string;
  daysLeft: number;
}

export default function JobMatchingPage() {
  const [matches, setMatches] = useState<MatchedProject[]>([]);
  const [filter, setFilter] = useState<'all' | 'perfect' | 'good' | 'fair'>('all');

  useEffect(() => {
    const mockMatches: MatchedProject[] = [
      {
        id: '1',
        title: 'Desenvolvedor React/Next.js',
        budget: 15000,
        skills: ['React', 'Next.js', 'TypeScript'],
        match: 98,
        reason: 'Match perfeito com suas skills. Seu preço está compatível com o orçamento.',
        status: 'perfect',
        client: 'Tech Startup XYZ',
        daysLeft: 3,
      },
      {
        id: '2',
        title: 'Implementação de Dashboard',
        budget: 8000,
        skills: ['React', 'Data Visualization', 'API Integration'],
        match: 87,
        reason: 'Você tem experiência com todas as skills. Preço um pouco acima do mercado.',
        status: 'good',
        client: 'Empresa Analytics',
        daysLeft: 5,
      },
      {
        id: '3',
        title: 'Backend API com Node.js',
        budget: 12000,
        skills: ['Node.js', 'Express', 'PostgreSQL'],
        match: 76,
        reason: 'Você tem 80% das skills. Falta experiência com essa stack específica.',
        status: 'good',
        client: 'SaaS Platform',
        daysLeft: 2,
      },
      {
        id: '4',
        title: 'Mobile App com React Native',
        budget: 20000,
        skills: ['React Native', 'Mobile', 'Firebase'],
        match: 45,
        reason: 'Você não tem experiência significativa com React Native.',
        status: 'fair',
        client: 'Mobile First Company',
        daysLeft: 7,
      },
      {
        id: '5',
        title: 'DevOps Engineer',
        budget: 18000,
        skills: ['Kubernetes', 'Docker', 'AWS'],
        match: 32,
        reason: 'Skill muito diferente de sua especialidade.',
        status: 'fair',
        client: 'Cloud Infrastructure Co',
        daysLeft: 4,
      },
    ];

    setMatches(mockMatches);
  }, []);

  const filtered = filter === 'all' ? matches : matches.filter(m => m.status === filter);

  const statusColors: any = {
    perfect: 'bg-green-100 border-green-300',
    good: 'bg-blue-100 border-blue-300',
    fair: 'bg-yellow-100 border-yellow-300',
  };

  const statusText: any = {
    perfect: 'Match Perfeito',
    good: 'Bom Match',
    fair: 'Match Moderado',
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Target className="w-8 h-8 text-purple-500" />
          Job Matching
        </h1>
        <p className="text-gray-600">Projetos recomendados com base em suas skills</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['all', 'perfect', 'good', 'fair'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === f
                ? 'bg-blue-500 text-white'
                : 'bg-white border text-gray-700 hover:border-blue-500'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'perfect' ? '⭐ Perfeitos' : f === 'good' ? '👍 Bons' : '⚠️ Moderados'}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Nenhum projeto encontrado nesta categoria</p>
          </div>
        ) : (
          filtered.map(project => (
            <div key={project.id} className={`border-2 rounded-lg p-6 ${statusColors[project.status]}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <span className="text-sm bg-white px-3 py-1 rounded-full font-semibold">
                      {statusText[project.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>Cliente:</strong> {project.client} • <strong>Vence em:</strong> {project.daysLeft} dias
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">R$ {(project.budget / 1000).toFixed(1)}k</p>
                </div>
              </div>

              {/* Match Score */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold">Match Score:</span>
                  <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        project.match >= 80 ? 'bg-green-500' : project.match >= 60 ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${project.match}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${
                    project.match >= 80 ? 'text-green-600' : project.match >= 60 ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {project.match}%
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Skills necessárias:</p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map(skill => (
                    <span key={skill} className="text-xs bg-white px-3 py-1 rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div className="mb-4 p-4 bg-white bg-opacity-60 rounded">
                <p className="text-sm text-gray-700">{project.reason}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition">
                  <Zap className="w-4 h-4" />
                  Enviar Proposta
                </button>
                <button className="flex-1 bg-white text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-50 border transition">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-12">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-700 mb-1">Match Perfeito</p>
          <p className="text-3xl font-bold text-green-600">{matches.filter(m => m.status === 'perfect').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700 mb-1">Bom Match</p>
          <p className="text-3xl font-bold text-blue-600">{matches.filter(m => m.status === 'good').length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs text-yellow-700 mb-1">Match Moderado</p>
          <p className="text-3xl font-bold text-yellow-600">{matches.filter(m => m.status === 'fair').length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-xs text-purple-700 mb-1">Potencial Faturamento</p>
          <p className="text-3xl font-bold text-purple-600">R$ {(matches.reduce((sum, m) => sum + m.budget, 0) / 1000).toFixed(0)}k</p>
        </div>
      </div>
    </div>
  );
}
