"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface BriefSuggestion {
  title: string;
  description: string;
  skills: string[];
  budget_min: number | null;
  budget_max: number | null;
  deadline_days: number | null;
}

// Preenche o formulário de publicar projeto (inputs não-controlados) a
// partir da sugestão da IA. O cliente sempre revisa e edita antes de
// publicar — a IA nunca publica nada sozinha.
function applySuggestion(suggestion: BriefSuggestion) {
  const setValue = (id: string, value: string) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
    if (el) el.value = value;
  };

  setValue("title", suggestion.title);
  setValue("description", suggestion.description);
  setValue("skills", suggestion.skills.join(", "));
  if (suggestion.budget_min != null) setValue("budgetMin", String(suggestion.budget_min));
  if (suggestion.budget_max != null) setValue("budgetMax", String(suggestion.budget_max));
  if (suggestion.deadline_days != null) setValue("deadlineDays", String(suggestion.deadline_days));
}

export function BriefAssistant() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleGenerate() {
    if (idea.trim().length < 10) {
      toast.error("Descreva um pouco mais o que você precisa");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/ai/scope-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível gerar o briefing", { description: body?.error });
      return;
    }

    const suggestion = (await res.json()) as BriefSuggestion;
    applySuggestion(suggestion);
    toast.success("Briefing preenchido — revise antes de publicar");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
      >
        <Sparkles className="size-4" />
        Deixar a Certo AI te ajudar a escrever
      </button>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-6 space-y-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-blue-900">
          <Sparkles className="size-4" />
          Descreva sua ideia com suas palavras
        </p>
        <Textarea
          rows={3}
          placeholder="Ex: preciso de alguém pra fazer o logo e o site da minha loja de roupas, algo simples e moderno"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <div className="flex gap-2">
          <Button type="button" nativeButton onClick={handleGenerate} disabled={loading}>
            {loading ? "Gerando briefing..." : "Gerar briefing"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
