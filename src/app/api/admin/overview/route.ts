import { NextRequest, NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/auth/admin';
import { createServiceClient, hasServiceCredentials } from '@/lib/supabase/service';
import { isAssinyCheckoutReady } from '@/lib/payments/assiny-readiness';
import type { OwnerOverview } from '@/lib/admin/owner-types';

export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };

export async function GET(request: NextRequest) {
  const admin = await getAdminContext();
  if (!admin || admin.role !== 'super_admin') {
    return NextResponse.json({ error: 'Acesso restrito ao dono da plataforma.' }, { status: 403, headers });
  }
  const requested = Number(request.nextUrl.searchParams.get('days') ?? 30);
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  const now = new Date();
  const since = new Date(now.getTime() - days * 86400000).toISOString();
  const database = hasServiceCredentials();
  const overview: OwnerOverview = {
    generatedAt: now.toISOString(), days, state: database ? 'ready' : 'not_configured',
    counts: { profiles: null, newProfiles: null, freelancers: null, clients: null, projects: null, openProjects: null, newProjects: null, proposals: null, newProposals: null, acceptedProposals: null, activeServices: null, free: null, pro: null, business: null, pendingSubscriptions: null },
    recentProfiles: [], recentProjects: [],
    integrations: {
      database,
      webhook: Boolean(process.env.ASSINY_WEBHOOK_SECRET || process.env.ASSINY_WEBHOOK_SECRET),
      checkout: isAssinyCheckoutReady(),
      analytics: Boolean(process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || process.env.NEXT_PUBLIC_GTM_ID),
      searchConsole: Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
    },
    notices: [],
  };
  if (!database) {
    overview.notices.push({ title: 'Acesso administrativo ao banco pendente', description: 'É necessário configurar a credencial privada do projeto Supabase para carregar os indicadores. A ausência de dados aparece como “—”.' });
  } else {
    try {
      const db = createServiceClient();
      const counts = await Promise.all([
        db.from('profiles').select('id', { count: 'exact', head: true }),
        db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', since),
        db.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['freelancer', 'both']),
        db.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['client', 'both']),
        db.from('projects').select('id', { count: 'exact', head: true }),
        db.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        db.from('projects').select('id', { count: 'exact', head: true }).gte('created_at', since),
        db.from('proposals').select('id', { count: 'exact', head: true }),
        db.from('proposals').select('id', { count: 'exact', head: true }).gte('created_at', since),
        db.from('proposals').select('id', { count: 'exact', head: true }).eq('status', 'accepted').gte('created_at', since),
        db.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true),
        db.from('profiles').select('id', { count: 'exact', head: true }).or('plan.eq.free,plan.is.null'),
        db.from('profiles').select('id', { count: 'exact', head: true }).eq('plan', 'pro'),
        db.from('profiles').select('id', { count: 'exact', head: true }).eq('plan', 'business'),
        db.from('pending_subscriptions').select('email', { count: 'exact', head: true }),
      ]);
      const keys = ['profiles', 'newProfiles', 'freelancers', 'clients', 'projects', 'openProjects', 'newProjects', 'proposals', 'newProposals', 'acceptedProposals', 'activeServices', 'free', 'pro', 'business', 'pendingSubscriptions'] as const;
      counts.forEach((result, index) => {
        overview.counts[keys[index]] = result.error ? null : result.count;
        if (result.error) overview.state = 'partial';
      });
      const [profiles, projects] = await Promise.all([
        db.from('profiles').select('id, full_name, role, city, created_at').order('created_at', { ascending: false }).limit(8),
        db.from('projects').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(8),
      ]);
      overview.recentProfiles = profiles.data ?? [];
      overview.recentProjects = projects.data ?? [];
      if (profiles.error || projects.error) overview.state = 'partial';
      if (overview.state === 'partial') overview.notices.push({ title: 'Parte dos indicadores está indisponível', description: 'Algumas consultas não responderam. Os dados que puderam ser lidos continuam visíveis; os demais aparecem como “—”.' });
    } catch {
      overview.state = 'partial';
      overview.notices.push({ title: 'Não foi possível consultar o banco agora', description: 'Tente atualizar novamente. Nenhuma estimativa substitui os indicadores indisponíveis.' });
    }
  }
  if (!overview.integrations.checkout) overview.notices.push({ title: 'Novas assinaturas ainda não estão liberadas', description: 'A liberação exige acesso ao banco, autenticação do webhook e validação de um pagamento antes de ativar os botões.' });
  overview.notices.push({ title: 'Receita depende de conciliação', description: 'Os planos registrados nos perfis não comprovam recebimentos. O painel não calcula receita multiplicando o número de perfis pelo preço de tabela.' });
  return NextResponse.json(overview, { headers });
}
