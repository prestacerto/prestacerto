"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ReviewForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => { pending.current?.abort(); pending.current = null; }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    if (rating < 1) { setError("Escolha uma nota de 1 a 5 estrelas."); return; }
    const controller = new AbortController();
    pending.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, rating, comment: comment || null }), signal: controller.signal,
      });
      const body = await response.json().catch(() => null);
      if (pending.current !== controller) return;
      if (!response.ok || body?.success !== true || typeof body?.review?.id !== "string" || !body.review.id) {
        setError(typeof body?.error === "string" ? body.error : "Não foi possível confirmar sua avaliação. Tente novamente.");
        return;
      }
      setSent(true);
      router.refresh();
    } catch {
      if (pending.current === controller) setError(controller.signal.aborted
        ? "O envio demorou mais que o esperado. Sua nota e comentário foram mantidos; tente novamente."
        : "Não foi possível conectar. Sua nota e comentário foram mantidos; tente novamente.");
    } finally {
      clearTimeout(timeout);
      if (pending.current === controller) { pending.current = null; setLoading(false); }
    }
  }

  if (sent) return <p role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">Avaliação publicada. Obrigado pelo feedback!</p>;

  return <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
    <p id={`review-privacy-${projectId}`} className="text-sm text-slate-600">Sua avaliação será pública no perfil do profissional. Não inclua telefone, e-mail, documentos ou outros dados pessoais.</p>
    <fieldset disabled={loading}>
      <legend className="text-sm font-medium">Nota</legend>
      <div className="mt-1 flex gap-1">
        {[1, 2, 3, 4, 5].map(value => <label key={value} className="relative flex size-11 cursor-pointer items-center justify-center rounded-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600">
          <input type="radio" name={`rating-${projectId}`} value={value} checked={rating === value} onChange={() => setRating(value)} className="sr-only" aria-label={`${value} estrela${value > 1 ? "s" : ""}`} required />
          <Star aria-hidden="true" className={cn("size-6 text-slate-400", value <= rating && "fill-amber-400 text-amber-500")} />
        </label>)}
      </div>
    </fieldset>
    <div>
      <Label htmlFor={`review-comment-${projectId}`}>Comentário (opcional)</Label>
      <Textarea id={`review-comment-${projectId}`} rows={4} maxLength={2000} value={comment} disabled={loading}
        aria-describedby={`review-privacy-${projectId}`} placeholder="Como foi a experiência com a entrega?" onChange={event => setComment(event.target.value)} />
      <p className="mt-1 text-xs text-slate-500">Até 2.000 caracteres.</p>
    </div>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <Button type="submit" nativeButton className="w-full" disabled={loading}>{loading ? "Publicando..." : "Publicar avaliação"}</Button>
  </form>;
}
