import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { APRENDA_CARDS, CATEGORIAS_APRENDA } from "@/lib/data/aprenda-cards";
import { LinkButton } from "@/components/link-button";

export function generateStaticParams() {
  return APRENDA_CARDS.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = APRENDA_CARDS.find((c) => c.id === slug);
  if (!card) return {};

  return {
    title: `${card.titulo} | Aprenda — PrestaCerto`,
    description: card.conteudo.slice(0, 155),
    alternates: { canonical: `https://prestacerto.com.br/aprenda/${card.id}` },
    openGraph: {
      title: card.titulo,
      description: card.conteudo.slice(0, 155),
      type: "article",
    },
  };
}

export default async function AprendaCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = APRENDA_CARDS.find((c) => c.id === slug);
  if (!card) notFound();

  const meta = CATEGORIAS_APRENDA[card.categoria];
  const relacionados = APRENDA_CARDS.filter(
    (c) => c.categoria === card.categoria && c.id !== card.id,
  ).slice(0, 3);

  const index = APRENDA_CARDS.findIndex((c) => c.id === card.id);
  const proximo = APRENDA_CARDS[(index + 1) % APRENDA_CARDS.length];

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: card.titulo,
            articleBody: card.conteudo,
            articleSection: meta.label,
            publisher: { "@type": "Organization", name: "PrestaCerto" },
          }),
        }}
      />

      <Link
        href="/aprenda"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Aprenda
      </Link>

      <div className="mt-6 flex items-center gap-3 text-xs">
        <span className={`rounded-full px-2.5 py-1 font-medium ${meta.color}`}>{meta.label}</span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <Clock className="size-3" />
          {card.tempoLeitura} segundos de leitura
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
        {card.titulo}
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-foreground/90">{card.conteudo}</p>

      <div className="mt-10 rounded-xl border bg-muted/40 p-5">
        <p className="text-sm font-medium">Próxima lição</p>
        <Link
          href={`/aprenda/${proximo.id}`}
          className="mt-1 inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          {proximo.titulo} <ArrowRight className="size-4" />
        </Link>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Mais sobre {meta.label.toLowerCase()}
          </h2>
          <div className="mt-3 space-y-2">
            {relacionados.map((r) => (
              <Link
                key={r.id}
                href={`/aprenda/${r.id}`}
                className="block rounded-lg border px-4 py-3 text-sm font-medium transition hover:border-blue-500/50"
              >
                {r.titulo}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 rounded-2xl border bg-gradient-to-br from-blue-50 to-transparent p-6 dark:from-blue-950/40">
        <h2 className="text-lg font-bold">Comece a aplicar hoje</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie seu perfil na PrestaCerto e receba 100% do que combinar com o cliente. Sem comissão, nunca.
        </p>
        <LinkButton href="/register" className="mt-4 gap-2">
          Criar perfil grátis <ArrowRight className="size-4" />
        </LinkButton>
      </div>
    </article>
  );
}
