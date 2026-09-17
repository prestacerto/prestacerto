import type { MetadataRoute } from 'next';
import { CATEGORIAS } from '@/lib/data/landing-data';
import { APRENDA_CARDS } from '@/lib/data/aprenda-cards';
import { createPublicClient } from '@/lib/supabase/public';
import { siteUrl } from '@/lib/seo/metadata';
import { hasPublicProfileContent, regionalDiscoveryPaths, type DiscoveryProfile, type DiscoveryService } from '@/lib/seo/discovery';

// Listing status can change after a build (closed projects and private profiles).
// Read the public inventory afresh instead of reusing a stale build-time snapshot.
export const dynamic = 'force-dynamic';

const publicRoutes = [
  '/', '/para-clientes', '/para-prestadores', '/services', '/projects', '/como-funciona', '/contratar', '/certo-ai',
  '/aprenda', '/ferramentas/calculadora', '/ferramentas/propostas', '/plans', '/ajuda', '/contato',
  '/indicacoes', '/ecossistema', '/termos', '/termos-indicacoes', '/privacidade',
];

// Read only public, active listings. RLS still applies to every sitemap query.
async function getPublicEntries(): Promise<MetadataRoute.Sitemap> {
  const db = createPublicClient();
  const entries: MetadataRoute.Sitemap = [];
  const services: DiscoveryService[] = [];
  const profiles: DiscoveryProfile[] = [];
  // Independent tables can be read concurrently; pagination stays sequential
  // within each table so every published row is included exactly once.
  const categoriesRequest = Promise.resolve(db.from('categories').select('id, slug')).catch(() => ({ data: null }));
  await Promise.all((['services', 'profiles', 'projects'] as const).map(async table => {
    for (let offset = 0; ; offset += 1000) {
      const columns = table === 'services' ? 'id, freelancer_id, category_id' : table === 'profiles' ? 'id, full_name, bio, city, state, role' : 'id';
      let query = db.from(table).select(columns).order('id').range(offset, offset + 999);
      if (table === 'services') query = query.eq('is_active', true);
      if (table === 'profiles') query = query.in('role', ['freelancer', 'both']).not('full_name', 'is', null);
      if (table === 'projects') query = query.eq('status', 'open');
      const { data, error } = await query;
      if (error) { console.warn(`Sitemap: public ${table} unavailable`); break; }
      if (table === 'services') services.push(...(data ?? []) as unknown as DiscoveryService[]);
      if (table === 'profiles') profiles.push(...(data ?? []) as unknown as DiscoveryProfile[]);
      if (table !== 'profiles') entries.push(...((data ?? []) as unknown as Array<{ id: string }>).map(row => ({ url: `${siteUrl}/${table}/${row.id}` })));
      if (!data || data.length < 1000) break;
    }
  }));
  const { data: categories } = await categoriesRequest;
  const activeProviders = new Set(services.map(service => service.freelancer_id));
  entries.push(...profiles.filter(profile => hasPublicProfileContent(profile, activeProviders.has(profile.id))).map(profile => ({ url: `${siteUrl}/perfil/${profile.id}` })));
  entries.push(...regionalDiscoveryPaths(profiles, services, categories ?? []).map(path => ({ url: `${siteUrl}${path}` })));
  // Only published portfolios belong in discovery; draft/private portfolios do not.
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await db.from('portfolio_public').select('url_slug').eq('is_active', true).order('url_slug').range(offset, offset + 999);
    if (error) { console.warn('Sitemap: public portfolios unavailable'); break; }
    entries.push(...(data ?? []).filter(row => typeof row.url_slug === 'string' && row.url_slug).map(row => ({ url: `${siteUrl}/portfolio/${encodeURIComponent(row.url_slug)}` })));
    if (!data || data.length < 1000) break;
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    ...publicRoutes.map(path => ({ url: `${siteUrl}${path}`, ...(path === '/' ? { images: [`${siteUrl}/images/banners/prestacerto-principal.png`, `${siteUrl}/images/banners/prestacerto-profissionais.png`] } : {}) })),
    ...Object.keys(CATEGORIAS).map(slug => ({ url: `${siteUrl}/contratar/${slug}` })),
    ...APRENDA_CARDS.map(card => ({ url: `${siteUrl}/aprenda/${card.id}` })),
  ];
  // No fabricated lastmod dates. Add them only when an actual content timestamp exists.
  // Regional hiring pages require matching local services. Generic regional
  // signup pages and market pages without a sample are intentionally omitted.
  try { entries.push(...await getPublicEntries()); } catch { console.warn('Sitemap: public listings unavailable'); }
  return Array.from(new Map(entries.map(entry => [entry.url, entry])).values());
}
