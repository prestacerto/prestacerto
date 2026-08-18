"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const proposalSchema = z.object({
  message: z.string().min(10, "Escreva uma mensagem um pouco mais completa"),
  proposedPrice: z.string().optional(),
});

type ProposalValues = z.infer<typeof proposalSchema>;

export function ProposalForm({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [improving, setImproving] = useState(false);
  const [suggestedText, setSuggestedText] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProposalValues>({ resolver: zodResolver(proposalSchema) });

  async function handleImprove() {
    const draft = watch("message");
    if (!draft || draft.trim().length < 5) {
      toast.error("Escreva um pouco antes de pedir ajuda da IA");
      return;
    }

    setImproving(true);
    try {
      const res = await fetch("/api/ai/improve-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft, projectTitle }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error("Não foi possível melhorar o texto", {
          description: body?.error,
        });
        return;
      }

      setOriginalDraft(draft);
      setSuggestedText(body.improved);
      toast.success("Sugestão pronta — revise antes de usar");
    } catch {
      toast.error("Não foi possível conectar ao Certo AI", {
        description: "Sua proposta original continua salva no formulário.",
      });
    } finally {
      setImproving(false);
    }
  }

  function acceptSuggestion() {
    if (!suggestedText) return;
    setValue("message", suggestedText, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSuggestedText(null);
    setOriginalDraft(null);
    toast.success("Sugestão aplicada — você ainda pode editar antes de enviar");
  }

  function discardSuggestion() {
    setSuggestedText(null);
    setOriginalDraft(null);
  }

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
      if (res.status === 402) {
        toast.error("Conectares insuficientes", {
          description: "Você não tem conectares disponíveis. Compre mais para enviar propostas.",
          action: {
            label: "Comprar",
            onClick: () => router.push("/dashboard/connects"),
          },
        });
        return;
      }
      toast.error("Não foi possível enviar sua proposta", {
        description: body?.error ?? "Tente novamente em instantes.",
      });
      return;
    }

    setSent(true);
    toast.success("Proposta enviada! Um conectar foi usado.");
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
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="message">Mensagem</Label>
          <span className="text-[11px] text-slate-400">Você revisa antes de enviar</span>
        </div>
        <Textarea
          id="message"
          rows={5}
          placeholder="Conte por que você é a pessoa certa pra esse projeto..."
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-600">{errors.message.message}</p>
        )}
        <button
          type="button"
          onClick={handleImprove}
          disabled={improving}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700 hover:underline disabled:opacity-50"
        >
          <Sparkles className="size-3.5" />
          {improving ? "Certo AI está organizando sua proposta..." : "Melhorar com Certo AI"}
        </button>
      </div>

      {suggestedText && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold text-blue-950">
                <Sparkles className="size-4 text-blue-600" /> Sugestão do Certo AI
              </p>
              <p className="mt-1 text-xs leading-5 text-blue-800/70">
                A ferramenta reorganizou o texto sem inventar informações. Compare e escolha.
              </p>
            </div>
            <button
              type="button"
              onClick={discardSuggestion}
              className="rounded-md p-1 text-blue-700/60 transition hover:bg-blue-100 hover:text-blue-900"
              aria-label="Fechar sugestão"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Seu rascunho</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{originalDraft}</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-white p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-blue-600">Versão sugerida</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{suggestedText}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={discardSuggestion}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Manter meu texto
            </button>
            <button
              type="button"
              onClick={acceptSuggestion}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Check className="mr-1.5 size-4" /> Usar esta sugestão
            </button>
          </div>
        </div>
      )}

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
