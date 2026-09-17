import Link from "next/link";
import { ReviewForm } from "@/components/review-form";
import { getMyReviewForProject } from "@/lib/supabase/queries";

export async function ProjectReviewSection({ projectId, clientId, status, acceptedFreelancerId, userId }: {
  projectId: string; clientId: string; status: string; acceptedFreelancerId?: string | null; userId?: string;
}) {
  if (status !== "closed" || userId !== clientId || !acceptedFreelancerId || acceptedFreelancerId === userId) return null;
  const reviewed = await getMyReviewForProject(projectId, userId);
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
    <h2 className="font-semibold text-slate-900">Avalie a entrega do profissional</h2>
    <div className="mt-4">
      {reviewed === null ? <p role="status" className="text-sm text-slate-600">Avaliações indisponíveis no momento. Tente novamente mais tarde.</p>
        : reviewed ? <p role="status" className="text-sm text-slate-600">Você já avaliou este projeto. <Link href={`/perfil/${acceptedFreelancerId}#avaliacoes`} className="font-medium text-blue-700 underline">Ver avaliações do profissional</Link></p>
          : <ReviewForm projectId={projectId} />}
    </div>
  </section>;
}
