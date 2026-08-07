// Leaderboards System
// Gamification + engagement through rankings

export type LeaderboardType =
  | "earnings"
  | "referrals"
  | "proposals"
  | "response-time"
  | "rating"
  | "projects-completed";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatarUrl?: string;
  value: number;
  badge: string;
  trend?: "up" | "down" | "stable";
}

export interface LeaderboardConfig {
  type: LeaderboardType;
  title: string;
  description: string;
  metric: string;
  topN: number;
  resetFrequency: "daily" | "weekly" | "monthly" | "yearly";
  rewards: {
    rank1: string; // badge + prize
    rank2: string;
    rank3: string;
  };
}

// Leaderboard configurations
export const LEADERBOARDS: Record<LeaderboardType, LeaderboardConfig> = {
  earnings: {
    type: "earnings",
    title: "🏆 Top Ganhadores",
    description: "Freelancers com maior faturamento este mês",
    metric: "Ganhos (R$)",
    topN: 100,
    resetFrequency: "monthly",
    rewards: {
      rank1: "👑 Rei do Faturamento (badge) + R$ 500 crédito",
      rank2: "🥈 Vice Campeão (badge) + R$ 300 crédito",
      rank3: "🥉 Terceiro (badge) + R$ 100 crédito"
    }
  },
  referrals: {
    type: "referrals",
    title: "🎯 Top Indicadores",
    description: "Que mais trouxeram freelancers novos",
    metric: "Indicações",
    topN: 50,
    resetFrequency: "monthly",
    rewards: {
      rank1: "🚀 Super Indicador (badge) + 3 meses Premium",
      rank2: "📈 Indicador Diamante (badge) + 2 meses Premium",
      rank3: "✨ Indicador Ouro (badge) + 1 mês Premium"
    }
  },
  proposals: {
    type: "proposals",
    title: "📝 Mais Ativo",
    description: "Freelancers que mais enviam propostas",
    metric: "Propostas",
    topN: 50,
    resetFrequency: "weekly",
    rewards: {
      rank1: "🔥 Proposta Master + R$ 100 crédito",
      rank2: "⚡ Proposta Fera + R$ 50 crédito",
      rank3: "💪 Proposta Top + R$ 25 crédito"
    }
  },
  "response-time": {
    type: "response-time",
    title: "⚡ Mais Rápido",
    description: "Menor tempo de resposta a propostas",
    metric: "Tempo médio (horas)",
    topN: 30,
    resetFrequency: "weekly",
    rewards: {
      rank1: "🏃 Raio (badge) + R$ 50 crédito",
      rank2: "💨 Veloz (badge) + R$ 30 crédito",
      rank3: "🎯 Ágil (badge) + R$ 20 crédito"
    }
  },
  rating: {
    type: "rating",
    title: "⭐ Melhor Avaliado",
    description: "Freelancers com melhor rating",
    metric: "Nota média",
    topN: 30,
    resetFrequency: "monthly",
    rewards: {
      rank1: "💎 Perfeição (badge) + Featured 30 dias",
      rank2: "🌟 Excelência (badge) + Featured 15 dias",
      rank3: "✨ Premium (badge) + Featured 7 dias"
    }
  },
  "projects-completed": {
    type: "projects-completed",
    title: "✅ Completa Mais",
    description: "Freelancers com mais projetos concluídos",
    metric: "Projetos",
    topN: 50,
    resetFrequency: "monthly",
    rewards: {
      rank1: "🎖️ Veterano (badge) + R$ 200 crédito",
      rank2: "🏅 Experiente (badge) + R$ 100 crédito",
      rank3: "🎗️ Profissional (badge) + R$ 50 crédito"
    }
  }
};

// Database schema
export const LEADERBOARDS_MIGRATION = `
create table if not exists leaderboard_entries (
  id uuid primary key default gen_random_uuid(),
  leaderboard_type text not null check (leaderboard_type in ('earnings', 'referrals', 'proposals', 'response-time', 'rating', 'projects-completed')),
  period text not null, -- '2026-08' for monthly, '2026-W32' for weekly, '2026' for yearly
  rank int not null,
  user_id uuid not null references profiles(id) on delete cascade,
  value numeric(12,2) not null,
  badge_awarded text,
  reward_claimed boolean default false,
  claimed_at timestamptz,
  created_at timestamptz not null default now(),

  constraint unique_leaderboard unique (leaderboard_type, period, user_id)
);

create index if not exists idx_leaderboard_type_period on leaderboard_entries(leaderboard_type, period);
create index if not exists idx_leaderboard_user on leaderboard_entries(user_id);
create index if not exists idx_leaderboard_rank on leaderboard_entries(rank);

alter table leaderboard_entries enable row level security;

create policy "public_view_leaderboards"
on leaderboard_entries for select using (true);

create policy "user_claim_own_reward"
on leaderboard_entries for update using (auth.uid() = user_id);

-- View: Current month rankings
create or replace view current_leaderboards as
select
  le.leaderboard_type,
  le.rank,
  p.full_name,
  p.avatar_url,
  le.value,
  le.badge_awarded,
  row_number() over (partition by le.leaderboard_type order by le.rank) as position
from leaderboard_entries le
join profiles p on le.user_id = p.id
where le.period = to_char(now(), 'YYYY-MM')
order by le.leaderboard_type, le.rank;

alter table current_leaderboards enable row level security;
`;

// Calculate leaderboard position change
export function calculateTrend(
  currentRank: number,
  previousRank?: number
): "up" | "down" | "stable" {
  if (!previousRank) return "stable";
  if (currentRank < previousRank) return "up"; // Rank 5 → 3 is improvement
  if (currentRank > previousRank) return "down";
  return "stable";
}
