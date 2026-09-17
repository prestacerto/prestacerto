import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { listOpenProjects } from "@/lib/supabase/queries";

export default async function TimingPage() {
  const projects = await listOpenProjects({});
  const prioritized = projects
    .filter((project) => project.deadline_days && project.deadline_days > 0)
    .map((project) => ({ project, remaining: project.deadline_days! }))
    .sort((a, b) => a.remaining - b.remaining)
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Certo Timing</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Compare os prazos de execução.</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Veja o tempo de execução informado em cada projeto e avalie o que cabe na sua agenda. Esse prazo não indica quando as candidaturas encerram.</p>

      <div className="mt-8 space-y-3">
        {prioritized.length ? prioritized.map(({ project, remaining }) => {
          const urgency = remaining === 1 ? "Execução em 1 dia" : `Execução em ${remaining} dias`;
          const tone = remaining <= 2 ? "bg-rose-50 text-rose-700" : remaining <= 7 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";
          return <Link key={project.id} href={`/projects/${project.id}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"><div className="min-w-0"><h2 className="truncate font-bold text-slate-950">{project.title}</h2><p className="mt-1 text-sm text-slate-500">Tempo de execução: {project.deadline_days} dias</p></div><div className="flex shrink-0 items-center gap-3"><span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline ${tone}`}>{urgency}</span><ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" /></div></Link>;
        }) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><Clock3 className="mx-auto size-7 text-slate-400" /><p className="mt-3 font-semibold text-slate-700">Ainda não há projetos abertos com prazo informado.</p></div>}
      </div>
    </div>
  );
}
