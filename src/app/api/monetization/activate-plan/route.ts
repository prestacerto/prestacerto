import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId, durationDays = 30 } = body;

    if (!planId) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // Activate the specific plan
    const planActivations: Record<string, any> = {};
    const updateData: Record<string, any> = {};

    switch (planId) {
      case "featured-7":
        planActivations.featured_listing = true;
        updateData.featured_listing_expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "featured-30":
        planActivations.featured_listing = true;
        updateData.featured_listing_expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        break;
      case "alerts-premium":
        planActivations.job_alerts_premium = true;
        updateData.job_alerts_premium_expires = expiresAt.toISOString();
        break;
      case "analytics-pro":
        planActivations.analytics_pro = true;
        updateData.analytics_pro_expires = expiresAt.toISOString();
        break;
      case "priority-support":
        planActivations.priority_support = true;
        updateData.priority_support_expires = expiresAt.toISOString();
        break;
      default:
        return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (updateError) {
      console.error("[ACTIVATE PLAN] Update error:", updateError);
      return NextResponse.json({ error: "Failed to activate plan" }, { status: 500 });
    }

    // Log monetization event
    const { error: logError } = await supabase.from("monetization_events").insert({
      user_id: user.id,
      plan_id: planId,
      type: "plan_activated",
      expires_at: expiresAt.toISOString(),
    });
    if (logError) {
      console.error("[ACTIVATE PLAN] Log error:", logError);
    }

    return NextResponse.json({
      success: true,
      message: `Plano ${planId} ativado com sucesso`,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("[ACTIVATE PLAN] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
