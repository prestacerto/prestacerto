"use client";

import { useState } from "react";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CIDADES, CATEGORIAS } from "@/lib/data/landing-data";

const NIVEIS = ["junior", "pleno", "senior"] as const;
type Nivel = typeof NIVEIS[number];

export function BenchmarkWidget() {
  const [categoria, setCategoria] = useState("desenvolvimento-web");
  const [cidade, setCidade] = useState("sao-paulo");
  const [seuPreco, setSeuPreco] = useState(3000);
  const [resultado, setResultado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  async function calcular() {
    setCarregando(true);
    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, cidade, nivel: "pleno", seuPreco }),
      });
      const data = await res.json();
      setResultado(data);
    } finally {
      setCarregando(false);
    }
  }

  const categorias = Object.entries(CATEGORIAS).map(([slug, data]) => ({ slug, name: data.label }));
  const cidades = Object.entries(CIDADES).map(([slug, data]) => ({ slug, name: data.name }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="size-5 text-green-600" />
          <h2 className="font-bold">Seu Benchmark de Preço</h2>
        </div>
        <p className="text-xs text-slate-500">Compare seu preço com a mediana do mercado</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="mt-1 w-full rounded border border-slate-200 bg-white p-2 text-sm">
              {categorias.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Cidade</label>
            <select value={cidade} onChange={(e) => setCidade(e.target.value)} className="mt-1 w-full rounded border border-slate-200 bg-white p-2 text-sm">
              {cidades.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Seu preço por projeto</label>
          <div className="mt-2 flex items-center gap-3">
            <input type="range" min="500" max="20000" step="100" value={seuPreco} onChange={(e) => setSeuPreco(Number(e.target.value))} className="flex-1" />
            <div className="w-24 rounded bg-slate-100 p-2 text-center font-bold">R$ {seuPreco.toLocaleString("pt-BR")}</div>
          </div>
        </div>

        <button onClick={calcular} disabled={carregando} className="w-full rounded bg-green-600 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50">
          {carregando ? "Carregando..." : "Calcular Benchmark"}
        </button>

        {resultado && (
          <div className="space-y-3 rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Mediana do mercado</span>
              <span className="font-bold text-lg">R$ {resultado.mediana.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Seu preço</span>
              <span className={`font-bold text-lg ${resultado.estaAcima ? "text-blue-600" : "text-amber-600"}`}>R$ {seuPreco.toLocaleString("pt-BR")}</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center gap-2 text-sm">
                {resultado.estaAcima ? (
                  <>
                    <ArrowUp className="size-4 text-blue-600" />
                    <span>Você está <strong>{((resultado.mediana / seuPreco - 1) * 100).toFixed(0)}%</strong> acima da mediana</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="size-4 text-amber-600" />
                    <span>Você está <strong>{((seuPreco / resultado.mediana - 1) * 100).toFixed(0)}%</strong> abaixo da mediana</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">Dica: Considere aumentar seu preço se estiver muito abaixo do mercado</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
