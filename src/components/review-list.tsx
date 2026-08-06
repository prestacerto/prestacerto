import { Star } from "lucide-react";
import type { ReviewWithAuthor } from "@/lib/supabase/queries";

export function ReviewList({ reviews }: { reviews: ReviewWithAuthor[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-slate-500">Ainda sem avaliações.</p>;
  }

  return (
    <ul className="space-y-5">
      {reviews.map((review) => (
        <li key={review.id}>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">
              {review.author?.full_name ?? "Usuário"}
            </p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
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
            <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
