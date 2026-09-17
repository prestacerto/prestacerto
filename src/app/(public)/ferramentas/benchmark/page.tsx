"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/link-button";
import { CIDADES, CATEGORIAS } from "@/lib/data/landing-data";

type BenchmarkResult = { available: false; sampleSize: number; minSampleSize: number } | {
  available: true; sampleSize: number; mediana: number; p25: number; p75: number; comparacao: number;
};

export default function BenchmarkPage() {
  const [categoria, setCategoria] = useState("");
  const [cidade, setCidade] = useState("");
  const [seuPreco, setSeuPreco] = useState(1500);
  const [resultado, setResultado] = useState<BenchmarkResult | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);

  const categorias = Object.entries(CATEGORIAS).map(([slug, data]) => ({
    slug,
    name: data.label,
  }));

  const cidades = Object.entries(CIDADES).map(([slug, data]) => ({
    slug,
    name: data.name,
  }));

  async function calcularBenchmark() {
    if (request.current) return;
    setResultado(null); setErro("");
    if (!categoria || !cidade || !Number.isFinite(seuPreco) || seuPreco <= 0 || seuPreco > 99999999) {
      setErro("Selecione categoria e cidade e informe um preço maior que zero."); return;
    }
    const controller = new AbortController(); request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 35_000);
    setCarregando(true);
    try {
      const res = await fetch("/api/benchmark", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoria, cidade, seuPreco }), signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      if (request.current !== controller) return;
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Não foi possível consultar as referências. Tente novamente.");
      if (!data || !Number.isInteger(data.sampleSize) || data.sampleSize < 0
        || (data.available === false ? !Number.isInteger(data.minSampleSize) || data.minSampleSize <= data.sampleSize
          : data.available !== true || data.sampleSize < 3 || ![data.mediana, data.p25, data.p75].every(value => typeof value === "number" && Number.isFinite(value) && value > 0)
            || !Number.isFinite(data.comparacao) || data.p25 > data.mediana || data.mediana > data.p75)) {
        throw new Error("Não recebemos referências válidas. Tente novamente.");
      }
      setResultado(data);
    } catch (err) {
      if (request.current !== controller) return;
      setErro(controller.signal.aborted ? "A consulta demorou a responder. Seus dados foram preservados; tente novamente."
        : err instanceof Error && err.name !== "TypeError" ? err.message : "Não foi possível conectar. Seus dados foram preservados; tente novamente.");
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) { request.current = null; setCarregando(false); }
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
          <TrendingUp className="size-3.5" />
          Compare seu preço com o mercado
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight">
          Benchmark de Preço
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Compare seu preço com uma amostra de propostas aceitas no PrestaCerto, quando houver dados suficientes para sua categoria e cidade.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <p className="font-semibold">Seus dados</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="benchmark-category" className="text-sm font-medium">Categoria</Label>
              <select
                id="benchmark-category" disabled={carregando}
                value={categoria}
                onChange={(e) => { setCategoria(e.target.value); setResultado(null); }}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="benchmark-city" className="text-sm font-medium">Cidade</Label>
              <select
                id="benchmark-city" disabled={carregando}
                value={cidade}
                onChange={(e) => { setCidade(e.target.value); setResultado(null); }}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Selecione uma cidade...</option>
                {cidades.map((cid) => (
                  <option key={cid.slug} value={cid.slug}>
                    {cid.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="benchmark-price" className="text-sm font-medium">
                Seu preço por projeto: R$ {Number.isFinite(seuPreco) ? seuPreco.toLocaleString("pt-BR") : "—"}
              </Label>
              <input
                type="range" aria-label="Ajustar preço por projeto" disabled={carregando}
                min="500"
                max="15000"
                step="100"
                value={Number.isFinite(seuPreco) ? seuPreco : ""}
                onChange={(e) => { setSeuPreco(e.target.value === "" ? NaN : Number(e.target.value)); setResultado(null); }}
                className="mt-3 w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>R$ 500</span>
                <span>R$ 15.000</span>
              </div>
              <input
                type="number" id="benchmark-price" min="0.01" max="99999999" step="0.01" disabled={carregando}
                value={Number.isFinite(seuPreco) ? seuPreco : ""}
                onChange={(e) => { setSeuPreco(e.target.value === "" ? NaN : Number(e.target.value)); setResultado(null); }}
                className="mt-3 w-full rounded-lg border border-input px-3 py-2 text-sm"
                placeholder="Ou digite um valor"
              />
            </div>

            <button
              onClick={calcularBenchmark}
              disabled={!categoria || !cidade || carregando}
              aria-busy={carregando}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {carregando ? "Calculando..." : "Comparar com mercado"}
              <ArrowRight className="size-4" />
            </button>
            {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado?.available && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-transparent p-6 dark:from-blue-950/40">
              <p className="text-sm text-muted-foreground">Seu preço vs mercado</p>
              <p className="mt-3 text-5xl font-black">
                {resultado.comparacao >= 0 ? "+" : ""}{resultado.comparacao.toFixed(0)}%
              </p>
              <p className="mt-2 text-sm font-medium">
                {resultado.comparacao >= 0 ? (
                  <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
                    <ArrowUp className="size-4" />
                    Acima da mediana
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                    <ArrowDown className="size-4" />
                    Abaixo da mediana
                  </span>
                )}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Mediana do mercado</p>
                    <p className="mt-1 text-2xl font-bold">
                      R$ {resultado.mediana.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Percentil 25</p>
                      <p className="mt-1 font-semibold">
                        R$ {resultado.p25.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Percentil 75</p>
                      <p className="mt-1 font-semibold">
                        R$ {resultado.p75.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-sm">
                <p className="text-muted-foreground">
                  Amostra de <strong>{resultado.sampleSize} propostas aceitas</strong> nos últimos 90 dias,
                  de profissionais em {CIDADES[cidade]?.name}, na categoria {CATEGORIAS[categoria]?.label.toLowerCase()}.
                  Consideramos até 1.000 propostas mais recentes. Escopos e experiência podem variar;
                  os valores não comprovam pagamento nem representam todo o mercado.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {resultado?.available === false && <Card className="p-8"><p role="status" className="text-sm leading-6 text-slate-600">Ainda não há dados suficientes para esta categoria e cidade. Encontramos {resultado.sampleSize} propostas aceitas; são necessárias pelo menos {resultado.minSampleSize}. Use a calculadora para estimar um preço a partir dos seus custos.</p><LinkButton href="/ferramentas/calculadora" className="mt-5">Calcular meu preço</LinkButton></Card>}
        {!resultado && (
          <Card className="flex items-center justify-center p-12">
            <div className="text-center">
              <TrendingUp className="mx-auto size-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">
                Preencha seus dados e compare com o mercado
              </p>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-16 rounded-2xl border bg-slate-900 p-8 text-white dark:bg-slate-800">
        <h2 className="text-2xl font-bold">Defina uma base para o seu preço</h2>
        <p className="mt-2 text-slate-400">
          Use seus custos, a renda desejada e as horas de trabalho para planejar o valor por hora e por projeto.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href="/ferramentas/calculadora" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            Calcular preço/hora
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
