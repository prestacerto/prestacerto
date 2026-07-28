"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const proposalSchema = z.object({
  message: z.string().min(10, "Escreva uma mensagem um pouco mais completa"),
  proposedPrice: z.string().optional(),
});

type ProposalValues = z.infer<typeof proposalSchema>;

export function ProposalForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProposalValues>({ resolver: zodResolver(proposalSchema) });

  async function onSubmit(values: ProposalValues) {
    setLoading(true);
    const price = values.proposedPrice ? Number(values.proposedPrice) : null;
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        message: values.message,
        proposedPrice: price && price > 0 ? price : null,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (res.status === 401) {
        toast.error("Você precisa entrar na sua conta pra enviar uma proposta.");
        return;
      }
      toast.error("Não foi possível enviar sua proposta", {
        description: body?.error ?? "Tente novamente em instantes.",
      });
      return;
    }

    setSent(true);
    router.refresh();
  }

  if (sent) {
    return (
      <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
        Proposta enviada! O cliente vai analisar e pode entrar em contato.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Conte por que você é a pessoa certa pra esse projeto..."
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="proposedPrice">Valor da proposta (R$, opcional)</Label>
        <Input
          id="proposedPrice"
          type="number"
          step="0.01"
          placeholder="1500"
          {...register("proposedPrice")}
        />
      </div>

      <Button type="submit" nativeButton className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar proposta"}
      </Button>
    </form>
  );
}
