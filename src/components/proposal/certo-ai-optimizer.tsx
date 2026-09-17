"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function CertoAIOptimizer() {
  const [proposal, setProposal] = useState("");
  const [improved, setImproved] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => {
    request.current?.abort();
    request.current = null;
  }, []);

  async function optimize() {
    if (request.current || proposal.trim().length < 10) return;
    const controller = new AbortController();
    request.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, 35_000);
    setLoading(true);
    setError("");
    setUpgrade(false);
    setCopied(false);
    setImproved("");
    setRemaining(null);
    try {
      const response = await fetch("/api/ai/improve-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: proposal, projectTitle: "projeto do cliente" }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (request.current !== controller) return;
      if (!response.ok) {
        setUpgrade(data?.upgrade === true);
        throw new Error(typeof data?.error === "string" ? data.error : "Não foi possível melhorar o texto agora. Seu texto foi preservado.");
      }
      if (typeof data?.improved !== "string" || !data.improved.trim()) {
        throw new Error("Não recebemos uma sugestão válida. Seu texto foi preservado; tente novamente.");
      }
      setImproved(data.improved.trim());
      setRemaining(Number.isInteger(data.remainingFree) && data.remainingFree >= 0 ? data.remainingFree : null);
    } catch (err) {
      if (request.current !== controller) return;
      setError(timedOut ? "O Certo AI demorou a responder. Seu texto foi preservado; tente novamente." : err instanceof Error && err.name !== "TypeError" ? err.message : "Não foi possível conectar. Seu texto foi preservado.");
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setLoading(false);
      }
    }
  }

  async function copySuggestion() {
    try {
      await navigator.clipboard.writeText(improved);
      setCopied(true);
    } catch {
      setError("Não foi possível copiar. Selecione e copie o texto abaixo.");
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h2 className="text-xl font-semibold">Certo AI — reescreva sua proposta</h2>
        <p className="text-sm text-slate-600">
          Melhore a clareza e a organização sem inventar experiência ou resultados.
          Revise a sugestão antes de enviar.
        </p>
        <label className="block font-medium" htmlFor="certo-proposal">Sua proposta</label>
        <textarea
          id="certo-proposal"
          value={proposal}
          onChange={(event) => setProposal(event.target.value)}
          maxLength={5000}
          disabled={loading}
          rows={7}
          className="w-full rounded border p-3"
          placeholder="Escreva como você pode ajudar neste projeto…"
        />
        <p className="text-xs text-slate-600">
          {proposal.length}/5.000 caracteres · Plano gratuito: 3 solicitações por mês.
          Uma solicitação enviada à IA pode consumir a cota mesmo se a conexão cair.
        </p>
        <button
          onClick={optimize}
          disabled={loading || proposal.trim().length < 10}
          aria-busy={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Reescrevendo…" : "Melhorar com Certo AI"}
        </button>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {upgrade && <Link href="/plans" className="block text-blue-700 underline">Conhecer o plano Pro</Link>}
        {remaining !== null && <p className="text-sm">Solicitações gratuitas restantes neste mês: {remaining}</p>}
        {improved && (
          <section className="space-y-3">
            <h3 className="font-semibold">Sugestão para revisar</h3>
            <p className="whitespace-pre-wrap rounded border p-3">{improved}</p>
            <button className="text-blue-700 underline" onClick={copySuggestion}>
              {copied ? "Copiado" : "Copiar sugestão"}
            </button>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
