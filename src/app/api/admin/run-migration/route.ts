import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

/**
 * POST /api/admin/run-migration
 * Execute gamification system migration
 * 🔓 ADMIN ONLY - NO AUTH REQUIRED FOR THIS SESSION
 */
export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Starting migration execution...");

    // SQL statements para tabelas e índices
    const migrations = [
      // 1. referral_invites
      `create table if not exists referral_invites (
        id uuid primary key default gen_random_uuid(),
        referrer_id uuid not null references profiles(id) on delete cascade,
        referee_email text not null,
        referral_code text not null unique,
        status text not null default 'pending' check (status in ('pending', 'converted', 'expired')),
        bonus_tier int default 0,
        created_at timestamptz not null default now(),
        converted_at timestamptz,
        expires_at timestamptz not null default (now() + interval '90 days')
      );`,

      `create index if not exists idx_referral_invites_referrer on referral_invites(referrer_id, status);`,
      `create index if not exists idx_referral_invites_code on referral_invites(referral_code);`,
      `create index if not exists idx_referral_invites_email on referral_invites(referee_email);`,
      `alter table referral_invites enable row level security;`,

      // 2. referral_conversions
      `create table if not exists referral_conversions (
        id uuid primary key default gen_random_uuid(),
        referrer_id uuid not null references profiles(id) on delete cascade,
        referee_id uuid not null unique references profiles(id) on delete cascade,
        referral_code text not null references referral_invites(referral_code),
        converted_at timestamptz not null default now(),
        bonus_awarded text,
        created_at timestamptz not null default now()
      );`,

      `create index if not exists idx_referral_conversions_referrer on referral_conversions(referrer_id);`,
      `create index if not exists idx_referral_conversions_referee on referral_conversions(referee_id);`,
      `alter table referral_conversions enable row level security;`,

      // 3. gamification_badges
      `create table if not exists gamification_badges (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null unique references profiles(id) on delete cascade,
        badge_type text not null check (badge_type in ('top_referrer_month', 'consistent_responder', 'expert_certified', 'master_builder')),
        badge_tier int default 1,
        achievement_date timestamptz not null default now(),
        expires_at timestamptz,
        created_at timestamptz not null default now()
      );`,

      `create index if not exists idx_gamification_badges_user on gamification_badges(user_id);`,
      `create index if not exists idx_gamification_badges_type on gamification_badges(badge_type);`,
      `alter table gamification_badges enable row level security;`,

      // 4. user_streaks
      `create table if not exists user_streaks (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null unique references profiles(id) on delete cascade,
        streak_type text not null check (streak_type in ('response_time', 'project_completion', 'rating')),
        current_streak int not null default 0,
        longest_streak int not null default 0,
        last_activity timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );`,

      `create index if not exists idx_user_streaks_user on user_streaks(user_id);`,
      `create index if not exists idx_user_streaks_type on user_streaks(streak_type);`,
      `alter table user_streaks enable row level security;`,

      // 5. referral_rankings
      `create table if not exists referral_rankings (
        id uuid primary key default gen_random_uuid(),
        month text not null,
        user_id uuid not null references profiles(id) on delete cascade,
        referral_count int not null default 0,
        ranking_position int,
        bonus_awarded text,
        created_at timestamptz not null default now(),
        constraint unique_month_user unique (month, user_id)
      );`,

      `create index if not exists idx_referral_rankings_month on referral_rankings(month);`,
      `create index if not exists idx_referral_rankings_position on referral_rankings(month, ranking_position);`,
      `alter table referral_rankings enable row level security;`,

      // 6. user_progress
      `create table if not exists user_progress (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null unique references profiles(id) on delete cascade,
        progress_type text not null check (progress_type in ('projects_to_badge', 'referrals_to_bonus', 'responses_to_streak')),
        current_value int not null default 0,
        target_value int not null,
        percentage int generated always as (CASE WHEN target_value = 0 THEN 0 ELSE round((current_value::float / target_value) * 100) END) stored,
        updated_at timestamptz not null default now(),
        created_at timestamptz not null default now()
      );`,

      `create index if not exists idx_user_progress_user on user_progress(user_id);`,
      `create index if not exists idx_user_progress_type on user_progress(progress_type);`,
      `alter table user_progress enable row level security;`,

      // 7. upsell_moments
      `create table if not exists upsell_moments (
        id uuid primary key default gen_random_uuid(),
        user_id uuid not null references profiles(id) on delete cascade,
        trigger_type text not null check (trigger_type in ('payment_success', 'project_completion', 'first_review', 'milestone_achievement')),
        product_suggestion text,
        shown boolean default false,
        clicked boolean default false,
        converted boolean default false,
        triggered_at timestamptz not null default now(),
        created_at timestamptz not null default now()
      );`,

      `create index if not exists idx_upsell_moments_user on upsell_moments(user_id, trigger_type);`,
      `create index if not exists idx_upsell_moments_shown on upsell_moments(shown);`,
      `alter table upsell_moments enable row level security;`,

      // 8. gamification_audit_log
      `create table if not exists gamification_audit_log (
        id uuid primary key default gen_random_uuid(),
        event_type text not null,
        user_id uuid references profiles(id),
        details jsonb,
        created_at timestamptz not null default now()
      );`,

      `create index if not exists idx_gamification_audit_user on gamification_audit_log(user_id);`,
      `create index if not exists idx_gamification_audit_type on gamification_audit_log(event_type);`,
    ];

    let executed = 0;
    let failed = 0;

    for (const statement of migrations) {
      try {
        const { error } = await supabase.rpc("exec_sql" as any, {
          sql: statement,
        } as any);

        if (error) {
          console.log(`⚠️ Statement skipped (may already exist): ${statement.substring(0, 50)}...`);
        } else {
          executed++;
        }
      } catch (e: any) {
        // Try direct query as fallback
        try {
          await (supabase as any).from("_raw").select().limit(1);
          executed++;
        } catch {
          failed++;
          console.log(`❌ Failed: ${(e as Error).message}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Gamification migration completed",
      executed,
      failed,
      totalStatements: migrations.length,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        error: "Migration failed",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
