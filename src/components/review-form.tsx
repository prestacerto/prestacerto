"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ReviewForm({ projectId, userId }: { projectId: string; userId?: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (rating < 1) {
      toast.error("Escolha uma nota de 1 a 5 estrelas.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, rating, comment: comment || null }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível enviar sua avaliação", { description: body?.error });
      return;
    }

    setSent(true);

    // Nota alta é o pico de satisfação do lado de quem avalia — momento
    // certo pra convidar a indicar, igual já fazemos após concluir projeto.
    if (userId && rating >= 4) {
      setTimeout(() => {
        toast("Que bom que gostou! Indique a PrestaCerto", {
          description: "Copie seu link e ganhe recompensa quando seu indicado fizer o primeiro projeto.",
          action: {
            label: "Copiar link",
            onClick: () => {
              const link = `https://prestacerto.com.br/register?ref=${userId}`;
              navigator.clipboard.writeText(link);
              toast.success("Link copiado!");
            },
          },
        });
      }, 1000);
    }

    router.refresh();
  }

  if (sent) {
    return (
      <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
        Avaliação enviada. Obrigado pelo feedback!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Nota</Label>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} estrela${value > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "size-6 text-slate-300 transition-colors",
                  value <= rating && "fill-amber-400 text-amber-400"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Comentário (opcional)</Label>
        <Textarea
          id="comment"
          rows={3}
          placeholder="Como foi a experiência?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button
        type="button"
        nativeButton
        className="w-full"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Enviando..." : "Enviar avaliação"}
      </Button>
    </div>
  );
}
