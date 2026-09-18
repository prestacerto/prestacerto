import { createServiceClient, hasServiceCredentials } from '@/lib/supabase/service';

const PLAN_PRICE = { pro: 59.9, business: 99.9 } as const;

function startOfTodayBRT() {
  const now = new Date();
  const brt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  brt.setHours(0, 0, 0, 0);
  const offsetMs = now.getTime() - new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getTime();
  return new Date(brt.getTime() + offsetMs).toISOString();
}

function greeting() {
  const hour = Number(new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', hour12: false, timeZone: 'America/Sao_Paulo' }).format(new Date()));
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

async function loadBriefing() {
  const db = createServiceClient();
  const today = startOfTodayBRT();
  const count = (table: string) => db.from(table).select('id', { count: 'exact', head: true });

  const [
    clientsToday, freelancersToday, proposalsToday, acceptedToday, projectsToday,
    urgentOpen, openProjects, freelancersTotal, clientsTotal, proPlans, businessPlans,
  ] = await Promise.all([
    count('profiles').in('role', ['client', 'both']).gte('created_at', today),
    count('profiles').in('role', ['freelancer', 'both']).gte('created_at', today),
    count('proposals').gte('created_at', today),
    count('proposals').eq('status', 'accepted').gte('created_at', today),
    count('projects').gte('created_at', today),
    count('projects').eq('status', 'open').or('urgency.ilike.urg%,deadline_days.lte.7'),
    count('projects').eq('status', 'open'),
    count('profiles').in('role', ['freelancer', 'both']),
    count('profiles').in('role', ['client', 'both']),
    count('profiles').eq('plan', 'pro'),
    count('profiles').eq('plan', 'business'),
  ]);

  const n = (r: { count: number | null; error: unknown }) => (r.error ? null : r.count ?? 0);
  const pro = n(proPlans) ?? 0;
  const business = n(businessPlans) ?? 0;

  return {
    clientsToday: n(clientsToday), freelancersToday: n(freelancersToday),
    proposalsToday: n(proposalsToday), acceptedToday: n(acceptedToday),
    projectsToday: n(projectsToday), urgentOpen: n(urgentOpen), openProjects: n(openProjects),
    freelancersTotal: n(freelancersTotal), clientsTotal: n(clientsTotal),
    pro, business, mrr: pro * PLAN_PRICE.pro + business * PLAN_PRICE.business,
  };
}

const fmt = (v: number | null) => (v === null ? '—' : v.toLocaleString('pt-BR'));
const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export async function TodayBriefing({ viewerName }: { viewerName: string }) {
  if (!hasServiceCredentials()) {
    return (
      <div className="rounded-xl border border-red-800 bg-red-900/20 p-4 text-sm text-red-100">
        Sem credencial de servidor do Supabase — o briefing em tempo real não pôde ser carregado.
      </div>
    );
  }

  const b = await loadBriefing();
  const helped = (b.proposalsToday ?? 0) + (b.projectsToday ?? 0);
  const firstName = viewerName.split(/[@\s]/)[0].replace(/^\w/, (c) => c.toUpperCase());

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-blue-800/60 bg-gradient-to-br from-blue-950 to-slate-900 p-6">
        <p className="text-sm text-blue-300">{greeting()}, {firstName}.</p>
        <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Hoje a Presta ajudou <span className="text-blue-400">{fmt(helped)}</span> {helped === 1 ? 'pessoa' : 'pessoas'} a trabalhar.
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {fmt(b.proposalsToday)} propostas enviadas + {fmt(b.projectsToday)} projetos publicados hoje · {fmt(b.acceptedToday)} contratações fechadas
        </p>
        <ul className="mt-5 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
          <li>• Entraram <strong className="text-white">{fmt(b.clientsToday)}</strong> empresas hoje</li>
          <li>• Entraram <strong className="text-white">{fmt(b.freelancersToday)}</strong> freelancers hoje</li>
          <li>• <strong className="text-white">{fmt(b.urgentOpen)}</strong> projetos urgentes abertos (de {fmt(b.openProjects)})</li>
          <li>• <strong className="text-white">{fmt(b.acceptedToday)}</strong> propostas aceitas hoje</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="MRR real (planos ativos)" value={brl(b.mrr)} hint={`${b.pro} Pro · ${b.business} Business`} accent />
        <Stat label="Freelancers cadastrados" value={fmt(b.freelancersTotal)} />
        <Stat label="Empresas cadastradas" value={fmt(b.clientsTotal)} />
        <Stat label="Projetos abertos agora" value={fmt(b.openProjects)} />
      </div>
    </section>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'border-green-800/60 bg-green-900/15' : 'border-slate-800 bg-slate-900'}`}>
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-black ${accent ? 'text-green-400' : 'text-white'}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
