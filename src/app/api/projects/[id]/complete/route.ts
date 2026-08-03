import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendProjectCompletedEmail } from "@/lib/email/resend";

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
      .select("title, client_id, status")
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

    const { data: acceptedProposal } = await supabase
      .from("proposals")
      .select("id, freelancer_id")
      .eq("project_id", params.id)
      .eq("status", "accepted")
      .maybeSingle();

    if (acceptedProposal) {
      const freelancerEmail = await getUserEmailById(acceptedProposal.freelancer_id);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      await sendProjectCompletedEmail({
        to: freelancerEmail,
        projectTitle: project.title,
        reviewUrl: `${siteUrl}/projects/${params.id}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to complete project" },
      { status: 500 }
    );
  }
}
