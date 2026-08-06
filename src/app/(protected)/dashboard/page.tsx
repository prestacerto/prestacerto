import Link from "next/link";
import { Briefcase, Send, Star, ArrowRight, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { getMyProjects, getMyProposals, getMyServices } from "@/lib/firebase/queries";

export const metadata = { title: "Dashboard — PrestaCerto" };

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const [profile, projects, proposals, services] = await Promise.all([
    getProfile(),
    getMyProjects(user.id),
    getMyProposals(user.id),
    getMyServices(user.id),
  ]);

  const openProjects = projects.filter((p) => p.status === "open").length;
  const pendingProposals = proposals.filter((p) => p.status === "pending").length;
  const activeServices = services.filter((s) => s.is_active).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Olá, {profile?.full_name?.split(" ")[0] ?? "tudo bem"}
      </h1>
      <p className="mt-1 text-slate-500">
        Aqui está um resumo da sua conta na PrestaCerto.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Wrench className="size-4" />
              Meus serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{services.length}</p>
            <p className="text-sm text-slate-500">{activeServices} ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Briefcase className="size-4" />
              Meus projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
            <p className="text-sm text-slate-500">{openProjects} em aberto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Send className="size-4" />
              Minhas propostas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{proposals.length}</p>
            <p className="text-sm text-slate-500">{pendingProposals} pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Star className="size-4" />
              Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">
              {profile?.rating ? profile.rating.toFixed(1) : "—"}
            </p>
            <p className="text-sm text-slate-500">
              {profile?.rating_count ?? 0} avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/dashboard/projects/new">
          Publicar projeto
          <ArrowRight className="size-4" />
        </LinkButton>
        <LinkButton href="/services" variant="outline">
          Explorar freelancers
        </LinkButton>
      </div>

      {profile?.plan === "free" && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                Você está no plano Grátis
              </p>
              <p className="text-sm text-slate-500">
                Assine o Pro pra ter propostas ilimitadas e badge de verificado.
              </p>
            </div>
            <Link
              href="/plans"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Ver planos
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
