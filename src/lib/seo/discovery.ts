import { CATEGORIAS, CIDADES } from '../data/landing-data';

export type DiscoveryProfile = { id: string; full_name: string | null; bio: string | null; city: string | null; state: string | null; role: string };
export type DiscoveryService = { id: string; freelancer_id: string; category_id: number | null };
export type DiscoveryCategory = { id: number; slug: string };

export function hasPublicProfileContent(profile: Pick<DiscoveryProfile, 'full_name' | 'bio'>, hasActiveServices: boolean): boolean {
  return Boolean(profile.full_name?.trim() && (profile.bio?.trim() || hasActiveServices));
}

// Local landing pages are discoverable only when a matching professional
// actually offers an active service there. A city name alone is not inventory.
export function regionalDiscoveryPaths(profiles: DiscoveryProfile[], services: DiscoveryService[], categories: DiscoveryCategory[]): string[] {
  const profilesById = new Map(profiles.map(profile => [profile.id, profile]));
  const categoriesById = new Map(categories.map(category => [category.id, category.slug]));
  const paths = new Set<string>();
  for (const service of services) {
    const profile = profilesById.get(service.freelancer_id);
    const category = service.category_id == null ? undefined : categoriesById.get(service.category_id);
    if (!profile || !profile.full_name?.trim() || !['freelancer', 'both'].includes(profile.role) || !category || !Object.hasOwn(CATEGORIAS, category)) continue;
    const city = Object.entries(CIDADES).find(([, item]) => item.name.toLocaleLowerCase('pt-BR') === profile.city?.trim().toLocaleLowerCase('pt-BR') && item.state === profile.state?.trim().toUpperCase());
    if (city) paths.add(`/contratar/${category}/${city[0]}`);
  }
  return [...paths].sort();
}

export function indexingRobots(index: boolean) {
  return { index, follow: true, googleBot: { index, follow: true } };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
