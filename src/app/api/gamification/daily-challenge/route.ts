import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const CHALLENGES = [
  { id: "publish_project", name: "Publicar um projeto", xp: 50, reward: 10, action: "project_created" },
  { id: "reply_messages", name: "Responder 2 mensagens", xp: 30, reward: 5, action: "messages_sent" },
  { id: "complete_profile", name: "Completar perfil", xp: 75, reward: 15, action: "profile_updated" },
  { id: "rate_work", name: "Avaliar um trabalho", xp: 20, reward: 3, action: "rating_given" },
  { id: "update_service", name: "Atualizar serviço", xp: 40, reward: 8, action: "service_updated" },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Pegar challenges do usuário hoje
    const today = new Date().toISOString().split("T")[0];
    const supabase = getSupabaseClient();
    const { data: userChallenges } = await supabase
      .from("user_daily_challenges")
      .select("challenge_id, completed_at, progress")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`);

    const completed = userChallenges?.map((c) => c.challenge_id) || [];

    const result = CHALLENGES.map((challenge) => ({
      ...challenge,
      completed: completed.includes(challenge.id),
      progress: userChallenges?.find((c) => c.challenge_id === challenge.id)?.progress || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CHALLENGE ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { challenge_id } = await req.json();
    const challenge = CHALLENGES.find((c) => c.id === challenge_id);
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

    const today = new Date().toISOString().split("T")[0];
    const supabase = getSupabaseClient();

    // Marcar como completo
    await supabase.from("user_daily_challenges").upsert({
      user_id: user.id,
      challenge_id,
      completed_at: new Date().toISOString(),
      created_at: `${today}T00:00:00`,
    });

    // Dar XP e reward
    await supabase.from("user_gamification").upsert(
      {
        user_id: user.id,
        xp: new Date().toISOString().split("T")[0], // hack: usar data como agrupador
        total_xp: 0, // será incrementado por trigger
      },
      { onConflict: "user_id" }
    );

    await supabase.from("revenue_events").insert({
      user_id: user.id,
      event_type: "challenge_reward",
      amount: challenge.reward,
      status: "completed",
      metadata: { challenge_id },
    });

    return NextResponse.json({
      success: true,
      xp_earned: challenge.xp,
      reward: challenge.reward,
    });
  } catch (error) {
    console.error("[CHALLENGE COMPLETE ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
