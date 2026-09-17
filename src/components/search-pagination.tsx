import Link from 'next/link';
import { searchPageHref } from '@/lib/search-pagination';

export function SearchPagination({ path, page, hasNext, query, categorySlug }: {
  path: '/services' | '/projects'; page: number; hasNext: boolean; query: string; categorySlug: string;
}) {
  if (page === 1 && !hasNext) return null;
  const button = 'inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:border-blue-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
  return (
    <nav aria-label="Paginação dos resultados" className="mt-8 flex flex-wrap items-center justify-center gap-4">
      {page > 1 && <Link className={button} href={searchPageHref(path, page - 1, query, categorySlug)} rel="prev">Anterior</Link>}
      <span className="text-sm text-slate-600">Página {page}</span>
      {hasNext && <Link className={button} href={searchPageHref(path, page + 1, query, categorySlug)} rel="next">Próxima</Link>}
    </nav>
  );
}
