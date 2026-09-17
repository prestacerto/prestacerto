import Link from "next/link";
import { ArrowUpRight, Check, LockKeyhole, Sparkles } from "lucide-react";
import {
  CERTO_CATEGORIES,
  CERTO_MODULES,
  getCertoStatusLabel,
  type CertoModuleStatus,
} from "@/lib/monetization/certo-catalog";

const statusStyles: Record<CertoModuleStatus, string> = {
  base: "border-emerald-200 bg-emerald-50 text-emerald-700",
  premium: "border-blue-200 bg-blue-50 text-blue-700",
  planned: "border-slate-200 bg-slate-100 text-slate-600",
};

export function CertoGrowthCatalog() {
  return (
    <section className="mt-20 overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-10 text-white shadow-2xl shadow-blue-950/20 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
              <Sparkles className="size-3.5" /> Ecossistema Certo
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Monetize seu talento com ferramentas que trabalham junto com você.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Comece grátis e desbloqueie apenas o que fizer sentido para sua rotina. A proposta é transformar o PrestaCerto em uma central de propostas, dados, reputação e crescimento.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-blue-300" /> Sem comissão no núcleo</span>
              <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-blue-300" /> Upgrade modular</span>
              <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-blue-300" /> Você aprova as ações</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">Estratégia de receita</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div><p className="text-2xl font-black">Grátis</p><p className="mt-1 text-xs text-slate-400">Aquisição e ativação</p></div>
              <div><p className="text-2xl font-black">Mensal</p><p className="mt-1 text-xs text-slate-400">Ferramentas premium</p></div>
              <div><p className="text-2xl font-black">Comissão</p><p className="mt-1 text-xs text-slate-400">Mentorias e transações</p></div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          {CERTO_CATEGORIES.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-bold text-white">{category}</h3>
              <div className="mt-3 space-y-3">
                {CERTO_MODULES.filter((module) => module.category === category).map((module) => (
                  <Link key={module.id} href={module.href} className="group block rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-white/[0.09]">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-white">{module.name}</h4>
                      {module.status === "planned" ? <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-slate-500" /> : <Sparkles className="mt-0.5 size-3.5 shrink-0 text-blue-300" />}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{module.shortDescription}</p>
                    <p className="mt-3 text-xs font-bold text-blue-200">{module.priceLabel}</p>
                    <span className={`mt-3 inline-flex rounded-full border px-2 py-1 text-[10px] font-bold ${statusStyles[module.status]}`}>
                      {getCertoStatusLabel(module.status)}
                    </span>
                    <span className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-slate-400 transition group-hover:text-blue-200">Conhecer recurso <ArrowUpRight className="size-3" /></span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-xs leading-5 text-slate-400">Recursos de pagamento, automação e comissão só entram em produção após validação do fluxo, consentimento do usuário e configuração do provedor.</p>
          <Link href="/register?role=freelancer" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-400">
            Criar perfil grátis <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
