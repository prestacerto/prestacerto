import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPortfolio } from "@/components/portfolio/public-portfolio";
import { getPublicPortfolioBySlug } from "@/lib/supabase/queries";
import { cache } from 'react';
import { getPageMetadata, describePage, siteUrl } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/structured-data';

const getPortfolio = cache(getPublicPortfolioBySlug);

interface PortfolioPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { handle } = await params;
  const data = await getPortfolio(handle);
  if (!data) notFound();

  const title = `${data.freelancer.full_name} — ${data.portfolio.headline || 'Portfólio profissional'}`;
  const description =
    describePage(data.portfolio.bio || data.freelancer.bio, `Portfólio de ${data.freelancer.full_name} no PrestaCerto.`);
  const pageMetadata = getPageMetadata(title, description, `/portfolio/${encodeURIComponent(data.portfolio.url_slug)}`, data.freelancer.avatar_url || undefined);

  return {
    ...pageMetadata,
    openGraph: {
      ...pageMetadata.openGraph,
      type: "profile",
    },
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { handle } = await params;
  const data = await getPortfolio(handle);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    url: `${siteUrl}/portfolio/${encodeURIComponent(data.portfolio.url_slug)}`,
    mainEntity: {
      '@type': 'Person',
      name: data.freelancer.full_name,
      description: data.portfolio.bio || data.freelancer.bio || undefined,
      image: data.freelancer.avatar_url || undefined,
      url: `${siteUrl}/perfil/${data.freelancer.id}`,
    },
  };

  return (
    <>
      <StructuredData type="ProfilePage" data={jsonLd} />
      <PublicPortfolio data={data} />
    </>
  );
}
