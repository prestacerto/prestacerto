"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function RegionalProfessionalLeadForm({ city, state }: { city: string; state: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [attribution, setAttribution] = useState("sem UTM");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setAttribution(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => `${key}=${query.get(key) || ""}`)
      .filter((item) => !item.endsWith("="))
      .join("; ") || "sem UTM");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setError("Confirme que podemos usar seu e-mail para enviar informações sobre a PrestaCerto.");
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `Lead prestador regional — ${city}/${state}`,
          message: `Quero criar meu perfil de prestador em ${city}/${state}. Consentimento de contato: sim. Origem: /prestadores/${city.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/\\s+/g, "-")}. Atribuição: ${attribution}.`,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "Não foi possível enviar seus dados.");
      setStatus("success");
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível enviar seus dados.");
    }
  }

  if (status === "success") {
    return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"><CheckCircle2 className="mx-auto size-8 text-emerald-600" /><p className="mt-3 font-bold text-emerald-900">Cadastro de interesse recebido.</p><p className="mt-1 text-sm leading-6 text-emerald-800">Você pode criar seu perfil agora ou aguardar as informações que autorizou receber.</p></div>;
  }

  return <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xl shadow-slate-950/10 sm:p-6">
    <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">PrestaCerto em {city}</p>
    <h2 className="mt-2 text-xl font-black text-slate-950">Comece com um perfil profissional</h2>
    <p className="mt-2 text-sm leading-6 text-slate-500">Cadastre seu interesse para receber orientações sobre perfil, proposta e oportunidades na região.</p>
    <div className="mt-5 grid gap-3">
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">Seu nome<input required value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Como podemos chamar você?" /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">Seu melhor e-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="voce@exemplo.com" /></label>
    </div>
    <label className="mt-4 flex items-start gap-2.5 text-xs leading-5 text-slate-600"><input required checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />Autorizo o contato por e-mail sobre a PrestaCerto e posso cancelar quando quiser.</label>
    {error && <p className="mt-3 text-xs font-medium text-red-600" role="alert">{error}</p>}
    <button type="submit" disabled={status === "loading"} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{status === "loading" ? <><Loader2 className="mr-2 size-4 animate-spin" /> Enviando...</> : <>Quero criar meu perfil <ArrowRight className="ml-2 size-4" /></>}</button>
    <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">Usamos esta inscrição somente para o contato solicitado. Seus dados não são vendidos.</p>
  </form>;
}
