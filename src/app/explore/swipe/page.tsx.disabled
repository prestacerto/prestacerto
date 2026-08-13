'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, X, SkipForward } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  skills_required: string[];
  match_score: number;
  proposals_count: number;
  client_name: string;
  urgency: 'high' | 'medium' | 'low';
}

export default function SwipePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ liked: 0, passed: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/explore/swipe-projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'like' | 'pass' | 'skip') => {
    if (currentIndex >= projects.length) return;

    const project = projects[currentIndex];

    // Haptic feedback
    if (navigator.vibration) {
      navigator.vibration.vibrate(direction === 'like' ? 200 : 100);
    }

    // Like = save interest
    if (direction === 'like') {
      setStats(s => ({ ...s, liked: s.liked + 1 }));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);

      // Save to DB
      await fetch('/api/projects/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      });

      // Show toast
      showToast(`❤️ Salvo! Você tem ${project.match_score}% de compatibilidade`);
    } else if (direction === 'pass') {
      setStats(s => ({ ...s, passed: s.passed + 1 }));
      showToast(`Passou • ${projects.length - currentIndex - 1} mais pra você`);
    }

    // Next card
    if (currentIndex < projects.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        fetchProjects();
        setCurrentIndex(0);
        setStats({ liked: 0, passed: 0 });
      }, 2000);
    }
  };

  const showToast = (message: string) => {
    // Simular toast
    console.log(message);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Carregando projetos...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl font-bold mb-4">Sem projetos agora 😢</p>
          <p className="text-slate-400 mb-6">Volte mais tarde para novas oportunidades</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const project = projects[currentIndex];
  const urgencyColor = project.urgency === 'high' ? 'text-red-400' : 'text-amber-400';
  const urgencyBg = project.urgency === 'high' ? 'bg-red-600/20' : 'bg-amber-600/20';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-6 px-4 flex flex-col">
      {/* Header */}
      <div className="max-w-md mx-auto w-full mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">🔥 Swipe</h1>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400">Curtidas</p>
              <p className="text-emerald-400 font-bold">{stats.liked}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Passadas</p>
              <p className="text-slate-400 font-bold">{stats.passed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="max-w-md mx-auto w-full flex-1 flex items-center justify-center">
        <div className="w-full relative">
          {/* Progress bar */}
          <div className="mb-4 h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / projects.length) * 100}%` }}
            />
          </div>

          {/* Swipe Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            {/* Card Image/Banner */}
            <div className="relative h-48 bg-gradient-to-br from-blue-600/30 to-slate-800/30 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl mb-2">📊</p>
                <p className="text-slate-300 text-sm">{project.category}</p>
              </div>

              {/* Match Score Badge */}
              <div className="absolute top-4 right-4 bg-emerald-600/20 border border-emerald-600/50 rounded-full px-4 py-2">
                <p className="text-emerald-400 font-bold text-sm">
                  {project.match_score}% match
                </p>
              </div>

              {/* Urgency Badge */}
              {project.urgency === 'high' && (
                <div className="absolute top-4 left-4 bg-red-600/20 border border-red-600/50 rounded-full px-3 py-1">
                  <p className={`${urgencyColor} font-bold text-xs`}>🔴 URGENTE</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
                <p className="text-slate-300 text-sm line-clamp-2">{project.description}</p>
              </div>

              {/* Price & Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Orçamento</p>
                  <p className="text-emerald-400 font-bold text-xl">
                    R$ {(project.budget / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Cliente</p>
                  <p className="text-white font-semibold">{project.client_name}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex gap-2 flex-wrap">
                {project.skills_required.slice(0, 3).map(skill => (
                  <span
                    key={skill}
                    className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-600"
                  >
                    {skill}
                  </span>
                ))}
                {project.skills_required.length > 3 && (
                  <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-600">
                    +{project.skills_required.length - 3}
                  </span>
                )}
              </div>

              {/* Proposals Count */}
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-slate-300 text-sm">
                  <strong>{project.proposals_count}</strong> propostas já enviadas
                </p>
                {project.proposals_count > 5 && (
                  <p className="text-amber-300 text-xs mt-1">⚡ Responda rápido!</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            {/* Pass */}
            <button
              onClick={() => handleSwipe('pass')}
              className="bg-slate-700/50 hover:bg-slate-700 text-white w-16 h-16 rounded-full flex items-center justify-center transition transform hover:scale-110 active:scale-95"
              title="Passar"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Skip (opcional) */}
            <button
              onClick={() => handleSwipe('skip')}
              className="bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 w-14 h-14 rounded-full flex items-center justify-center transition text-xs font-bold"
              title="Pular"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Like */}
            <button
              onClick={() => handleSwipe('like')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-16 h-16 rounded-full flex items-center justify-center transition transform hover:scale-110 active:scale-95 shadow-lg shadow-emerald-600/50"
              title="Curtir"
            >
              <Heart className="w-6 h-6 fill-white" />
            </button>
          </div>

          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="max-w-md mx-auto w-full mt-6 text-center text-slate-400 text-sm">
        <p>
          {currentIndex + 1} de {projects.length} • {projects.length - currentIndex - 1} mais
        </p>
      </div>
    </div>
  );
}
