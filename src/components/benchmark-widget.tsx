"use client";

import { useState, useCallback, useMemo } from "react";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CIDADES, CATEGORIAS } from "@/lib/data/landing-data";

const NIVEIS = ["junior", "pleno", "senior"] as const;
type Nivel = typeof NIVEIS[number];

const NIVEL_LABELS: Record<Nivel, string> = {
  junior: "Júnior (0-2 anos)",
  pleno: "Pleno (2-5 anos)",
  senior: "Sênior (5+ anos)",
};

export function BenchmarkWidget() {
  const [categoria, setCategoria] = useState("desenvolvimento-web");
  const [cidade, setCidade] = useState("sao-paulo");
  const [nivel, setNivel] = useState<Nivel>("pleno");
  const [seuPreco, setSeuPreco] = useState(3000);
  const [resultado, setResultado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const categorias = useMemo(() => 
    Object.entries(CATEGORIAS).map(([slug, data]) => ({ slug, name: data.label })),
    []
  );

  const cidades = useMemo(() =>
    Object.entries(CIDADES).map(([slug, data]) => ({ slug, name: data.name })),
    []
  );

  const calcular = useCallback(async () => {
    if (!categoria || !cidade || !seuPreco) return;
    setCarregando(true);
    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, cidade, nivel, seuPreco }),
      });
      if (res.ok) {
        const data = await res.json();
        setResultado(data);
      }
    } catch (err) {
      console.error("Erro ao calcular benchmark:", err);
    } finally {
      setCarregando(false);
    }
  }, [categoria, cidade, nivel, seuPreco]);

  const diferenca = resultado
    ? resultado.estaAcima
      ? ((resultado.mediana / seuPreco - 1) * 100)
      : ((seuPreco / resultado.mediana - 1) * 100)
    : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
            <TrendingUp className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Seu Benchmark</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Compare com o mercado</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors hover:border-slate-300 dark:hover:border-slate-600"
            >
              {categorias.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Cidade
            </label>
            <select
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors hover:border-slate-300 dark:hover:border-slate-600"
            >
              {cidades.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Seu preço: <span className="text-base font-bold text-slate-900 dark:text-white">R$ {seuPreco.toLocaleString("pt-BR")}</span>
          </label>
          <input
            type="range"
            min="500"
            max="20000"
            step="100"
            value={seuPreco}
            onChange={(e) => setSeuPreco(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>R$ 500</span>
            <span>R$ 20.000</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["junior", "pleno", "senior"] as const).map((n) => (
            <button
              key={n}
              onClick={() => setNivel(n)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                nivel === n
                  ? "bg-blue-600 text-white dark:bg-blue-600"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {NIVEL_LABELS[n].split(" ")[0]}
            </button>
          ))}
        </div>

        <button
          onClick={calcular}
          disabled={carregando || !categoria || !cidade}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 text-white font-semibold text-sm transition-all duration-200 active:scale-95"
        >
          {carregando ? "Calculando..." : "Calcular Benchmark"}
        </button>

        {resultado && (
          <div className="rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 space-y-3 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Mediana do mercado</span>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                R$ {resultado.mediana.toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-start gap-3">
              {resultado.estaAcima ? (
                <>
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mt-0.5">
                    <ArrowUp className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Você está {Math.round(diferenca)}% acima
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Seu preço é competitivo nesta região
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2 mt-0.5">
                    <ArrowDown className="size-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Você está {Math.round(diferenca)}% abaixo
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Oportunidade de aumentar preço
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
