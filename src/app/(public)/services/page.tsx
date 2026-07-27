import { getCategories, listServices } from "@/lib/supabase/queries";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { ServiceCard } from "@/components/services/service-card";

interface ServicesPageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { q, categoria } = await searchParams;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categoria);

  const services = await listServices({
    query: q,
    categoryId: category?.id,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Encontre freelancers
      </h1>
      <p className="mt-1 text-slate-500">
        Profissionais prontos para o seu projeto.
      </p>

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
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            <p className="font-medium">Nenhum serviço encontrado.</p>
            <p className="mt-1 text-sm">Tente outra busca ou filtro.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
