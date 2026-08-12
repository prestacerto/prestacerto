'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award, Zap } from 'lucide-react';

interface SocialProofEvent {
  id: string;
  freelancer_name: string;
  event_type: string;
  description: string;
  amount_value: number;
  created_at: string;
}

export function SocialProofWidget() {
  const [events, setEvents] = useState<SocialProofEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialProof();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchSocialProof, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSocialProof = async () => {
    try {
      const response = await fetch('/api/social-proof');
      const data = await response.json();
      setEvents(data || []);
    } catch (error) {
      console.error('Erro ao buscar social proof:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'project_completed':
        return '✅';
      case 'milestone_reached':
        return '🏆';
      case 'rating_increased':
        return '⭐';
      case 'reward_claimed':
        return '🎁';
      default:
        return '📈';
    }
  };

  const getEventText = (event: SocialProofEvent) => {
    switch (event.event_type) {
      case 'project_completed':
        return `${event.freelancer_name} completou um projeto por R$ ${event.amount_value}`;
      case 'milestone_reached':
        return `${event.freelancer_name} atingiu R$ ${event.amount_value} em receita!`;
      case 'rating_increased':
        return `${event.freelancer_name} recebeu avaliação 5⭐`;
      case 'reward_claimed':
        return `${event.freelancer_name} reclamou uma recompensa de R$ ${event.amount_value}!`;
      default:
        return event.description;
    }
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-700/30 rounded-lg" />;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          👀 Vendo Outros Ganhar...
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">Atualizado em tempo real</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-slate-400 text-center py-6">Nenhuma atividade recente</p>
          ) : (
            events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500 transition"
              >
                <span className="text-2xl">{getEventIcon(event.event_type)}</span>
                <div className="flex-1">
                  <p className="text-sm text-slate-300 font-medium">
                    {getEventText(event)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Agora mesmo ⚡
                  </p>
                </div>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
            ))
          )}
        </div>
        <p className="text-xs text-slate-500 text-center mt-4">
          💡 Dica: Você também pode estar aqui! Comece agora 🚀
        </p>
      </CardContent>
    </Card>
  );
}