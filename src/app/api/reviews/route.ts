import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { readJsonObject } from "@/lib/http/request-body";

const reviewInput = z.object({
  projectId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).nullable().optional(),
}).strict();
const unavailable = () => NextResponse.json(
  { error: "Não foi possível salvar sua avaliação agora. Seus dados foram mantidos; tente novamente." },
  { status: 503 },
);

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Entre na sua conta para avaliar." }, { status: 401 });
    const body = await readJsonObject(request, 12000);
    if (body.response) return body.response;
    const input = reviewInput.safeParse(body.data);
    if (!input.success) return NextResponse.json({ error: "Informe o projeto, uma nota inteira de 1 a 5 e um comentário de até 2.000 caracteres." }, { status: 400 });

    const supabase = await createClient();
    const { data: project, error: projectError } = await supabase.from("projects")
      .select("id, client_id, status").eq("id", input.data.projectId).maybeSingle();
    if (projectError) return unavailable();
    if (!project) return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    if (user.id !== project.client_id) return NextResponse.json({ error: "Somente o cliente deste projeto pode avaliar o profissional." }, { status: 403 });
    if (project.status !== "closed") return NextResponse.json({ error: "Conclua o projeto depois de receber a entrega para publicar sua avaliação." }, { status: 409 });

    const { data: proposal, error: proposalError } = await supabase.from("proposals")
      .select("freelancer_id").eq("project_id", project.id).eq("status", "accepted").maybeSingle();
    if (proposalError) return unavailable();
    if (!proposal?.freelancer_id || proposal.freelancer_id === user.id) {
      return NextResponse.json({ error: "Este projeto não tem um profissional com proposta aceita para avaliar." }, { status: 409 });
    }

    // The database rechecks ownership/completion under row locks and enforces
    // uniqueness. Relationship IDs are derived from authenticated data.
    const { data: review, error } = await supabase.from("reviews").insert({
      project_id: project.id, author_id: user.id, target_id: proposal.freelancer_id,
      rating: input.data.rating, comment: input.data.comment || null,
    }).select("id, rating, comment, created_at").single();
    if (error?.code === "23505") return NextResponse.json({ error: "Este projeto já recebeu sua avaliação." }, { status: 409 });
    if (error?.code === "42501") return NextResponse.json({ error: "O projeto não está disponível para avaliação pela sua conta. Atualize a página." }, { status: 403 });
    if (error || !review?.id) return unavailable();
    return NextResponse.json({ success: true, review: { id: review.id } }, { status: 201 });
  } catch {
    return unavailable();
  }
}
