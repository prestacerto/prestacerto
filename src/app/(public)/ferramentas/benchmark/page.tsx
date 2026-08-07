"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/link-button";
import { CIDADES, CATEGORIAS } from "@/lib/data/landing-data";

const NIVEIS = ["junior", "pleno", "senior"] as const;

type Nivel = typeof NIVEIS[number];

const NIVEL_LABELS: Record<Nivel, string> = {
  junior: "Júnior (0-2 anos)",
  pleno: "Pleno (2-5 anos)",
  senior: "Sênior (5+ anos)",
};

export default function BenchmarkPage() {
  const [categoria, setCategoria] = useState("");
  const [cidade, setCidade] = useState("");
  const [nivel, setNivel] = useState<Nivel>("pleno");
  const [seuPreco, setSeuPreco] = useState(1500);
  const [resultado, setResultado] = useState<{
    mediana: number;
    p25: number;
    p75: number;
    comparacao: number;
    estaAcima: boolean;
    oportunidade: number;
  } | null>(null);
  const [carregando, setCarregando] = useState(false);

  const categorias = Object.entries(CATEGORIAS).map(([slug, data]) => ({
    slug,
    name: data.label,
  }));

  const cidades = Object.entries(CIDADES).map(([slug, data]) => ({
    slug,
    name: data.name,
  }));

  async function calcularBenchmark() {
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
  }

  const percentualOcupacao = {
    junior: 0.75,
    pleno: 1.0,
    senior: 1.3,
  };

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
          Descubra se você está cobrando abaixo, acima ou no ponto certo do mercado freelancer brasileiro.
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
              <Label className="text-sm font-medium">Categoria</Label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
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
              <Label className="text-sm font-medium">Cidade</Label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
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
              <Label className="text-sm font-medium">Experiência</Label>
              <div className="mt-3 space-y-2">
                {NIVEIS.map((niv) => (
                  <label
                    key={niv}
                    className="flex items-center gap-3 cursor-pointer rounded-lg border border-input p-3 transition hover:bg-muted has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950"
                  >
                    <input
                      type="radio"
                      name="nivel"
                      value={niv}
                      checked={nivel === niv}
                      onChange={(e) => setNivel(e.target.value as Nivel)}
                      className="size-4"
                    />
                    <span className="text-sm font-medium">{NIVEL_LABELS[niv]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Seu preço por projeto: R$ {seuPreco.toLocaleString("pt-BR")}
              </Label>
              <input
                type="range"
                min="500"
                max="15000"
                step="100"
                value={seuPreco}
                onChange={(e) => setSeuPreco(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>R$ 500</span>
                <span>R$ 15.000</span>
              </div>
              <input
                type="number"
                value={seuPreco}
                onChange={(e) => setSeuPreco(Number(e.target.value))}
                className="mt-3 w-full rounded-lg border border-input px-3 py-2 text-sm"
                placeholder="Ou digite um valor"
              />
            </div>

            <button
              onClick={calcularBenchmark}
              disabled={!categoria || !cidade || carregando}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {carregando ? "Calculando..." : "Comparar com mercado"}
              <ArrowRight className="size-4" />
            </button>
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-transparent p-6 dark:from-blue-950/40">
              <p className="text-sm text-muted-foreground">Seu preço vs mercado</p>
              <p className="mt-3 text-5xl font-black">
                {resultado.estaAcima ? "+" : ""}{resultado.comparacao.toFixed(0)}%
              </p>
              <p className="mt-2 text-sm font-medium">
                {resultado.estaAcima ? (
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
                  {!resultado.estaAcima && resultado.oportunidade > 0 && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                        Oportunidade de aumento
                      </p>
                      <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                        Você poderia cobrar até{" "}
                        <strong>
                          R$ {resultado.oportunidade.toLocaleString("pt-BR")}
                        </strong>{" "}
                        e ainda estar abaixo da mediana
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-sm">
                <p className="text-muted-foreground">
                  Baseado em <strong>{resultado.p25 ? "contratos reais" : "amostra limitada"}</strong> dos
                  últimos 90 dias de profissionais em {CIDADES[cidade]?.name} na categoria{" "}
                  {CATEGORIAS[categoria]?.label.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

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
        <h2 className="text-2xl font-bold">Quer mais insights sobre preço?</h2>
        <p className="mt-2 text-slate-400">
          Vire Pro e receba alertas quando o preço em sua categoria mudar, análise de propostas que vencem, e mais.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href="/plans" className="bg-blue-600 hover:bg-blue-700">
            Ver planos Pro
          </LinkButton>
          <LinkButton href="/ferramentas/calculadora" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            Calcular preço/hora
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
