'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Users, ThumbsUp, Star } from 'lucide-react';

interface Poll {
  id: number;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
}

interface FeaturedFreelancer {
  id: number;
  name: string;
  title: string;
  image?: string;
  rating: number;
  projects: number;
  specialty: string;
}

export default function CommunityPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [featured, setFeatured] = useState<FeaturedFreelancer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockPolls: Poll[] = [
      {
        id: 1,
        question: 'Qual skill mais pedida agora?',
        options: [
          { text: 'React/Next.js', votes: 45 },
          { text: 'Python/Django', votes: 28 },
          { text: 'UI/UX Design', votes: 35 },
          { text: 'DevOps/Cloud', votes: 22 },
        ],
        totalVotes: 130,
      },
      {
        id: 2,
        question: 'Melhor horário para enviar propostas?',
        options: [
          { text: '8-10 AM', votes: 52 },
          { text: '12-14 PM', votes: 38 },
          { text: '16-18 PM', votes: 48 },
          { text: 'Indiferente', votes: 25 },
        ],
        totalVotes: 163,
      },
    ];

    const mockFeatured: FeaturedFreelancer = {
      id: 1,
      name: 'João Silva',
      title: 'Desenvolvedor Full Stack Senior',
      rating: 4.9,
      projects: 42,
      specialty: 'React + Node.js',
    };

    setPolls(mockPolls);
    setFeatured(mockFeatured);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="animate-pulse h-96 bg-slate-700/30 rounded-lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Users className="w-10 h-10 text-blue-400" />
            Comunidade
          </h1>
          <p className="text-slate-400">Conecte, aprenda e cresça com outros freelancers</p>
        </div>

        {/* Featured Freelancer */}
        {featured && (
          <div className="mb-12 bg-gradient-to-r from-blue-600/20 to-slate-800/30 border border-blue-600/30 rounded-lg p-8">
            <p className="text-blue-400 text-sm font-semibold mb-4">⭐ FREELANCER DA SEMANA</p>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{featured.name}</h2>
                <p className="text-slate-300 mb-4">{featured.title}</p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-slate-400">Especialidade</p>
                    <p className="text-white font-semibold">{featured.specialty}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Rating</p>
                    <p className="text-yellow-400 font-semibold">⭐ {featured.rating}/5</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Projetos Completos</p>
                    <p className="text-emerald-400 font-semibold">{featured.projects}</p>
                  </div>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Ver Perfil →
              </button>
            </div>
          </div>
        )}

        {/* Polls */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            Enquetes da Comunidade
          </h2>

          <div className="space-y-6">
            {polls.map((poll) => {
              const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);
              return (
                <div key={poll.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-6">{poll.question}</h3>

                  <div className="space-y-4">
                    {poll.options.map((option, idx) => {
                      const percentage = (option.votes / poll.totalVotes) * 100;
                      return (
                        <div key={idx}>
                          <div className="flex justify-between mb-2">
                            <p className="text-slate-300">{option.text}</p>
                            <span className="text-slate-400 text-sm">
                              {option.votes} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-slate-400 text-xs mt-4">
                    {poll.totalVotes} votos • Votação aberta até amanhã
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600/20 to-slate-800/30 border border-emerald-600/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Quer ser o Freelancer da Semana?</h3>
          <p className="text-slate-300 mb-6">
            Cumpra prazos, responda rápido e receba ótimas avaliações - você será destaque!
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition">
            Começar Agora
          </button>
        </div>
      </div>
    </div>
  );
}
