import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { createClient } from '@/lib/supabase/server';
import { getNoIndexMetadata } from '@/lib/seo/metadata';
import { ProfileEditForm } from '@/components/dashboard/profile-edit-form';

export const metadata = getNoIndexMetadata('Editar meu perfil', 'Revise e salve as informações do seu perfil no PrestaCerto.');

export default async function ProfileEditPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?next=%2Fdashboard%2Fprofile');
  const supabase = await createClient();
  const { data: profile, error } = await supabase.from('profiles')
    .select('full_name,headline,bio,city,state,avatar_url,resume_url')
    .eq('id', user.id).maybeSingle();

  return <div className="mx-auto w-full max-w-2xl space-y-6">
    <div><h1 className="text-2xl font-bold text-slate-900">Meu perfil</h1><p className="mt-2 text-sm leading-6 text-slate-600">Revise seu nome, serviço e experiência antes de salvar as informações que aparecem no seu perfil.</p></div>
    {error || !profile ? <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><p>Não foi possível carregar seu perfil agora. Tente abrir esta página novamente.</p><Link href="/dashboard" className="mt-3 inline-block font-semibold underline">Voltar ao painel</Link></div> :
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"><ProfileEditForm userId={user.id} userEmail={user.email} initialData={profile} /></div>}
  </div>;
}
