import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

interface RevokeInviteParams {
  id: string;
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<RevokeInviteParams> }
) {
  const params = await props.params;
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // A policy "dono da equipe gerencia os convites" já restringe isso ao
    // dono — o delete simplesmente não afeta nenhuma linha se não for dele.
    const { error } = await supabase.from("team_invites").delete().eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to revoke invite" }, { status: 500 });
  }
}
