"use client";

import { useState } from "react";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/link-button";

const CATEGORIAS_CALC = [
  "Desenvolvimento Web",
  "Mobile",
  "Design Gráfico",
  "Redação & Conteúdo",
  "Marketing Digital",
  "Tradução",
  "Agentes de IA & Automação",
  "Outro",
];

const REGIMES = [
  { label: "Pessoa Física", taxa: 0.275 },
  { label: "MEI", taxa: 0.065 },
  { label: "PJ (Simples Nacional)", taxa: 0.06 },
  { label: "PJ (Lucro Presumido)", taxa: 0.1333 },
];

function formatBrl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function CalculadoraPage() {
  const [despesas, setDespesas] = useState(3000);
  const [lucro, setLucro] = useState(5000);
  const [horas, setHoras] = useState(120);
  const [regimeIdx, setRegimeIdx] = useState(1);

  const regime = REGIMES[regimeIdx];
  const totalBruto = (despesas + lucro) / (1 - regime.taxa);
  const precoHora = Math.ceil(totalBruto / horas);
  const precoMes = precoHora * horas;

  const projetos = [
    { label: "Projeto pequeno (20h)", valor: precoHora * 20 },
    { label: "Projeto médio (80h)", valor: precoHora * 80 },
    { label: "Projeto grande (200h)", valor: precoHora * 200 },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Calculator className="size-3.5" />
          Ferramenta gratuita
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Calculadora de precificação freelancer
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Descubra quanto cobrar por hora e por projeto — levando em conta seus custos reais, regime tributário e quanto quer ganhar.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label>Regime tributário</Label>
            <div className="grid grid-cols-2 gap-2">
              {REGIMES.map((r, i) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setRegimeIdx(i)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                    regimeIdx === i
                      ? "border-blue-600 bg-blue-50 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="block font-medium">{r.label}</span>
                  <span className="text-xs text-slate-500">{(r.taxa * 100).toFixed(1)}% imposto efetivo</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="despesas">
              Despesas mensais (R$){" "}
              <span className="text-xs text-slate-400">aluguel, internet, planos, alimentação...</span>
            </Label>
            <Input
              id="despesas"
              type="number"
              min={0}
              value={despesas}
              onChange={(e) => setDespesas(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lucro">
              Quanto quer ganhar líquido por mês (R$)
            </Label>
            <Input
              id="lucro"
              type="number"
              min={0}
              value={lucro}
              onChange={(e) => setLucro(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="horas">
              Horas disponíveis por mês{" "}
              <span className="text-xs text-slate-400">horas faturáveis, não totais</span>
            </Label>
            <Input
              id="horas"
              type="number"
              min={1}
              max={300}
              value={horas}
              onChange={(e) => setHoras(Math.max(1, Number(e.target.value)))}
            />
          </div>
        </div>

        {/* Resultado */}
        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <CardContent className="pt-6 text-center">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Seu preço mínimo por hora
              </p>
              <p className="mt-1 text-5xl font-bold text-blue-900 dark:text-blue-100">
                {formatBrl(precoHora)}
              </p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">/hora</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <DollarSign className="mx-auto size-5 text-green-600" />
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {formatBrl(precoMes)}
                </p>
                <p className="text-xs text-slate-500">faturamento/mês</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <TrendingUp className="mx-auto size-5 text-blue-600" />
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {formatBrl(lucro)}
                </p>
                <p className="text-xs text-slate-500">lucro líquido/mês</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Clock className="size-4 text-slate-500" />
                Sugestão por tamanho de projeto
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {projetos.map(({ label, valor }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{formatBrl(valor)}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-slate-100">Dica:</strong> o valor calculado é o mínimo pra não sair no prejuízo.
            Adicione 20–30% extra se o cliente pagar parcelado, projeto tiver imprevistos ou for de área especializada.
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-slate-900 px-8 py-10 text-center text-white dark:bg-slate-800">
        <h2 className="text-xl font-bold">Pronto pra cobrar o preço certo?</h2>
        <p className="mt-2 text-slate-400">
          Cadastre-se na PrestaCerto e receba projetos compatíveis com a sua área — sem pagar comissão nenhuma.
        </p>
        <LinkButton href="/register?role=freelancer" className="mt-6 bg-blue-600 hover:bg-blue-700">
          Criar perfil gratuito →
        </LinkButton>
      </div>
    </div>
  );
}
