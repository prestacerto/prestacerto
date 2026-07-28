import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

interface ProjectContactParams {
  projectId: string;
}

// GET /api/project-contact/:projectId
// Retorna o contato APENAS se: usuário é o dono do projeto OU tem proposta aceita
// A RLS do Postgres garante a restrição — é só uma camada de conveniência
export async function GET(
  request: NextRequest,
  props: { params: Promise<ProjectContactParams> }
) {
  const params = await props.params;
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("project_contacts")
      .select("contact_email, contact_phone")
      .eq("project_id", params.projectId)
      .single();

    if (error) {
      // RLS bloqueou (usuário não tem permissão) = 404 por segurança
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contact" },
      { status: 500 }
    );
  }
}
