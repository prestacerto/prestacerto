import { getPageMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

export const metadata = getPageMetadata('Termos do programa de indicações', 'Conheça as regras, os critérios de participação e as condições do programa de indicações do PrestaCerto.', "/termos-indicacoes");

export default function ReferralTermsPage() {
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-14 sm:px-6">
    <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Indique e ganhe</p>
    <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Regras do programa</h1>
    <div className="mt-8 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-950"><Info className="mt-0.5 size-5 shrink-0 text-blue-600" /><p>O benefício de indicação está em fase de definição. Esta página registra o funcionamento previsto; nenhum crédito ou desconto é automático até que as regras finais sejam publicadas.</p></div>
    <section className="mt-10 space-y-6 text-slate-700">
      <div><h2 className="text-xl font-black text-slate-950">Como a indicação será analisada</h2><p className="mt-2 leading-7">A pessoa indicada deve ser um novo cliente ou lead identificado por você. A elegibilidade depende de validação da PrestaCerto e da conversão conforme a regra vigente.</p></div>
      <div><h2 className="text-xl font-black text-slate-950">Benefício na mensalidade</h2><p className="mt-2 leading-7">O formato, percentual, limites por período e prazo de aplicação ainda serão definidos. O programa não garante benefício financeiro ou resultado para cada indicação.</p></div>
      <div><h2 className="text-xl font-black text-slate-950">Confirmação e limites</h2><p className="mt-2 leading-7">A confirmação poderá ser feita manualmente ou por integração futura. Critérios de prevenção a fraude, elegibilidade, limite de indicações e comunicação ao participante serão publicados antes da ativação do benefício.</p></div>
    </section>
    <Link href="/register" className="mt-10 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Criar conta <ArrowRight className="ml-2 size-4" /></Link>
  </main>;
}
