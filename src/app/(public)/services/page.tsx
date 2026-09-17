import { cache } from 'react';
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getCategories, listServices } from "@/lib/supabase/queries";
import { getPageMetadata, getNoIndexMetadata } from "@/lib/seo/metadata";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { ServiceCard } from "@/components/services/service-card";
import { StructuredData, getCollectionPageSchema } from "@/components/structured-data";
import Link from "next/link";
import { ArrowRight, SearchCheck } from "lucide-react";
import { indexingRobots } from "@/lib/seo/discovery";
import { readSearchParams, searchPageHref, SEARCH_PAGE_SIZE, type SearchParams } from '@/lib/search-pagination';
import { SearchPagination } from '@/components/search-pagination';

const baseMetadata: Metadata = getPageMetadata(
  "Encontrar freelancers e prestadores de serviços",
  "Busque freelancers e prestadores de serviços por categoria, habilidade e projeto. Compare perfis e encontre o profissional certo no PrestaCerto.",
  "/services",
);

interface ServicesPageProps {
  searchParams: Promise<SearchParams>;
}

// Request-local deduplication: metadata and the page must describe the same
// inventory without doubling Supabase reads or caching private data globally.
const getSearchPage = cache(async (query: string, categorySlug: string, page: number) => {
  const categories = await getCategories();
  const category = categories.find(item => item.slug === categorySlug);
  const results = categorySlug && !category ? [] : await listServices({ query, categoryId: category?.id, page });
  return { categories, results };
});

export async function generateMetadata({ searchParams }: ServicesPageProps): Promise<Metadata> {
  const { query, categorySlug, page } = readSearchParams(await searchParams);
  if (page > 1) {
    const { results } = await getSearchPage(query, categorySlug, page);
    if (results.length === 0) return getNoIndexMetadata("Página de serviços não encontrada");
  }
  return {
    ...baseMetadata,
    alternates: { canonical: searchPageHref('/services', page, '', '') },
    openGraph: { ...baseMetadata.openGraph, url: searchPageHref('/services', page, '', '') },
    ...((query || categorySlug) ? { robots: indexingRobots(false) } : {}),
  };
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { query: q, categorySlug: categoria, page } = readSearchParams(await searchParams);
  const { categories, results } = await getSearchPage(q, categoria, page);
  const hasNext = results.length > SEARCH_PAGE_SIZE;
  if (page > 1 && results.length === 0) notFound();
  const services = results.slice(0, SEARCH_PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <StructuredData
        type="CollectionPage"
        data={getCollectionPageSchema({
          name: "Encontrar freelancers e prestadores de serviços",
          description:
            "Busque freelancers e prestadores de serviços por categoria, habilidade e projeto no PrestaCerto.",
          url: `https://prestacerto.com.br${searchPageHref('/services', page, '', '')}`,
        })}
      />
      <section className="rounded-3xl border border-blue-100 bg-[#f4f7ff] px-5 py-8 sm:px-8 sm:py-10">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700"><SearchCheck className="size-4" /> Um jeito mais tranquilo de escolher</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Encontre freelancers e prestadores de serviços</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Busque por habilidade, categoria ou tipo de entrega. Compare as informações que importam e comece a conversa com mais segurança.</p>
      </section>

      <div className="mt-6">
        <SearchFilterBar
          action="/services"
          placeholder="Buscar por título ou habilidade..."
          query={q}
          categorySlug={categoria}
          categories={categories}
        />
      </div>

      <div className="mt-8">
        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 sm:px-8 sm:py-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-bold text-slate-900">Ainda não encontramos um serviço com esses filtros.</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">Você pode tentar outra categoria, publicar o que precisa ou contar ao Cadu qual resultado quer alcançar.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/publicar-projeto" className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">Publicar um projeto <ArrowRight className="ml-2 size-4" /></Link>
                <Link href="/?cadu=1" className="inline-flex min-h-11 items-center rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50">Falar com o Cadu</Link>
              </div>
            </div>
            {categories.length > 0 && <div className="mx-auto mt-8 max-w-2xl border-t border-slate-100 pt-6"><p className="text-center text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Explore uma categoria</p><div className="mt-3 flex flex-wrap justify-center gap-2">{categories.slice(0, 8).map(category => <Link key={category.id} href={`/services?categoria=${encodeURIComponent(category.slug)}`} className="min-h-11 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">{category.name}</Link>)}</div></div>}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
      <SearchPagination path="/services" page={page} hasNext={hasNext} query={q} categorySlug={categoria} />
    </div>
  );
}
