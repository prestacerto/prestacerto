import Link from "next/link";
import { Briefcase, Plus, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/link-button";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getMyProjects } from "@/lib/supabase/queries";

export const metadata = { title: "Meus projetos — Dashboard PrestaCerto" };

const statusLabel: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  closed: "Encerrado",
  cancelled: "Cancelado",
};

export default async function DashboardProjectsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const projects = await getMyProjects(user.id);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus projetos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Projetos que você publicou como cliente.
          </p>
        </div>
        <LinkButton href="/dashboard/projects/new" size="sm">
          <Plus className="size-4" />
          Publicar
        </LinkButton>
      </div>

      {projects.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Briefcase className="size-6" />
          </span>
          <p className="mt-4 font-medium text-slate-700">
            Você ainda não publicou nenhum projeto.
          </p>
          <LinkButton href="/dashboard/projects/new" className="mt-4">
            Publicar meu primeiro projeto
          </LinkButton>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="flex flex-col gap-3 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Badge variant="secondary">
                    {statusLabel[project.status] ?? project.status}
                  </Badge>
                  <h3 className="mt-2 font-semibold text-slate-900">{project.title}</h3>
                </div>
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <MessageSquare className="size-4" />
                  {project.proposal_count} propost
                  {project.proposal_count === 1 ? "a" : "as"}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
