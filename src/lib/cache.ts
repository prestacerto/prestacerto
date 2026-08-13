import { cache } from 'react';

export const CACHE_TAGS = {
  SERVICES: 'services',
  PROJECTS: 'projects',
  CATEGORIES: 'categories',
  PROFILES: 'profiles',
  PROPOSALS: 'proposals',
} as const;

export const CACHE_DURATIONS = {
  INSTANT: 0,
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

interface CacheOptions {
  revalidate?: number | false;
  tags?: string[];
}

export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: CacheOptions = {}
): T {
  return cache(fn) as T;
}

export const getServices = withCache(
  async (limit?: number) => {
    // Implementation will use Supabase
    return [];
  },
  { tags: [CACHE_TAGS.SERVICES] }
);

export const getProjects = withCache(
  async (limit?: number) => {
    // Implementation will use Supabase
    return [];
  },
  { tags: [CACHE_TAGS.PROJECTS] }
);

export const getCategories = withCache(
  async () => {
    // Implementation will use Supabase
    return [];
  },
  { tags: [CACHE_TAGS.CATEGORIES], revalidate: CACHE_DURATIONS.VERY_LONG }
);
