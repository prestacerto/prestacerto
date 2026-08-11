import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { tier } = await req.json();
  const prices: Record<string, { days: number; price: number }> = {
    gold: { days: 3, price: 15 },
    platinum: { days: 7, price: 25 },
    diamond: { days: 14, price: 40 },
  };

  if (!prices[tier]) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
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

  const { days, price } = prices[tier];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const { error } = await supabase.from("priority_queue").upsert(
    {
      user_id: user.user.id,
      tier,
      expires_at: expiresAt.toISOString(),
      price,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Ativado por ${days} dias`,
    expires_at: expiresAt.toISOString(),
    price,
  });
}
