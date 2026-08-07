import Link from "next/link";
import { Sparkles, Clock, DollarSign } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { daysUntil } from "@/lib/utils";

export const revalidate = 0;

export default async function ForYouPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Pega skills do freela a partir dos serviços ativos
  const { data: services } = await supabase
    .from("services")
    .select("skills")
    .eq("freelancer_id", user.id)
    .eq("is_active", true);

  const mySkills = [...new Set((services ?? []).flatMap((s) => s.skills ?? []))];

  // Projetos abertos que fazem overlap com as skills do freela
  const { data: projects } = await supabase
    .from("projects")
    .select(
      "id, title, description, skills, budget_min, budget_max, deadline_days, created_at, category_id"
    )
    .eq("status", "open")
    .overlaps("skills", mySkills.length > 0 ? mySkills : ["__none__"])
    .order("created_at", { ascending: false })
    .limit(30);

  // Ordena por quantidade de skills em comum (mais relevante primeiro)
  const scored = (projects ?? [])
    .map((p) => ({
      ...p,
      matchCount: (p.skills ?? []).filter((s: string) => mySkills.includes(s)).length,
    }))
    .sort((a, b) => b.matchCount - a.matchCount || (b.created_at > a.created_at ? 1 : -1));

  const newToday = scored.filter(
    (p) => Date.now() - new Date(p.created_at).getTime() < 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="size-5 text-blue-600" />
            Projetos pra você
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtrado pelas suas skills: {mySkills.length > 0 ? mySkills.slice(0, 4).join(", ") : "nenhuma cadastrada ainda"}
            {mySkills.length > 4 && ` e mais ${mySkills.length - 4}`}
          </p>
        </div>
        {newToday > 0 && (
          <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
            {newToday} novo{newToday > 1 ? "s" : ""} hoje
          </span>
        )}
      </div>

      {mySkills.length === 0 && (
        <Card className="border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950">
          <p className="text-sm text-amber-900 dark:text-amber-300">
            Você ainda não tem serviços cadastrados. Cadastre seus serviços com as skills que domina
            e a gente filtra os projetos mais relevantes pra você.
          </p>
          <LinkButton href="/dashboard/services" className="mt-3">
            Cadastrar serviços
          </LinkButton>
        </Card>
      )}

      {scored.length === 0 && mySkills.length > 0 && (
        <Card className="p-8 text-center">
          <p className="text-slate-500">Nenhum projeto aberto com suas skills no momento.</p>
          <p className="mt-1 text-sm text-slate-400">
            A gente te avisa quando surgir um — volte em breve.
          </p>
          <LinkButton href="/projects" variant="outline" className="mt-4">
            Ver todos os projetos
          </LinkButton>
        </Card>
      )}

      <ul className="space-y-3">
        {scored.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.id}`}>
              <Card className="p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    {project.title}
                  </h2>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {project.matchCount} skill{project.matchCount !== 1 ? "s" : ""} em comum
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(project.skills ?? []).map((skill: string) => (
                    <Badge
                      key={skill}
                      variant={mySkills.includes(skill) ? "default" : "secondary"}
                      className="font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  {(project.budget_min || project.budget_max) && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="size-3.5" />
                      {project.budget_min && project.budget_max
                        ? `R$ ${project.budget_min} – ${project.budget_max}`
                        : project.budget_min
                          ? `A partir de R$ ${project.budget_min}`
                          : `Até R$ ${project.budget_max}`}
                    </span>
                  )}
                  {project.deadline_days && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {project.deadline_days} dias
                    </span>
                  )}
                  <span className="ml-auto text-xs text-slate-400">
                    {daysUntil(project.created_at) === 0
                      ? "Publicado hoje"
                      : `Há ${Math.abs(daysUntil(project.created_at))} dia${Math.abs(daysUntil(project.created_at)) > 1 ? "s" : ""}`}
                  </span>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
