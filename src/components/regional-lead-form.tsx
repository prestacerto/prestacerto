"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function RegionalLeadForm({
  category,
  city,
}: {
  category: string;
  city: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `Lead regional — ${category} em ${city}`,
          message: `Quero receber ajuda para encontrar ${category.toLowerCase()} em ${city}. Origem: landing page regional.`,
        }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.error || "Não foi possível enviar seus dados.");
      }

      setStatus("success");
    } catch (submissionError) {
      setStatus("error");
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Não foi possível enviar seus dados.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
        <p className="mt-3 font-bold text-emerald-900">Pedido recebido.</p>
        <p className="mt-1 text-sm leading-6 text-emerald-800">
          Vamos usar seus dados para encontrar profissionais de {category.toLowerCase()} em {city}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xl shadow-slate-950/10 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Receba ajuda para começar</p>
      <h2 className="mt-2 text-xl font-black text-slate-950">Encontre {category.toLowerCase()} em {city}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">Deixe seus dados e receba orientação para publicar o projeto certo.</p>
      <div className="mt-5 grid gap-3">
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
          Seu nome
          <input required value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Como podemos chamar você?" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
          Seu melhor e-mail
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="voce@exemplo.com" />
        </label>
      </div>
      {error && <p className="mt-3 text-xs font-medium text-red-600" role="alert">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
        {status === "loading" ? <><Loader2 className="mr-2 size-4 animate-spin" /> Enviando...</> : <>Quero encontrar um profissional <ArrowRight className="ml-2 size-4" /></>}
      </button>
      <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">Você pode sair da lista quando quiser. Seus dados não serão vendidos.</p>
    </form>
  );
}
