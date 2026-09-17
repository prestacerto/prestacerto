import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { createClient } from '@/lib/supabase/server';
import { getNoIndexMetadata } from '@/lib/seo/metadata';
import { ServiceControls } from '@/components/services/service-controls';

export const metadata = getNoIndexMetadata('Meus serviços', 'Crie, edite e gerencie os serviços que você oferece no PrestaCerto.');
export default async function ServicesPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?next=%2Fdashboard%2Fservices');
  const supabase = await createClient();
  const { data: services, error } = await supabase.from('services').select('id,title,price_hour,is_active').eq('freelancer_id', user.id).order('created_at', { ascending: false });
  return <div className="mx-auto max-w-4xl space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold text-slate-950">Meus serviços</h1><p className="mt-2 text-sm leading-6 text-slate-600">Apresente o que você oferece. Serviços ativos aparecem na busca de clientes.</p></div><Link href="/dashboard/services/new" className="inline-flex min-h-12 items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Novo serviço</Link></div>
    {error ? <p role="alert" className="rounded-xl bg-amber-50 p-5 text-sm text-amber-950">Não foi possível carregar seus serviços. Tente abrir esta página novamente.</p> : !services?.length ? <div className="rounded-2xl border border-slate-200 bg-white p-7"><p className="text-slate-700">Você ainda não publicou nenhum serviço.</p><Link href="/dashboard/services/new" className="mt-4 inline-flex min-h-11 items-center font-semibold text-blue-700">Publicar meu primeiro serviço →</Link></div> : <div className="space-y-4">{services.map(service => <article key={service.id} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><p className={`text-xs font-semibold ${service.is_active ? 'text-blue-700' : 'text-slate-600'}`}>{service.is_active ? 'Ativo' : 'Pausado'}</p><h2 className="mt-2 break-words text-xl font-semibold text-slate-900">{service.title}</h2><p className="mt-2 text-sm text-slate-600">{service.price_hour == null ? 'Preço a combinar' : `${Number(service.price_hour).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/hora`}</p><div className="mt-3 flex flex-wrap gap-4"><Link href={`/dashboard/services/${service.id}/edit`} className="inline-flex min-h-11 items-center text-sm font-semibold text-blue-700">Editar</Link><Link href={`/services/${service.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-600">Ver serviço</Link></div></div><ServiceControls id={service.id} active={service.is_active}/></div></article>)}</div>}
  </div>;
}
