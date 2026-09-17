import { notFound, redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { getCategories } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import { getNoIndexMetadata } from '@/lib/seo/metadata';
import { validServiceId } from '@/lib/services/validation';
import { ServiceForm } from '@/components/services/service-form';

export const metadata = getNoIndexMetadata('Editar serviço', 'Revise as informações do seu serviço no PrestaCerto.');
export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validServiceId(id)) notFound();
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?${new URLSearchParams({ next: `/dashboard/services/${id}/edit` })}`);
  const supabase = await createClient();
  const [{ data: service, error }, categories] = await Promise.all([
    supabase.from('services').select('*').eq('id', id).eq('freelancer_id', user.id).maybeSingle(), getCategories(),
  ]);
  if (!service && !error) notFound();
  return <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"><h1 className="text-2xl font-bold text-slate-950">Editar serviço</h1>{error ? <p role="alert" className="mt-5 text-sm text-red-700">Não foi possível carregar seu serviço. Atualize a página para tentar novamente.</p> : <ServiceForm categories={categories} service={service}/>}</div>;
}
