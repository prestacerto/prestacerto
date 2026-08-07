import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, GraduationCap, Clock } from "lucide-react";
import { APRENDA_CARDS, CATEGORIAS_APRENDA } from "@/lib/data/aprenda-cards";
import { LinkButton } from "@/components/link-button";

export const metadata: Metadata = {
  title: "Aprenda a cobrar melhor e fechar mais projetos | PrestaCerto",
  description:
    "Dicas curtas e práticas de precificação, propostas, posicionamento e relação com cliente. Leituras de 30 segundos para freelancers brasileiros.",
  alternates: { canonical: "https://prestacerto.com.br/aprenda" },
};

const ORDEM = ["precificacao", "proposta", "posicionamento", "cliente", "carreira"] as const;

export default function AprendaPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
        <GraduationCap className="size-4" />
        Aprenda
      </div>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
        Leituras de 30 segundos que
        <br />
        mudam quanto você cobra.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Sem curso, sem e-book, sem enrolação. {APRENDA_CARDS.length} lições curtas sobre
        precificação, propostas e como conduzir clientes — o que separa quem sobrevive de quem cresce.
      </p>

      <div className="mt-12 space-y-12">
        {ORDEM.map((cat) => {
          const cards = APRENDA_CARDS.filter((c) => c.categoria === cat);
          if (cards.length === 0) return null;
          const meta = CATEGORIAS_APRENDA[cat];

          return (
            <section key={cat}>
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-bold">{meta.label}</h2>
                <span className="text-sm text-muted-foreground">{cards.length} lições</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {cards.map((card) => (
                  <Link
                    key={card.id}
                    href={`/aprenda/${card.id}`}
                    className="group flex flex-col justify-between rounded-xl border bg-card p-5 transition hover:border-blue-500/50 hover:shadow-md"
                  >
                    <h3 className="font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {card.titulo}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{card.conteudo}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className={`rounded-full px-2 py-0.5 font-medium ${meta.color}`}>{meta.label}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {card.tempoLeitura}s
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 rounded-2xl border bg-gradient-to-br from-blue-50 to-transparent p-8 dark:from-blue-950/40">
        <h2 className="text-2xl font-bold">Saber quanto cobrar é metade do trabalho</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Use a calculadora para descobrir seu preço/hora real considerando impostos, despesas e o lucro que você quer.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <LinkButton href="/ferramentas/calculadora" className="gap-2">
            Calcular meu preço <ArrowRight className="size-4" />
          </LinkButton>
          <LinkButton href="/mercado" variant="outline">
            Ver dados de mercado
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
