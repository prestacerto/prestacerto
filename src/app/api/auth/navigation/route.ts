import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

// Presentation hints only. Protected pages, actions and RLS retain their own checks.
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && error.name !== 'AuthSessionMissingError') throw new Error('auth_unavailable');
    if (!user) return Response.json({ signedIn: false, role: null }, { headers });

    const { data: profile, error: profileError } = await supabase.from('profiles')
      .select('role').eq('id', user.id).maybeSingle();
    if (profileError) throw new Error('profile_unavailable');
    const candidate = profile?.role ?? user.user_metadata?.role;
    const role = candidate === 'client' || candidate === 'freelancer' || candidate === 'both' ? candidate : null;
    return Response.json({ signedIn: true, role }, { headers });
  } catch {
    return Response.json({ error: 'navigation_unavailable' }, { status: 503, headers });
  }
}
