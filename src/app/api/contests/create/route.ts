import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, category, budget_min, budget_max, deadline, prize_pool } = body;

    if (!title || !prize_pool) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const serviceClient = createServiceClient();

    // Calcular taxa (25-40%)
    const prestacerto_fee = prize_pool * 0.30; // 30% default

    // Criar contest
    const { data: contest, error } = await supabase
      .from("contests")
      .insert({
        client_id: user.id,
        title,
        description,
        category,
        budget_min,
        budget_max,
        deadline: new Date(deadline),
        prize_pool,
        prestacerto_fee,
        status: "open",
      })
      .select("id")
      .single();

    if (error) throw error;

    // Registrar evento
    await serviceClient.from("revenue_events").insert({
      user_id: user.id,
      event_type: "contest_created",
      amount: prestacerto_fee,
      status: "pending",
    });

    return NextResponse.json({
      contest_id: contest.id,
      prize_pool,
      prestacerto_fee,
      status: "open",
    });
  } catch (error) {
    console.error("[CONTEST CREATE ERROR]", error);
    return NextResponse.json({ error: "Failed to create contest" }, { status: 500 });
  }
}
