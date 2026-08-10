import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

// Endpoint que retorna status de TODAS as features de monetização
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();

    // Buscar status de cada feature
    const [profile, featured, connects, priority, referrals] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("projects").select("is_featured").eq("client_id", user.id).limit(1),
      supabase.from("user_connects_quota").select("*").eq("user_id", user.id).single(),
      supabase.from("priority_queue_subscriptions").select("*").eq("user_id", user.id).single(),
      supabase.from("referral_codes").select("*").eq("user_id", user.id).single(),
    ]);

    return NextResponse.json({
      user_id: user.id,
      features: {
        destaque_projeto: { active: profile.data?.has_premium_portfolio || false },
        portfolio_premium: { active: profile.data?.has_premium_portfolio || false },
        badge_verificacao: { active: profile.data?.is_verified || false },
        conectar: { active: connects.data?.connects_available > 0 || false, available: connects.data?.connects_available || 0 },
        priority_queue: { active: priority.data?.status === "active" || false, tier: priority.data?.tier },
        referral_program: { active: referrals.data ? true : false, code: referrals.data?.code },
      },
      monetization_total: {
        featured_projects: "R$ 500k/ano",
        portfolio_premium: "R$ 250k/ano",
        badge_verification: "R$ 150k/ano",
        connects_proposals: "R$ 600k/ano",
        priority_queue: "R$ 150k/ano",
        contests: "R$ 350k/ano",
        business_premium: "R$ 400k/ano",
        referral_program: "R$ 300k/ano",
        escrow_fees: "R$ 300k/ano",
        courses: "R$ 120k/ano",
        webinars: "R$ 100k/ano",
        api_enterprise: "R$ 250k/ano",
        certifications: "R$ 80k/ano",
        sponsored_ads: "R$ 200k/ano",
        whitelabel: "R$ 400k/ano",
        tools_marketplace: "R$ 50k/ano",
      },
      total_annual: "R$ 4.2M+",
    });
  } catch (error) {
    console.error("[MONETIZATION STATUS ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
