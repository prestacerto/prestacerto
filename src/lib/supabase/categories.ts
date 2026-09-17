import 'server-only';
import { unstable_cache } from 'next/cache';
import { createPublicClient } from './public';
import { SUPABASE_URL } from './config';
import type { Category } from './types';

// Only the anonymous, RLS-visible catalogue is shared. No session, profile or
// account-specific query belongs inside this cache. The URL isolates projects.
const readCategories = unstable_cache(async (): Promise<Category[]> => {
  const { data, error } = await createPublicClient()
    .from('categories')
    .select('id, slug, name, sort_order')
    .order('sort_order')
    .order('id')
    .abortSignal(AbortSignal.timeout(5000));
  if (error) throw error;
  return data ?? [];
}, ['public-categories-v1', SUPABASE_URL], { revalidate: 300, tags: ['public-categories'] });

export async function getPublicCategories(): Promise<Category[]> {
  try {
    return await readCategories();
  } catch (error) {
    // Do not persist a transient database failure as a successful empty result.
    console.error('getCategories falhou:', error);
    return [];
  }
}
