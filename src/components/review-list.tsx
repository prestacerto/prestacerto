import { Star } from "lucide-react";
import type { PublicReview } from "@/lib/supabase/queries";

export function ReviewList({ reviews }: { reviews: PublicReview[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-slate-500">Ainda sem avaliações.</p>;
  }

  return (
    <ul className="space-y-5">
      {reviews.map((review) => (
        <li key={review.id}>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">
              Cliente do projeto
            </p>
            <div className="flex gap-0.5" role="img" aria-label={`${review.rating} de 5 estrelas`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={
                    i < review.rating
                      ? "size-3.5 fill-amber-400 text-amber-400"
                      : "size-3.5 text-slate-200"
                  }
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
