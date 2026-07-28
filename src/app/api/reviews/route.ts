import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Nota inválida" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, client_id, status")
      .eq("id", body.projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.status !== "closed") {
      return NextResponse.json(
        { error: "Este projeto ainda não foi encerrado" },
        { status: 400 }
      );
    }

    const { data: acceptedProposal } = await supabase
      .from("proposals")
      .select("freelancer_id")
      .eq("project_id", project.id)
      .eq("status", "accepted")
      .maybeSingle();

    let targetId: string | null = null;
    if (user.id === project.client_id) {
      targetId = acceptedProposal?.freelancer_id ?? null;
    } else if (user.id === acceptedProposal?.freelancer_id) {
      targetId = project.client_id;
    }

    if (!targetId) {
      return NextResponse.json(
        { error: "Você não faz parte deste projeto" },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("reviews").insert({
      project_id: project.id,
      author_id: user.id,
      target_id: targetId,
      rating,
      comment: body.comment || null,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Você já avaliou este projeto" },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
