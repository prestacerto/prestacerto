import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const REWARD_POOL = [30, 50, 75, 100, 150]; // R$ randomicamente

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Checar se já recebeu hoje
    const today = new Date().toISOString().split("T")[0];
    const supabase = getSupabaseClient();
    const { data: existing } = await supabase
      .from("surprise_rewards")
      .select("id")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Já recebeu sua recompensa de hoje!", claimed_today: true },
        { status: 400 }
      );
    }

    // Sortear valor
    const reward = REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];

    // Registrar
    await supabase.from("surprise_rewards").insert({
      user_id: user.id,
      amount: reward,
    });

    await supabase.from("revenue_events").insert({
      user_id: user.id,
      event_type: "surprise_reward",
      amount: reward,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      reward,
      message: `🎉 Parabéns! Você ganhou R$ ${reward} como bônus surpresa!`,
    });
  } catch (error) {
    console.error("[SURPRISE REWARD ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const today = new Date().toISOString().split("T")[0];
    const supabase = getSupabaseClient();
    const { data: claimed } = await supabase
      .from("surprise_rewards")
      .select("amount, created_at")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`)
      .single();

    return NextResponse.json({
      claimed_today: !!claimed,
      reward: claimed?.amount,
      claimed_at: claimed?.created_at,
    });
  } catch (error) {
    return NextResponse.json({ claimed_today: false, reward: null });
  }
}
