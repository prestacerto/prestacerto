import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { PROJECT_CATEGORIES, projectInsertPayload, validatePublication } from '@/lib/projects/publication';
import { readJsonObject } from '@/lib/http/request-body';
import { rateLimiters, rateLimitResponse } from '@/lib/rate-limit';

function databaseErrorDetails(error: unknown) {
  if (error && typeof error === 'object') {
    const value = error as Record<string, unknown>;
    return {
      code: typeof value.code === 'string' ? value.code : 'UNKNOWN',
      message: typeof value.message === 'string' ? value.message : 'Database operation failed',
      details: typeof value.details === 'string' ? value.details : undefined,
      hint: typeof value.hint === 'string' ? value.hint : undefined,
    };
  }

  return { code: 'UNKNOWN', message: error instanceof Error ? error.message : 'Database operation failed' };
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: 'Entre na sua conta para publicar. Seu rascunho foi preservado.' }, { status: 401 });
  const limit = await rateLimiters.projects.limit(user.id);
  if (!limit.success) return rateLimitResponse(limit.reset);
  const input = await readJsonObject(request);
  if (input.response) return input.response;
  const parsed = validatePublication(input.data);
  if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 });
  try {
    // Writes use the authenticated session and the database's ownership policies.
    const db = await createClient();
    const queryProfile = () => db.from('profiles').select('id, role').eq('id', user.id).maybeSingle();
    let { data: profile, error: profileError } = await queryProfile();
    if (profileError) throw profileError;
    if (!profile) {
      const role = ['client', 'both', 'freelancer'].includes(user.user_metadata?.role) ? user.user_metadata.role : 'client';
      const { error } = await db.from('profiles').insert({ id: user.id, role, full_name: typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim() ? user.user_metadata.full_name.trim().slice(0,80) : 'Novo cliente' });
      if (error && error.code !== '23505') throw error;
      ({ data: profile, error: profileError } = await queryProfile());
      if (profileError || !profile) throw profileError || new Error('PROFILE_UNAVAILABLE');
    }
    if (profile.role === 'freelancer' && parsed.data.alsoHire) {
      const { data: updated, error } = await db.from('profiles').update({ role: 'both' }).eq('id', user.id).eq('role', 'freelancer').select('id, role').single();
      // The project ownership policy already authorizes this write by client_id.
      // A stale profile-update policy must not make a confirmed client lose a
      // project publication; the role update can be completed later.
      if (error || !updated) {
        console.warn('[project-publication] Profile role update deferred', databaseErrorDetails(error || new Error('PROFILE_ROLE_UNAVAILABLE')));
        profile = { ...profile, role: 'both' };
      } else {
        profile = updated;
      }
    }
    if (!['client', 'both'].includes(profile.role)) return NextResponse.json({ error: 'Para publicar, confirme que também deseja contratar profissionais com esta conta.' }, { status: 403 });
    let categoryId: number | null = null;
    const slug = PROJECT_CATEGORIES[parsed.data.category];
    if (slug) {
      const { data, error } = await db.from('categories').select('id').eq('slug', slug).maybeSingle();
      if (error) throw error;
      categoryId = data?.id ?? null;
    }
    // One insertion only. Do not retry a successful write against guessed schemas.
    const { data: project, error } = await db.from('projects').insert(projectInsertPayload(user.id, categoryId, parsed.data)).select('id, title, status').single();
    if (error || !project) throw error || new Error('PROJECT_UNAVAILABLE');
    revalidatePath('/projects'); revalidatePath('/dashboard');
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('[project-publication] Database operation failed', databaseErrorDetails(error));
    return NextResponse.json({ error: 'Não foi possível salvar o projeto agora. Seu rascunho continua disponível para tentar novamente.' }, { status: 503 });
  }
}
