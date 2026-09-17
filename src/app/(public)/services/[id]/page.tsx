import { indexingRobots } from '@/lib/seo/discovery';
import { cache } from 'react';
import { getPageMetadata, getNoIndexMetadata, describePage } from '@/lib/seo/metadata';
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { ReviewList } from "@/components/review-list";
import { getServiceById, getReviewsForProfile } from "@/lib/supabase/queries";
import { Star, BadgeCheck } from "lucide-react";
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { authDestination } from '@/lib/auth/destination';

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

const getItemForMetadata = cache(getServiceById);

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const item = await getItemForMetadata(id);
  if (!item) return getNoIndexMetadata("Serviço não encontrado");
  return {
    ...getPageMetadata(item.title, describePage(item.description, 'Veja os detalhes deste serviço no PrestaCerto.'), `/services/${item.id}`),
    ...(item.is_active === false ? { robots: indexingRobots(false) } : {}),
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const [service, user] = await Promise.all([getItemForMetadata(id), getAuthenticatedUser()]);

  if (!service) {
    notFound();
  }

  const freelancer = service.freelancer;
  const reviews = freelancer ? await getReviewsForProfile(freelancer.id) : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
          {freelancer?.full_name?.charAt(0) ?? "?"}
        </span>
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-slate-900">
            {freelancer?.full_name}
            {freelancer?.plan && freelancer.plan !== "free" && (
              <BadgeCheck
                className="size-4 text-blue-600"
                aria-label="Profissional com plano pago"
              />
            )}
          </p>
          <p className="text-sm text-slate-500">
            {[freelancer?.city, freelancer?.state].filter(Boolean).join(", ")}
          </p>
        </div>
        {freelancer?.rating != null && (
          <span className="ml-auto flex items-center gap-1 text-sm font-medium text-slate-700">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {freelancer.rating.toFixed(1)}
            <span className="text-xs text-slate-400">({freelancer.rating_count})</span>
          </span>
        )}
      </div>

      <h1 className="mt-6 text-2xl font-bold text-slate-900">{service.title}</h1>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {service.skills.map((skill: string) => (
          <Badge key={skill} variant="secondary" className="font-normal">
            {skill}
          </Badge>
        ))}
      </div>

      <p className="mt-6 whitespace-pre-line text-slate-700">
        {service.description}
      </p>

      {freelancer?.bio && (
        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Sobre {freelancer.full_name}
          </p>
          <p className="mt-1 text-sm text-slate-600">{freelancer.bio}</p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 p-4">
        <div>
          {service.delivery_days && (
            <p className="text-sm text-slate-500">
              Entrega em {service.delivery_days} dias
            </p>
          )}
          {service.price_hour && (
            <p className="text-lg font-bold text-slate-900">
              R$ {service.price_hour}/h
            </p>
          )}
        </div>
        <LinkButton href={user?.id === service.freelancer_id ? `/dashboard/services/${id}/edit` : user ? '/publicar-projeto' : authDestination('register', '/publicar-projeto')}>
          {user?.id === service.freelancer_id ? 'Editar meu serviço' : user ? 'Publicar um projeto' : 'Criar conta para contratar'}
        </LinkButton>
      </div>

      <Card className="mt-8 p-5">
        <h2 className="font-semibold text-slate-900">Avaliações{reviews !== null ? ` (${reviews.length})` : ""}</h2>
        <div className="mt-4">
          {reviews === null ? <p role="status" className="text-sm text-slate-500">Avaliações indisponíveis no momento.</p> : <ReviewList reviews={reviews} />}
        </div>
      </Card>
    </div>
  );
}
