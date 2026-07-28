import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { TEAM_SEAT_LIMIT } from "@/lib/supabase/queries";

interface AcceptInviteParams {
  // O valor aqui é o token do convite (não o id da linha) — nomeado "id" só
  // porque o Next exige o mesmo nome de slug pro segmento dinâmico irmão
  // (/api/team/invites/[id]).
  id: string;
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<AcceptInviteParams> }
) {
  const params = await props.params;
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const serviceClient = createServiceClient();

    const { data: invite } = await serviceClient
      .from("team_invites")
      .select("id, team_id, status")
      .eq("token", params.id)
      .maybeSingle();

    if (!invite || invite.status !== "pending") {
      return NextResponse.json(
        { error: "Convite inválido ou já utilizado." },
        { status: 404 }
      );
    }

    const [{ count: memberCount }, { count: pendingCount }] = await Promise.all([
      serviceClient
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("team_id", invite.team_id),
      serviceClient
        .from("team_invites")
        .select("id", { count: "exact", head: true })
        .eq("team_id", invite.team_id)
        .eq("status", "pending"),
    ]);

    const seatsUsed = 1 + (memberCount ?? 0) + (pendingCount ?? 0);
    if (seatsUsed > TEAM_SEAT_LIMIT) {
      return NextResponse.json(
        { error: "Essa equipe já está com o número máximo de pessoas." },
        { status: 400 }
      );
    }

    // O próprio usuário atualiza o próprio perfil — passa pela RLS normal.
    const supabase = await createClient();
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ team_id: invite.team_id })
      .eq("id", user.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Marcar o convite como aceito exige a service role — quem aceita não é
    // o dono da equipe, então a RLS de team_invites bloquearia isso.
    await serviceClient
      .from("team_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);

    return NextResponse.json({ success: true, teamId: invite.team_id });
  } catch {
    return NextResponse.json({ error: "Failed to accept invite" }, { status: 500 });
  }
}
