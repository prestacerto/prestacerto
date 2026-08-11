import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Total connects revenue
    const { data: connects } = await supabase
      .from("connect_transactions")
      .select("price")
      .eq("status", "completed");

    // Referral revenue (estimated)
    const { data: referrals } = await supabase
      .from("referral_codes")
      .select("earnings");

    // Priority queue revenue
    const { data: priority } = await supabase
      .from("priority_queue")
      .select("price");

    // Business subscriptions revenue
    const { data: business } = await supabase
      .from("business_subscriptions")
      .select("price");

    // Contest revenue
    const { data: contests } = await supabase
      .from("contests")
      .select("prize_pool");

    // Payment transactions
    const { data: transactions } = await supabase
      .from("payment_transactions")
      .select("*");

    const connectsRevenue =
      connects?.reduce((sum, t) => sum + (t.price || 0), 0) || 0;
    const referralRevenue =
      referrals?.reduce((sum, r) => sum + (r.earnings || 0), 0) || 0;
    const priorityRevenue = priority?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;
    const businessRevenue =
      business?.reduce((sum, b) => sum + (b.price || 0), 0) || 0;
    const contestRevenue = contests?.reduce((sum, c) => sum + (c.prize_pool * 0.3), 0) || 0;

    const totalRevenue =
      connectsRevenue +
      referralRevenue +
      priorityRevenue +
      businessRevenue +
      contestRevenue;

    // Active users
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .not("id", "is", null);

    const totalTransactions = transactions?.length || 0;
    const activeUsers = profiles?.length || 0;

    return NextResponse.json({
      total_revenue: Math.round(totalRevenue),
      connects_revenue: Math.round(connectsRevenue),
      referral_revenue: Math.round(referralRevenue),
      priority_queue_revenue: Math.round(priorityRevenue),
      business_subs_revenue: Math.round(businessRevenue),
      contest_revenue: Math.round(contestRevenue),
      ad_revenue: 0,
      total_transactions: totalTransactions,
      active_users: activeUsers,
      churn_rate: 0.05,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
