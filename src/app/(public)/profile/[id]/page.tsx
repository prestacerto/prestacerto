import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, BadgeCheck, MapPin, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { ReviewList } from "@/components/review-list";
import { ProfileViewTracker } from "@/components/profile/profile-view-tracker";
import { getPublicProfile } from "@/lib/supabase/queries";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getPublicProfile(id);
  if (!data) return { title: "Perfil não encontrado — PrestaCerto" };

  const { freelancer, services } = data;
  const location = [freelancer.city, freelancer.state].filter(Boolean).join(", ");
  const skillList = Array.from(new Set(services.flatMap((s) => s.skills ?? []))).slice(0, 5);
  const title = `${freelancer.full_name}${location ? ` — Freelancer em ${location}` : " — Freelancer"} | PrestaCerto`;
  const description =
    freelancer.bio?.slice(0, 155) ??
    `Contrate ${freelancer.full_name} na PrestaCerto${skillList.length ? `: ${skillList.join(", ")}` : ""}. Sem comissão, pagamento direto.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: freelancer.avatar_url ? [freelancer.avatar_url] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const data = await getPublicProfile(id);
  if (!data) notFound();

  const { freelancer, services, reviews, portfolioSlug } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: freelancer.full_name,
    description: freelancer.bio ?? undefined,
    image: freelancer.avatar_url ?? undefined,
    address: freelancer.city
      ? { "@type": "PostalAddress", addressLocality: freelancer.city, addressRegion: freelancer.state ?? undefined }
      : undefined,
    aggregateRating:
      freelancer.rating && freelancer.rating_count
        ? {
            "@type": "AggregateRating",
            ratingValue: freelancer.rating,
            reviewCount: freelancer.rating_count,
          }
        : undefined,
    knowsAbout: Array.from(new Set(services.flatMap((s) => s.skills ?? []))),
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      {/* eslint-disable-next-line react/no-danger -- JSON-LD estático, sem entrada de usuário não sanitizada */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProfileViewTracker freelancerId={freelancer.id} />

      <div className="flex items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full border">
          {freelancer.avatar_url ? (
            <Image
              src={freelancer.avatar_url}
              alt={freelancer.full_name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex size-full items-center justify-center bg-slate-900 text-2xl font-semibold text-white">
              {freelancer.full_name?.charAt(0) ?? "?"}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="flex flex-wrap items-center gap-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {freelancer.full_name}
            {freelancer.plan && freelancer.plan !== "free" && (
              <BadgeCheck className="size-4 text-blue-600" aria-label="Freelancer verificado" />
            )}
          </h1>
          {freelancer.headline && (
            <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-400">
              {freelancer.headline}
            </p>
          )}
          {(freelancer.city || freelancer.state) && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="size-3.5" />
              {[freelancer.city, freelancer.state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {freelancer.rating != null && (
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {freelancer.rating.toFixed(1)}
            <span className="text-xs text-slate-400">({freelancer.rating_count})</span>
          </span>
        )}
      </div>

      {freelancer.bio && (
        <p className="mt-6 whitespace-pre-line text-slate-700 dark:text-slate-300">
          {freelancer.bio}
        </p>
      )}

      {freelancer.resume_url && (
        <Link
          href={freelancer.resume_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          <FileText className="size-3.5" />
          Baixar currículo
        </Link>
      )}

      {portfolioSlug && (
        <Link
          href={`/@${portfolioSlug}`}
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Ver portfólio completo →
        </Link>
      )}

      <div className="mt-8">
        <h2 className="font-semibold text-slate-900">Serviços ({services.length})</h2>
        {services.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">Nenhum serviço publicado ainda.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={`/services/${service.id}`}>
                  <Card className="p-4 transition hover:shadow-md">
                    <h3 className="font-semibold text-slate-900">{service.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(service.skills ?? []).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {service.price_hour && (
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        R$ {service.price_hour}/h
                      </p>
                    )}
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 p-4">
        <p className="text-sm text-slate-500">Quer contratar {freelancer.full_name.split(" ")[0]}?</p>
        <LinkButton href="/register">Falar com {freelancer.full_name.split(" ")[0]}</LinkButton>
      </div>

      <Card className="mt-8 p-5">
        <h2 className="font-semibold text-slate-900">Avaliações ({reviews.length})</h2>
        <div className="mt-4">
          <ReviewList reviews={reviews} />
        </div>
      </Card>
    </div>
  );
}
