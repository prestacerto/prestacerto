// Daily Challenges System
// Engagement loops + retention through daily missions

export type ChallengeType =
  | "respond-proposals"
  | "complete-profile"
  | "send-message"
  | "publish-service"
  | "rate-experience";

export interface DailyChallenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  icon: string;
  target: number;
  reward: {
    bonus_credits: number;
    xp: number;
    badge?: string;
  };
  difficulty: "easy" | "medium" | "hard";
}

export const DAILY_CHALLENGES: Record<ChallengeType, DailyChallenge> = {
  "respond-proposals": {
    id: "challenge_respond",
    type: "respond-proposals",
    title: "⚡ Responda 3 Propostas",
    description: "Mantenha o momentum respondendo propostas hoje",
    icon: "⚡",
    target: 3,
    reward: {
      bonus_credits: 50,
      xp: 25,
      badge: "responsive"
    },
    difficulty: "easy"
  },
  "complete-profile": {
    id: "challenge_profile",
    type: "complete-profile",
    title: "👤 Complete seu Perfil",
    description: "Adicione foto, descrição e portfólio",
    icon: "👤",
    target: 1,
    reward: {
      bonus_credits: 100,
      xp: 50
    },
    difficulty: "easy"
  },
  "send-message": {
    id: "challenge_message",
    type: "send-message",
    title: "💬 Envie 2 Mensagens",
    description: "Comunique-se com clientes potenciais",
    icon: "💬",
    target: 2,
    reward: {
      bonus_credits: 75,
      xp: 30
    },
    difficulty: "medium"
  },
  "publish-service": {
    id: "challenge_service",
    type: "publish-service",
    title: "🎯 Publique um Serviço",
    description: "Mostre suas habilidades criando um novo serviço",
    icon: "🎯",
    target: 1,
    reward: {
      bonus_credits: 150,
      xp: 75,
      badge: "creator"
    },
    difficulty: "hard"
  },
  "rate-experience": {
    id: "challenge_rate",
    type: "rate-experience",
    title: "⭐ Avalie um Projeto",
    description: "Deixe feedback sobre uma experiência recente",
    icon: "⭐",
    target: 1,
    reward: {
      bonus_credits: 60,
      xp: 20
    },
    difficulty: "medium"
  }
};

// Database schema
export const DAILY_CHALLENGES_MIGRATION = `
create table if not exists daily_challenge_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  challenge_type text not null,
  date date not null default current_date,
  progress_count int not null default 0,
  target_count int not null,
  completed boolean generated always as (progress_count >= target_count) stored,
  completed_at timestamptz,
  reward_claimed boolean default false,
  created_at timestamptz not null default now(),

  constraint unique_daily_challenge unique (user_id, challenge_type, date)
);

create index if not exists idx_daily_challenge_user on daily_challenge_progress(user_id);
create index if not exists idx_daily_challenge_date on daily_challenge_progress(date);
create index if not exists idx_daily_challenge_completed on daily_challenge_progress(completed);

alter table daily_challenge_progress enable row level security;

create policy "user_view_own_challenges"
on daily_challenge_progress for select using (auth.uid() = user_id);

create policy "user_update_own_challenges"
on daily_challenge_progress for update using (auth.uid() = user_id);

-- View: Today's challenges for user
create or replace view user_daily_challenges as
select
  dcp.user_id,
  dcp.challenge_type,
  dcp.date,
  dcp.progress_count,
  dcp.target_count,
  dcp.completed,
  dcp.completed_at,
  dcp.reward_claimed,
  case
    when dcp.completed and not dcp.reward_claimed then 'pending'
    when dcp.reward_claimed then 'claimed'
    else 'in_progress'
  end as status
from daily_challenge_progress dcp
where dcp.date = current_date
order by dcp.created_at;

alter table user_daily_challenges enable row level security;
`;
