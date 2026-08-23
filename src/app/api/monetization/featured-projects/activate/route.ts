import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

const FEATURED_PROJECT_FEE = 50; // R$ 50
const FEATURED_DAYS = 7;

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { project_id } = await req.json();
    if (!project_id) return NextResponse.json({ error: "project_id required" }, { status: 400 });

    // Verificar que é o dono do projeto
    const { data: project, error: projError } = await supabase
      .from("projects")
      .select("client_id")
      .eq("id", project_id)
      .single();

    if (projError || project.client_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const featured_until = new Date(Date.now() + FEATURED_DAYS * 24 * 60 * 60 * 1000);

    // Atualizar projeto
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        is_featured: true,
        featured_until,
        featured_fee: FEATURED_PROJECT_FEE,
      })
      .eq("id", project_id);

    if (updateError) throw updateError;

    // Registrar evento
    await supabase.from("revenue_events").insert({
      user_id: user.id,
      project_id,
      event_type: "featured_project",
      amount: FEATURED_PROJECT_FEE,
      status: "completed",
    });

    return NextResponse.json({
      project_id,
      featured: true,
      featured_until,
      fee: FEATURED_PROJECT_FEE,
    });
  } catch (error) {
    console.error("[FEATURED ERROR]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
