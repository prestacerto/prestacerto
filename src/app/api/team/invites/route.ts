import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { TEAM_SEAT_LIMIT } from "@/lib/supabase/queries";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email = (body.email as string)?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Informe um e-mail." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: team } = await supabase
      .from("teams")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!team) {
      return NextResponse.json({ error: "Você ainda não criou uma equipe." }, { status: 404 });
    }

    const [{ count: memberCount }, { count: pendingCount }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("team_id", team.id),
      supabase
        .from("team_invites")
        .select("id", { count: "exact", head: true })
        .eq("team_id", team.id)
        .eq("status", "pending"),
    ]);

    const seatsUsed = 1 + (memberCount ?? 0) + (pendingCount ?? 0); // +1 = dono
    if (seatsUsed >= TEAM_SEAT_LIMIT) {
      return NextResponse.json(
        { error: `Sua equipe já atingiu o limite de ${TEAM_SEAT_LIMIT} pessoas.` },
        { status: 400 }
      );
    }

    const { data: invite, error } = await supabase
      .from("team_invites")
      .insert({ team_id: team.id, email, invited_by: user.id })
      .select("id, token")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(invite, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
}
