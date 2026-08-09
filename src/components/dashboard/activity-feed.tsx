"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { MessageCircle, Trophy, DollarSign, Clock } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface Activity {
  id: string;
  user_name: string;
  action: string;
  amount?: number;
  created_at: string;
  type: "revenue" | "message" | "rating" | "proposal";
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      // Simulado: na prática, viria do banco
      const mockActivities = [
        {
          id: "1",
          user_name: "João Silva",
          action: "ganhou R$ 5000 em um projeto",
          amount: 5000,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          type: "revenue" as const,
        },
        {
          id: "2",
          user_name: "Maria Santos",
          action: "respondeu em 2 horas",
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          type: "message" as const,
        },
        {
          id: "3",
          user_name: "Pedro Costa",
          action: "recebeu 5 estrelas ⭐",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          type: "rating" as const,
        },
        {
          id: "4",
          user_name: "Ana Ferreira",
          action: "foi aceita em um projeto",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: "proposal" as const,
        },
      ];

      setActivities(mockActivities);
      setLoading(false);

      // Supabase Realtime (quando estiver implementado)
      const channel = supabase
        .channel("activities")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "activities" }, (payload) => {
          setActivities((prev) => [payload.new as Activity, ...prev].slice(0, 10));
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    };

    fetchActivities();
  }, []);

  if (loading) return <div>Carregando...</div>;

  const getIcon = (type: string) => {
    switch (type) {
      case "revenue":
        return <DollarSign size={16} className="text-green-600" />;
      case "message":
        return <MessageCircle size={16} className="text-blue-600" />;
      case "rating":
        return <Trophy size={16} className="text-yellow-600" />;
      case "proposal":
        return <Clock size={16} className="text-purple-600" />;
      default:
        return null;
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const time = new Date(date);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Agora";
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return time.toLocaleDateString("pt-BR");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-bold text-lg mb-4">Atividade em Tempo Real</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
            <div className="flex-shrink-0">{getIcon(activity.type)}</div>
            <div className="flex-grow">
              <p className="text-sm">
                <span className="font-semibold">{activity.user_name}</span> {activity.action}
              </p>
              <p className="text-xs text-slate-500">{formatTime(activity.created_at)}</p>
            </div>
            {activity.amount && <span className="text-green-600 font-bold">+R$ {activity.amount}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
