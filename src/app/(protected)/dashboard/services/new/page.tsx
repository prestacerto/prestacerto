import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { getCategories } from '@/lib/supabase/queries';
import { getNoIndexMetadata } from '@/lib/seo/metadata';
import { ServiceForm } from '@/components/services/service-form';

export const metadata = getNoIndexMetadata('Novo serviço', 'Descreva e publique o serviço que você oferece no PrestaCerto.');
export default async function NewServicePage() {
  if (!await getAuthenticatedUser()) redirect('/login?next=%2Fdashboard%2Fservices%2Fnew');
  const categories = await getCategories();
  return <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"><h1 className="text-2xl font-bold text-slate-950">Novo serviço</h1><p className="mt-2 text-sm leading-6 text-slate-600">Conte aos clientes o que você faz e o que está incluído no seu trabalho.</p><ServiceForm categories={categories}/></div>;
}
