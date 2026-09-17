import { cache } from 'react';
import { getReviewsForProfile } from '@/lib/supabase/queries';
import { ReviewList } from '@/components/review-list';
import { getPageMetadata, describePage } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/public';
import { LinkButton } from '@/components/link-button';
import { ProfileViewTracker } from '@/components/profile/profile-view-tracker';
import { hasPublicProfileContent, indexingRobots } from '@/lib/seo/discovery';
import { StructuredData } from '@/components/structured-data';
import { siteUrl } from '@/lib/seo/metadata';

export const dynamic = 'force-dynamic';

const getProfileForPage = cache(async (handle: string) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(handle)) notFound();
  const { data: profile, error } = await createPublicClient().from('profiles')
    .select('id, full_name, bio, city, state, role, avatar_url')
    .eq('id', handle).in('role', ['freelancer', 'both']).maybeSingle();
  if (error) throw new Error('Não foi possível carregar este perfil. Tente novamente.');
  if (!profile) notFound();
  const { data: services, error: servicesError } = await createPublicClient().from('services')
    .select('id, title, description, price_hour').eq('freelancer_id', profile.id)
    .eq('is_active', true).order('created_at', { ascending: false }).limit(12);
  return { ...profile, services, servicesError };
});

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = await getProfileForPage(handle);
  const name = profile.full_name || 'Profissional';
  const location = [profile.city, profile.state].filter(Boolean).join(', ');
  return { ...getPageMetadata(`${name} — Perfil profissional${location ? ` em ${location}` : ''}`, describePage(profile.bio, `Conheça o perfil e os serviços de ${name}${location ? ` em ${location}` : ''}. Compare informações e publique seu projeto no PrestaCerto.`), `/perfil/${profile.id}`), robots: indexingRobots(hasPublicProfileContent(profile, Boolean(profile.services?.length))) };
}

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const profile = await getProfileForPage(handle);
  const { services, servicesError } = profile;
  const reviews = await getReviewsForProfile(profile.id);
  return <div className="bg-blue-50/50 text-slate-900 dark:bg-slate-950 dark:text-white">
    <StructuredData type="ProfilePage" data={{ url: `${siteUrl}/perfil/${profile.id}`, mainEntity: { '@type': 'Person', name: profile.full_name || 'Profissional', description: profile.bio || undefined, url: `${siteUrl}/perfil/${profile.id}` } }}/>
    <ProfileViewTracker freelancerId={profile.id}/>
    <div className="h-32 bg-blue-600" />
    <div className="relative mx-auto -mt-12 max-w-4xl px-5 pb-16">
      <section className="rounded-2xl border border-blue-100 bg-white p-7 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-10">
        <span className="mb-5 flex size-16 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-700">{(profile.full_name || 'Profissional').slice(0, 1)}</span>
        <p className="text-sm font-semibold text-blue-600">Perfil profissional</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{profile.full_name || 'Profissional'}</h1>
        {(profile.city || profile.state) && <p className="mt-3 flex items-center gap-2 text-slate-500"><MapPin className="size-4" />{[profile.city, profile.state].filter(Boolean).join(', ')}</p>}
        {profile.bio && <p className="mt-6 whitespace-pre-wrap leading-7 text-slate-600 dark:text-slate-300">{profile.bio}</p>}
        <LinkButton href="/publicar-projeto" className="mt-7 h-12 gap-3 bg-blue-600 px-6 text-white">Publicar um projeto <ArrowUpRight className="size-4" /></LinkButton>
      </section>
      <section className="mt-10"><h2 className="text-2xl font-bold">Serviços oferecidos</h2>
        {servicesError ? <p role="status" className="mt-5 text-slate-500">Os serviços estão temporariamente indisponíveis. Tente novamente.</p> : services?.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{services.map(service => <Link href={`/services/${service.id}`} key={service.id} className="rounded-xl border border-blue-100 bg-white p-6 transition hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900"><BriefcaseBusiness className="size-5 text-blue-600"/><h3 className="mt-4 text-lg font-semibold">{service.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{service.description}</p><p className="mt-5 font-semibold text-blue-600">{service.price_hour != null ? `${Number(service.price_hour).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/hora` : 'Valor a combinar'}</p></Link>)}</div> : <p className="mt-5 text-slate-500">Este profissional ainda não publicou serviços.</p>}
      </section>
      <section id="avaliacoes" className="mt-10 rounded-2xl border border-blue-100 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-5 text-2xl font-bold">Avaliações de clientes</h2>
        {reviews === null ? <p role="status" className="text-sm text-slate-500">Avaliações indisponíveis no momento.</p> : <><ReviewList reviews={reviews}/>{reviews.length === 50 && <p className="mt-4 text-sm text-slate-500">Exibindo as 50 avaliações mais recentes.</p>}</>}
      </section>
    </div>
  </div>;
}
