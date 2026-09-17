import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { getProfile } from "@/lib/auth/getUser";
import { CertoCurriculoCheckoutButton } from "@/components/certo-curriculo-checkout-button";

export const dynamic = "force-dynamic";

// Resume delivery and Assiny entitlement must be verified before charging.
const configured = false;

export default async function CertoCurriculoPage() {
  const profile = await getProfile();
  if (profile?.role === "client") redirect("/dashboard");

  return <div className="mx-auto max-w-5xl">
    <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Certo Currículo</p>
    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Seu currículo, mais claro para quem vai contratar.</h1>
    <p className="mt-3 max-w-2xl leading-7 text-slate-600">Em preparação: revisão guiada para organizar sua experiência. Envio de currículo, revisão e compra ainda não estão disponíveis. Os demais recursos gratuitos do painel continuam acessíveis.</p>

    <div className="mt-9 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-blue-100 bg-[#eef5ff] p-6 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white"><FileText className="size-6" /></span>
        <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-950">Revisão de currículo — em breve</h2>
        <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
          {[
            "Organização de experiência, habilidades e apresentação",
            "Sugestões de clareza e estrutura para você revisar",
            "Versão final sempre conferida por você antes de enviar",
          ].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-600" />{item}</li>)}
        </ul>
        <div className="mt-7"><CertoCurriculoCheckoutButton configured={configured} /></div>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><ShieldCheck className="size-5 text-emerald-600" /> Como está planejado</div>
        <ol className="mt-6 space-y-5 text-sm leading-6 text-slate-600">
          <li><span className="mr-2 font-black text-blue-600">01</span> O pagamento é confirmado pelo provedor seguro.</li>
          <li><span className="mr-2 font-black text-blue-600">02</span> Você envia ou cola o currículo para iniciar a revisão.</li>
          <li><span className="mr-2 font-black text-blue-600">03</span> Você revisa as sugestões antes de baixar ou enviar qualquer versão.</li>
        </ol>
        <p className="mt-8 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500"><Sparkles className="mr-1 inline size-3.5 text-blue-600" /> O processamento do currículo é liberado somente após confirmação de pagamento. O envio e a revisão serão ativados na sequência de configuração do produto.</p>
        <Link href="/dashboard" className="mt-6 inline-flex text-sm font-bold text-blue-700 hover:underline">Voltar ao meu espaço</Link>
      </aside>
    </div>
  </div>;
}
