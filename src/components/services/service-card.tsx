import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { ServiceWithFreelancer } from "@/lib/firebase/queries";

export function ServiceCard({ service }: { service: ServiceWithFreelancer }) {
  const freelancer = service.freelancer;

  return (
    <Link
      href={`/services/${service.id}`}
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {freelancer?.full_name?.charAt(0) ?? "?"}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {freelancer?.full_name ?? "Freelancer"}
            </p>
            <p className="text-xs text-slate-500">
              {[freelancer?.city, freelancer?.state].filter(Boolean).join(", ") || "Local não informado"}
            </p>
          </div>
        </div>
        {service.rating != null && (
          <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {service.rating.toFixed(1)}
            <span className="text-xs text-slate-400">({service.rating_count})</span>
          </span>
        )}
      </div>

      <p className="mt-4 font-semibold text-slate-900">{service.title}</p>
      <p className="mt-1 line-clamp-3 text-sm text-slate-500">
        {service.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {service.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="secondary" className="font-normal">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm text-slate-500">
        {service.delivery_days && <span>{service.delivery_days}d de entrega</span>}
        {service.price_hour && (
          <span className="font-semibold text-slate-900">
            R$ {service.price_hour}/h
          </span>
        )}
      </div>
    </Link>
  );
}
