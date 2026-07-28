import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

interface CompleteProjectParams {
  id: string;
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<CompleteProjectParams> }
) {
  const params = await props.params;
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("client_id, status")
      .eq("id", params.id)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.client_id !== user.id) {
      return NextResponse.json(
        { error: "You don't own this project" },
        { status: 403 }
      );
    }

    if (project.status !== "in_progress") {
      return NextResponse.json(
        { error: "Project is not in progress" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({ status: "closed" })
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to complete project" },
      { status: 500 }
    );
  }
}
