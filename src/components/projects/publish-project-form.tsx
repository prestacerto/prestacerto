"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileText, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

const categories = [
  ["geral", "Ainda não sei"],
  ["desenvolvimento", "Tecnologia e desenvolvimento"],
  ["design", "Design e criação"],
  ["marketing", "Marketing digital"],
  ["conteudo", "Conteúdo e redes sociais"],
  ["consultoria", "Consultoria e negócios"],
  ["psicologia", "Psicologia"],
  ["odontologia", "Odontologia"],
] as const;

type ProjectForm = {
  title: string;
  description: string;
  budget: string;
  deadline: string;
  skills: string;
  category: string;
};

function titleFromIdea(idea: string) {
  const firstSentence = idea.split(/[.!?]/)[0]?.trim() || idea.trim();
  return firstSentence.slice(0, 80) || "Novo projeto";
}

function dateFromDays(days: number | null) {
  if (!days || days < 1) return "";
  const date = new Date();
  date.setDate(date.getDate() + Math.min(days, 730));
  return date.toISOString().slice(0, 10);
}

export function PublishProjectForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [idea, setIdea] = useState("");
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [formData, setFormData] = useState<ProjectForm>({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    skills: "",
    category: "geral",
  });

  const update = <K extends keyof ProjectForm>(field: K, value: ProjectForm[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleBrief = async () => {
    if (idea.trim().length < 10) {
      toast.error("Conte um pouco mais sobre o que você precisa.");
      return;
    }

    setLoadingBrief(true);
    try {
      const response = await fetch("/api/ai/scope-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), categoryHint: formData.category }),
      });

      const suggestion = response.ok ? await response.json() : null;
      const nextForm: ProjectForm = {
        title: typeof suggestion?.title === "string" && suggestion.title.trim() ? suggestion.title.trim() : titleFromIdea(idea),
        description: typeof suggestion?.description === "string" && suggestion.description.trim() ? suggestion.description.trim() : idea.trim(),
        budget: typeof suggestion?.budget_max === "number" ? String(Math.round(suggestion.budget_max)) : typeof suggestion?.budget_min === "number" ? String(Math.round(suggestion.budget_min)) : "",
        deadline: dateFromDays(typeof suggestion?.deadline_days === "number" ? suggestion.deadline_days : null),
        skills: Array.isArray(suggestion?.skills) ? suggestion.skills.filter((skill: unknown): skill is string => typeof skill === "string").join(", ") : "",
        category: formData.category,
      };

      setFormData(nextForm);
      setStep(2);
      toast.success(response.ok ? "Briefing organizado. Revise antes de publicar." : "Rascunho criado. Revise os detalhes antes de publicar.");
    } catch {
      setFormData((current) => ({ ...current, title: titleFromIdea(idea), description: idea.trim() }));
      setStep(2);
      toast.info("Criamos um rascunho manual. Você pode completar os detalhes.");
    } finally {
      setLoadingBrief(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.budget.trim()) {
      toast.error("Informe título, descrição e orçamento para publicar.");
      return;
    }

    setLoadingPublish(true);
    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean) }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Não foi possível publicar o projeto.");
        return;
      }
      toast.success("Projeto publicado com sucesso!");
      setIdea("");
      setStep(1);
      setFormData({ title: "", description: "", budget: "", deadline: "", skills: "", category: "geral" });
    } catch {
      toast.error("Não foi possível publicar o projeto agora.");
    } finally {
      setLoadingPublish(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">Publicar projeto</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Vamos resolver o que você precisa?</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Você descreve. O Certo Brief ajuda a organizar. Você revisa antes de publicar.</p>
        </div>
        <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200 sm:inline-flex">Passo {step} de 2</span>
      </div>

      <div className="mb-8 flex gap-2" aria-label="Progresso da publicação">
        {[1, 2].map((item) => <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-blue-600" : "bg-slate-200 dark:bg-white/10"}`} />)}
      </div>

      {step === 1 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 dark:border-white/10 dark:bg-slate-900 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-200"><FileText className="size-5" /></span>
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Comece do seu jeito</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Não precisa conhecer termos técnicos nem escrever um briefing perfeito.</p>
            </div>
          </div>

          <label className="mt-7 block text-sm font-bold text-slate-800 dark:text-slate-200" htmlFor="project-idea">O que você precisa resolver?</label>
          <textarea id="project-idea" value={idea} onChange={(event) => setIdea(event.target.value)} rows={7} placeholder="Exemplo: preciso de um site para minha clínica, com agendamento e botão de WhatsApp. Quero que seja rápido, profissional e fácil de atualizar." className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" />

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200" htmlFor="project-category">Você já sabe a área?</label>
            <select id="project-category" value={formData.category} onChange={(event) => update("category", event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-950 dark:text-white">
              {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Sparkles className="size-3.5 text-blue-600" /> A IA sugere; você revisa tudo.</p>
            <button type="button" onClick={handleBrief} disabled={loadingBrief} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{loadingBrief ? "Organizando..." : "Organizar meu projeto"}<ArrowRight className="ml-2 size-4" /></button>
          </div>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 dark:border-white/10 dark:bg-slate-900 sm:p-8">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-100"><strong>Revise o briefing.</strong> A sugestão foi criada a partir do que você escreveu. Edite qualquer campo antes de publicar.</div>
          <div className="mt-6 grid gap-5">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Título<input value={formData.title} onChange={(event) => update("title", event.target.value)} maxLength={120} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" /></label>
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Descrição<textarea value={formData.description} onChange={(event) => update("description", event.target.value)} rows={6} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 leading-6 text-slate-950 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Orçamento previsto (R$)<input type="number" min={1} value={formData.budget} onChange={(event) => update("budget", event.target.value)} placeholder="Ex.: 2500" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" /></label>
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Prazo desejado<input type="date" value={formData.deadline} onChange={(event) => update("deadline", event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" /></label>
            </div>
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Skills ou serviços necessários <span className="font-normal text-slate-400">(separe por vírgulas)</span><input value={formData.skills} onChange={(event) => update("skills", event.target.value)} placeholder="Ex.: React, SEO, WhatsApp" className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-950 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-950 dark:text-white" /></label>
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep(1)} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 dark:border-white/10 dark:text-slate-200"><ArrowLeft className="mr-2 size-4" /> Voltar e editar ideia</button><button type="submit" disabled={loadingPublish} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60">{loadingPublish ? "Publicando..." : "Publicar projeto"}<Check className="ml-2 size-4" /></button></div>
          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">Ainda não sabe quanto investir? <Link className="font-bold text-blue-600 hover:underline" href="/ferramentas/calculadora">Use a calculadora orientativa</Link>.</p>
        </form>
      )}
    </div>
  );
}
