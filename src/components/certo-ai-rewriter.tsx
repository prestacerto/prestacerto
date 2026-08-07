"use client";

import { useState } from "react";
import { Sparkles, Copy, RotateCcw, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CertoAIRewriterProps {
  proposalText: string;
  category?: string;
  budget?: number;
  userId: string;
  isPremium?: boolean;
  onRewrite: (text: string) => void;
}

export function CertoAIRewriter({
  proposalText,
  category,
  budget,
  userId,
  isPremium = false,
  onRewrite,
}: CertoAIRewriterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleRewrite() {
    if (!isPremium) {
      // Trigger upgrade modal
      window.dispatchEvent(new CustomEvent("upgrade-needed", { detail: "Certo AI" }));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/certo-ai/rewrite-proposal", {
        method: "POST",
        body: JSON.stringify({
          userId,
          proposalText,
          category,
          budget,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.locked) {
          window.dispatchEvent(new CustomEvent("upgrade-needed", { detail: "Certo AI" }));
          return;
        }
        throw new Error(data.error || "Falha ao reescrever");
      }

      const data = await res.json();
      setRewrittenText(data.rewrittenText);
      setShowComparison(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  function acceptRewrite() {
    if (rewrittenText) {
      onRewrite(rewrittenText);
      setRewrittenText(null);
      setShowComparison(false);
    }
  }

  function copyToClipboard() {
    if (rewrittenText) {
      navigator.clipboard.writeText(rewrittenText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function discardRewrite() {
    setRewrittenText(null);
    setShowComparison(false);
  }

  if (showComparison && rewrittenText) {
    return (
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Sparkles className="size-4" />
            <span className="font-medium">Proposta reescrita por Certo AI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                ❌ Original
              </label>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto">
                {proposalText}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 block">
                ✨ Reescrita (Certo AI)
              </label>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 text-sm text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto">
                {rewrittenText}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={discardRewrite}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="size-4 inline mr-2" />
              Descartar
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Copy className="size-4 inline mr-2" />
              {copied ? "Copiado!" : "Copiar"}
            </button>
            <button
              onClick={acceptRewrite}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 transition-colors"
            >
              <Sparkles className="size-4" />
              Usar esta versão
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <button
      onClick={handleRewrite}
      disabled={isLoading || !proposalText.trim()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-medium transition-all hover:shadow-lg disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Reescrevendo...
        </>
      ) : !isPremium ? (
        <>
          <Lock className="size-4" />
          Certo AI (Premium)
        </>
      ) : (
        <>
          <Sparkles className="size-4" />
          Melhorar com Certo AI
        </>
      )}
    </button>
  );
}
