import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const { data: user } = await supabase.auth.getUser(token);

  if (!user.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Reset monthly if needed
  const today = new Date();
  const { data: connects } = await supabase
    .from("user_connects")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (!connects) {
    return NextResponse.json({ error: "No connects record" }, { status: 404 });
  }

  const lastReset = new Date(connects.last_reset_at);
  if (lastReset.getMonth() !== today.getMonth() || lastReset.getFullYear() !== today.getFullYear()) {
    await supabase
      .from("user_connects")
      .update({ used_this_month: 0, last_reset_at: today.toISOString() })
      .eq("user_id", user.user.id);

    connects.used_this_month = 0;
  }

  const available = connects.monthly_limit - connects.used_this_month + connects.extra_connects;

  return NextResponse.json({
    plan: connects.plan,
    monthly_limit: connects.monthly_limit,
    used_this_month: connects.used_this_month,
    extra_connects: connects.extra_connects,
    available_this_month: Math.max(0, available),
    can_propose: available > 0,
  });
}
