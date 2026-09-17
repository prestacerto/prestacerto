import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getMyServices, listOpenProjects, getMyProjects, getMyProposals } from "@/lib/supabase/queries";
import { OpportunitiesBoard } from '@/components/opportunities/opportunities-board';

export default async function MatchPage() {
  const user = await getAuthenticatedUser();
  const [services, projects, ownProjects, proposals] = await Promise.all([
    user ? getMyServices(user.id) : Promise.resolve([]),
    listOpenProjects({}),
    user ? getMyProjects(user.id) : Promise.resolve([]),
    user ? getMyProposals(user.id) : Promise.resolve([]),
  ]);
  const mySkills = services.filter(service => service.is_active).flatMap(service => service.skills ?? []);
  const excludedIds = [...ownProjects.map(p=>p.id), ...proposals.filter(p=>p.status !== 'withdrawn').map(p=>p.project?.id).filter((id): id is string => Boolean(id))];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Certo Oportunidades</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Projetos escolhidos para o seu trabalho.</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Filtre projetos, salve os mais interessantes e veja o que chegou desde sua última visita. A compatibilidade compara habilidades cadastradas; ela não prevê contratação.</p>

      {!services.length && <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">Cadastre um serviço e inclua suas habilidades para liberar comparações reais.</div>}

      <div className="mt-8"><OpportunitiesBoard projects={projects} skills={mySkills} excludedIds={excludedIds}/></div>
    </div>
  );
}
