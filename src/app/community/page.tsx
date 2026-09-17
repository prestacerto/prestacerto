import Link from "next/link";
import type { Metadata } from "next";
import { MessagesSquare, Sparkles, Users2, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Card } from "@/components/ui/card";
import { getPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = getPageMetadata(
  "Comunidade PrestaCerto",
  "Entre na lista de interesse da comunidade PrestaCerto para networking, casos reais, mentorias e oportunidades melhores.",
  "/community",
);

export default function CommunityPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <section className="rounded-[2rem] border border-violet-100 bg-[linear-gradient(135deg,#f7f1ff_0%,#ffffff_100%)] px-6 py-10 sm:px-10 sm:py-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-bold text-violet-700">
            <Users2 className="size-3.5" /> Comunidade em preparação
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Um lugar para voltar mesmo quando você não está fechando projeto.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            A comunidade PrestaCerto está sendo desenhada para reunir troca de experiência, networking, projetos mais qualificados e rotinas de crescimento para freelancers e clientes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#lista" className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
              Entrar na lista <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link href="/indicacoes" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:border-violet-300 hover:bg-violet-50">
              Ver ranking de indicações
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: MessagesSquare,
            title: "Cases e bastidores",
            description: "Discussões sobre proposta, preço, negociação, entrega e aprendizado prático do dia a dia.",
          },
          {
            icon: Sparkles,
            title: "Acesso antecipado",
            description: "Espaço para testar recursos novos, formatos de comunidade e experiências do Certo antes do restante da base.",
          },
          {
            icon: Users2,
            title: "Networking útil",
            description: "Menos feed vazio, mais trocas entre quem contrata, quem indica e quem executa com qualidade.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-5 text-lg font-black tracking-tight text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section id="lista" className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-700">Lista de interesse</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Quer entrar quando a comunidade abrir?</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Deixe seu contato e diga que tipo de troca faz mais sentido para você. Isso ajuda a construir uma comunidade útil de verdade, não só mais um canal parado.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li>• freelancers podem sinalizar interesse em networking, mentoria e projetos melhores</li>
            <li>• clientes podem sinalizar interesse em curadoria, recontratação e relacionamento recorrente</li>
            <li>• toda abertura deve acontecer com regras claras e foco em qualidade de conversa</li>
          </ul>
        </div>
        <Card className="p-6 shadow-xl shadow-slate-900/5">
          <ContactForm />
        </Card>
      </section>
    </div>
  );
}
