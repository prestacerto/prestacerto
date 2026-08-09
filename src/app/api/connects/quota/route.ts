import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();

    // Resetar se necessário
    await supabase.rpc("reset_monthly_connects");

    const { data, error } = await supabase
      .from("user_connects_quota")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Quota not found" }, { status: 404 });
    }

    const available = data.connects_available - data.connects_used;

    return NextResponse.json({
      user_id: user.id,
      tier: data.tier,
      connects_available: data.connects_available,
      connects_used: data.connects_used,
      connects_remaining: available,
      last_reset_date: data.last_reset_date,
      reset_cycle_days: data.reset_cycle_days,
    });
  } catch (error) {
    console.error("[CONNECTS QUOTA ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch quota" }, { status: 500 });
  }
}
