import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPortfolio } from "@/components/portfolio/public-portfolio";
import { getPublicPortfolioBySlug } from "@/lib/supabase/queries";

interface PortfolioPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { handle } = await params;
  const data = await getPublicPortfolioBySlug(handle);
  if (!data) return { title: "Portfólio não encontrado — PrestaCerto" };

  const title = `${data.freelancer.full_name} — ${data.portfolio.headline} | PrestaCerto`;
  const description =
    data.portfolio.bio?.slice(0, 155) || data.freelancer.bio?.slice(0, 155) || `Portfólio de ${data.freelancer.full_name} na PrestaCerto.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: data.freelancer.avatar_url ? [data.freelancer.avatar_url] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { handle } = await params;
  const data = await getPublicPortfolioBySlug(handle);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: data.freelancer.full_name,
    description: data.portfolio.bio || data.freelancer.bio || undefined,
    image: data.freelancer.avatar_url || undefined,
    aggregateRating:
      data.freelancer.rating && data.freelancer.rating_count
        ? {
            "@type": "AggregateRating",
            ratingValue: data.freelancer.rating,
            reviewCount: data.freelancer.rating_count,
          }
        : undefined,
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger -- JSON-LD estático, sem entrada de usuário não sanitizada */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicPortfolio data={data} />
    </>
  );
}
