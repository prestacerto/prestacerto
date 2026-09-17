import { cache } from 'react';
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getCategories, listOpenProjects } from "@/lib/supabase/queries";
import { getPageMetadata, getNoIndexMetadata } from "@/lib/seo/metadata";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { StructuredData, getCollectionPageSchema } from "@/components/structured-data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { indexingRobots } from "@/lib/seo/discovery";
import { readSearchParams, searchPageHref, SEARCH_PAGE_SIZE, type SearchParams } from '@/lib/search-pagination';
import { SearchPagination } from '@/components/search-pagination';

const baseMetadata: Metadata = getPageMetadata(
  "Projetos freelancer e oportunidades de trabalho",
  "Encontre projetos abertos, publique sua proposta e trabalhe com clientes no Brasil. Busque por categoria, habilidade e tipo de serviço no PrestaCerto.",
  "/projects",
);

interface ProjectsPageProps {
  searchParams: Promise<SearchParams>;
}

// Request-local deduplication: metadata and the page must describe the same
// inventory without doubling Supabase reads or caching private data globally.
const getSearchPage = cache(async (query: string, categorySlug: string, page: number) => {
  const categories = await getCategories();
  const category = categories.find(item => item.slug === categorySlug);
  const results = categorySlug && !category ? [] : await listOpenProjects({ query, categoryId: category?.id, page });
  return { categories, results };
});

export async function generateMetadata({ searchParams }: ProjectsPageProps): Promise<Metadata> {
  const { query, categorySlug, page } = readSearchParams(await searchParams);
  if (page > 1) {
    const { results } = await getSearchPage(query, categorySlug, page);
    if (results.length === 0) return getNoIndexMetadata("Página de projetos não encontrada");
  }
  return {
    ...baseMetadata,
    alternates: { canonical: searchPageHref('/projects', page, '', '') },
    openGraph: { ...baseMetadata.openGraph, url: searchPageHref('/projects', page, '', '') },
    ...((query || categorySlug) ? { robots: indexingRobots(false) } : {}),
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { query: q, categorySlug: categoria, page } = readSearchParams(await searchParams);
  const { categories, results } = await getSearchPage(q, categoria, page);
  const hasNext = results.length > SEARCH_PAGE_SIZE;
  if (page > 1 && results.length === 0) notFound();
  const projects = results.slice(0, SEARCH_PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <StructuredData
        type="CollectionPage"
        data={getCollectionPageSchema({
          name: "Projetos freelancer e oportunidades de trabalho",
          description:
            "Encontre projetos freelancer abertos, envie propostas e descubra oportunidades de trabalho no PrestaCerto.",
          url: `https://prestacerto.com.br${searchPageHref('/projects', page, '', '')}`,
        })}
      />
      <section className="rounded-3xl border border-blue-100 bg-[#f4f7ff] px-5 py-8 sm:px-8 sm:py-10">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700"><BriefcaseBusiness className="size-4" /> Para quem quer colocar talento em movimento</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Projetos freelancer e oportunidades de trabalho</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Procure algo que combine com o que você sabe fazer. Quando encontrar, envie uma proposta clara e combine diretamente com o cliente.</p>
      </section>

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
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center text-slate-500">
            <p className="font-bold text-slate-900">Nenhum projeto aberto corresponde a esta busca.</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6">Isso reflete a atividade real neste momento. Limpe os filtros para ver outras áreas ou deixe seu perfil pronto para futuras oportunidades.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/projects" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">Limpar filtros</Link><Link href="/register?role=freelancer" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">Criar perfil gratuito <ArrowRight className="ml-2 size-4" /></Link></div>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <SearchPagination path="/projects" page={page} hasNext={hasNext} query={q} categorySlug={categoria} />
    </div>
  );
}
