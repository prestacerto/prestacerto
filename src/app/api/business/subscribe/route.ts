import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { plan } = await req.json();
  const plans: Record<string, number> = {
    starter: 299,
    pro: 599,
    enterprise: 999,
  };

  if (!plans[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const { data: user } = await supabase.auth.getUser(token);

  if (!user.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("business_subscriptions").upsert(
    {
      user_id: user.user.id,
      plan,
      price: plans[plan],
      team_limit: plan === "starter" ? 3 : plan === "pro" ? 5 : 10,
      next_billing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    plan,
    price: plans[plan],
  });
}
