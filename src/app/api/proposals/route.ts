import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { getUserEmailById } from "@/lib/supabase/admin";
import { sendNewProposalEmail } from "@/lib/email/resend";

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("proposals")
      .insert({
        project_id: body.projectId,
        freelancer_id: user.id,
        message: body.message,
        proposed_price: body.proposedPrice || null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const [{ data: project }, profile] = await Promise.all([
      supabase.from("projects").select("title, client_id").eq("id", body.projectId).single(),
      getProfile(),
    ]);

    if (project) {
      const clientEmail = await getUserEmailById(project.client_id);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      await sendNewProposalEmail({
        to: clientEmail,
        projectTitle: project.title,
        freelancerName: profile?.full_name ?? "Um freelancer",
        projectUrl: `${siteUrl}/dashboard/projects/${body.projectId}`,
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
