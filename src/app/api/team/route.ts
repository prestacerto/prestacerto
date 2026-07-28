import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfile();
  if (profile?.plan !== "business") {
    return NextResponse.json(
      { error: "Criar uma equipe requer o plano Business." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const name = (body.name as string)?.trim();
    if (!name) {
      return NextResponse.json({ error: "Informe um nome para a equipe." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: team, error } = await supabase
      .from("teams")
      .insert({ owner_id: user.id, name })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Você já tem uma equipe criada." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ id: team.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}
