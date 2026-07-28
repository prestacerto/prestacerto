import { getCategories, listOpenProjects } from "@/lib/supabase/queries";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProjectsPageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { q, categoria } = await searchParams;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categoria);

  const projects = await listOpenProjects({
    query: q,
    categoryId: category?.id,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Projetos abertos</h1>
      <p className="mt-1 text-slate-500">
        Encontre oportunidades de trabalho sem intermediários.
      </p>

      <div className="mt-6">
        <SearchFilterBar
          action="/projects"
          placeholder="Buscar por título ou habilidade..."
          query={q}
          categorySlug={categoria}
          categories={categories}
        />
      </div>

      <div className="mt-8">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            <p className="font-medium">Nenhum projeto encontrado.</p>
            <p className="mt-1 text-sm">Tente outra busca ou filtro.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{project.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {project.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="font-normal">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-end gap-4 sm:mt-0 sm:flex-col sm:text-right">
                  {(project.budget_min || project.budget_max) && (
                    <p className="text-sm font-semibold text-slate-900">
                      {project.budget_min && project.budget_max
                        ? `R$ ${project.budget_min} - R$ ${project.budget_max}`
                        : project.budget_min
                          ? `A partir de R$ ${project.budget_min}`
                          : `Até R$ ${project.budget_max}`}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    {project.proposal_count || 0} proposta{project.proposal_count !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
