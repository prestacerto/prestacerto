// Featured Proposals System
// Boost proposal visibility for R$ 19-49

export type FeaturedTier = "standard" | "premium" | "elite";

export interface FeaturedProposal {
  id: string;
  proposalId: string;
  userId: string;
  tier: FeaturedTier;
  price: number;
  duration: number; // days
  startsAt: Date;
  expiresAt: Date;
  position: number; // display order
  views: number;
  clicks: number;
  conversions: number;
  created_at: Date;
}

export const FEATURED_TIERS: Record<FeaturedTier, {
  price: number;
  duration: number;
  features: string[];
  benefits: {
    positionBoost: number; // how many positions higher in search
    badgeIcon: string;
    color: string;
    analytics: boolean;
  }
}> = {
  standard: {
    price: 19,
    duration: 7,
    features: ["Badge no resultado de busca", "Boost de 1 semana"],
    benefits: {
      positionBoost: 5,
      badgeIcon: "⭐",
      color: "#fbbf24",
      analytics: false
    }
  },
  premium: {
    price: 39,
    duration: 14,
    features: [
      "Badge premium no resultado",
      "Boost de 2 semanas",
      "Prioridade em notificações",
      "Analytics básico"
    ],
    benefits: {
      positionBoost: 10,
      badgeIcon: "✨",
      color: "#60a5fa",
      analytics: true
    }
  },
  elite: {
    price: 79,
    duration: 30,
    features: [
      "Badge elite exclusivo",
      "Boost de 1 mês",
      "Prioridade máxima",
      "Analytics completo",
      "Destaque em 'Trending'"
    ],
    benefits: {
      positionBoost: 20,
      badgeIcon: "👑",
      color: "#a78bfa",
      analytics: true
    }
  }
};

// Calculate revenue impact
export function estimateBoost(tier: FeaturedTier, currentAcceptanceRate: number): {
  estimatedViews: number;
  estimatedConversions: number;
  roi: number;
} {
  const tier_data = FEATURED_TIERS[tier];
  const positionBoost = tier_data.benefits.positionBoost;

  // Rough estimation: 2x visibility per 10 position boost
  const visibilityMultiplier = 1 + (positionBoost * 0.02);
  const estimatedViews = Math.round(100 * visibilityMultiplier);
  const estimatedConversions = Math.round(estimatedViews * (currentAcceptanceRate / 100));

  // Conservative ROI: assuming R$ 1000 average project value
  const potentialValue = estimatedConversions * 1000;
  const roi = ((potentialValue - tier_data.price) / tier_data.price) * 100;

  return {
    estimatedViews,
    estimatedConversions,
    roi: Math.round(roi)
  };
}

// Database schema migration
export const FEATURED_PROPOSALS_MIGRATION = `
create table if not exists featured_proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  tier text not null check (tier in ('standard', 'premium', 'elite')),
  price numeric(10,2) not null,
  duration int not null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  position int,
  views int default 0,
  clicks int default 0,
  conversions int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_featured_proposals_user on featured_proposals(user_id);
create index if not exists idx_featured_proposals_expires on featured_proposals(expires_at);
create index if not exists idx_featured_proposals_tier on featured_proposals(tier);

alter table featured_proposals enable row level security;

create policy "user_view_own_featured"
on featured_proposals for select using (auth.uid() = user_id);

create policy "public_view_active_featured"
on featured_proposals for select using (
  now() < expires_at
);

-- View: Top featured proposals by tier
create or replace view featured_proposals_ranked as
select
  fp.*,
  p.full_name,
  p.avatar_url
from featured_proposals fp
join profiles p on fp.user_id = p.id
where now() < fp.expires_at
order by fp.tier desc, fp.views desc;

alter table featured_proposals_ranked enable row level security;
`;
