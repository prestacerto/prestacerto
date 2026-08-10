import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

  const { package: pkg } = await req.json();

  const prices: Record<string, { amount: number; price: number }> = {
    starter: { amount: 10, price: 49 },
    pro: { amount: 50, price: 199 },
    business: { amount: 200, price: 599 },
  };

  if (!prices[pkg]) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  const { amount, price } = prices[pkg];

  try {
    const { error: updateError } = await supabase
      .from("user_connects")
      .update({
        extra_connects: supabase.rpc("add_extra_connects", {
          user_id: user.user.id,
          amount,
        }),
      })
      .eq("user_id", user.user.id);

    if (updateError) throw updateError;

    await supabase.from("connect_transactions").insert({
      user_id: user.user.id,
      amount,
      type: "purchase",
      reason: `Compra de ${amount} connects - ${pkg}`,
      metadata: { package: pkg, price },
    });

    return NextResponse.json({
      success: true,
      message: `${amount} connects adicionados!`,
      price,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to purchase connects" },
      { status: 500 }
    );
  }
}
