import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AcceptProposalButton } from "@/components/accept-proposal-button";
import { CompleteProjectButton } from "@/components/complete-project-button";
import { HighlightProjectTrigger } from "@/components/monetization/highlight-project-trigger";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getProjectById, getProposalsForProject } from "@/lib/supabase/queries";

interface DashboardProjectDetailProps {
  params: Promise<{ id: string }>;
}

const proposalStatusLabel: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceita",
  rejected: "Recusada",
  withdrawn: "Retirada",
};

export default async function DashboardProjectDetailPage({
  params,
}: DashboardProjectDetailProps) {
  const { id } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const project = await getProjectById(id);
  if (!project) notFound();
  if (project.client_id !== user.id) redirect("/dashboard/projects");

  const proposals = await getProposalsForProject(id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="secondary">{project.status}</Badge>
        {project.status === "open" && (
          <HighlightProjectTrigger
            projectId={project.id}
            isFeatured={project.is_featured}
            featuredUntil={project.featured_until}
          />
        )}
      </div>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{project.title}</h1>
      <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
        {project.description}
      </p>

      {project.status === "in_progress" && (
        <Card className="mt-6 p-5">
          <p className="font-medium text-slate-900">Projeto em andamento</p>
          <p className="mt-1 text-sm text-slate-500">
            Quando o freelancer entregar o combinado, marque como concluído.
            Se houver um pagamento retido, ele é liberado pro freelancer nesse
            momento — e a avaliação é destravada pros dois lados.
          </p>
          <div className="mt-4">
            <CompleteProjectButton projectId={project.id} />
          </div>
        </Card>
      )}

      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <MessageSquare className="size-4" />
          Propostas recebidas ({proposals.length})
        </h2>

        {proposals.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nenhuma proposta ainda.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {proposals.map((proposal) => (
              <li key={proposal.id}>
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {proposal.freelancer?.full_name ?? "Freelancer"}
                      </p>
                      {proposal.freelancer?.rating != null && (
                        <p className="text-xs text-slate-500">
                          ⭐ {proposal.freelancer.rating.toFixed(1)} (
                          {proposal.freelancer.rating_count})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {proposal.proposed_price != null && (
                        <p className="font-semibold text-slate-900">
                          R$ {proposal.proposed_price}
                        </p>
                      )}
                      <Badge variant="secondary" className="mt-1">
                        {proposalStatusLabel[proposal.status] ?? proposal.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{proposal.message}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {project.status === "open" && proposal.status === "pending" && (
                      <AcceptProposalButton proposalId={proposal.id} />
                    )}
                    <Link
                      href={`/dashboard/messages/${proposal.id}`}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <MessageCircle className="size-4" />
                      Conversar
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
