export const SEARCH_PAGE_SIZE = 24;

type SearchValue = string | string[] | undefined;
export type SearchParams = { q?: SearchValue; categoria?: SearchValue; page?: SearchValue };

export function readSearchParams(params: SearchParams) {
  const value = (entry: SearchValue) => typeof entry === 'string' ? entry : entry?.[0] ?? '';
  const rawPage = value(params.page);
  return {
    query: value(params.q).trim().slice(0, 100),
    categorySlug: value(params.categoria).trim().slice(0, 100),
    page: /^\d+$/.test(rawPage) ? Math.min(10000, Math.max(1, Number(rawPage))) : 1,
  };
}

export function searchPageHref(path: '/services' | '/projects', page: number, query: string, categorySlug: string) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (categorySlug) params.set('categoria', categorySlug);
  if (page > 1) params.set('page', String(page));
  return params.size ? `${path}?${params}` : path;
}

// Quotes keep punctuation inside a filter value, rather than PostgREST syntax.
// The array literal is escaped once for PostgreSQL and again for PostgREST.
export function searchTextFilter(query: string) {
  const term = query.trim().slice(0, 100);
  const quote = (value: string) => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  const pattern = quote(`%${term}%`);
  const skillArray = quote(`{${quote(term)}}`);
  return `title.ilike.${pattern},description.ilike.${pattern},skills.cs.${skillArray}`;
}
