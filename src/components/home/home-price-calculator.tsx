"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Check, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const REGIMES = [
  { label: "Pessoa Física", taxa: 0.275 },
  { label: "MEI", taxa: 0.065 },
  { label: "PJ (Simples)", taxa: 0.06 },
  { label: "PJ (Presumido)", taxa: 0.1333 },
] as const;

function formatBrl(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function HomePriceCalculator() {
  const [costs, setCosts] = useState(3000);
  const [target, setTarget] = useState(5000);
  const [hours, setHours] = useState(120);
  const [regimeIndex, setRegimeIndex] = useState(1);

  const result = useMemo(() => {
    const regime = REGIMES[regimeIndex];
    const safeHours = Math.max(1, hours || 1);
    const gross = Math.max(0, (Math.max(0, costs) + Math.max(0, target)) / (1 - regime.taxa));
    const hourly = Math.ceil(gross / safeHours);

    return {
      hourly,
      project: hourly * 80,
      monthly: hourly * safeHours,
    };
  }, [costs, hours, regimeIndex, target]);

  return (
    <section className="border-y border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200">
            <Calculator className="size-3.5" /> Ferramenta gratuita
          </div>
          <h2 className="mt-5 max-w-xl text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Quanto cobrar pelo seu próximo projeto?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Faça uma estimativa em menos de um minuto, usando seus custos e a renda que deseja construir. Sem chute e sem promessa de preço de mercado.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> Resultado baseado nos seus próprios números</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> Simulação de projeto de 80 horas</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> Cálculo completo disponível gratuitamente</span>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-[#f8faff] p-5 shadow-xl shadow-blue-950/5 dark:border-white/10 dark:bg-slate-950 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Custos mensais
              <span className="mt-2 block text-xs font-normal text-slate-500 dark:text-slate-400">Internet, ferramentas e despesas</span>
              <input
                type="number"
                min={0}
                value={costs}
                onChange={(event) => setCosts(Math.max(0, Number(event.target.value)))}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Renda líquida desejada
              <span className="mt-2 block text-xs font-normal text-slate-500 dark:text-slate-400">Quanto quer receber por mês</span>
              <input
                type="number"
                min={0}
                value={target}
                onChange={(event) => setTarget(Math.max(0, Number(event.target.value)))}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Horas faturáveis/mês
              <span className="mt-2 block text-xs font-normal text-slate-500 dark:text-slate-400">Somente horas vendáveis</span>
              <input
                type="number"
                min={1}
                max={300}
                value={hours}
                onChange={(event) => setHours(Math.min(300, Math.max(1, Number(event.target.value))))}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />
            </label>
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Regime tributário
              <span className="mt-2 block text-xs font-normal text-slate-500 dark:text-slate-400">Usado apenas na simulação</span>
              <select
                value={regimeIndex}
                onChange={(event) => setRegimeIndex(Number(event.target.value))}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-slate-900 dark:text-white"
              >
                {REGIMES.map((regime, index) => <option key={regime.label} value={index}>{regime.label}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-4 text-white sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-200">Preço mínimo estimado/hora</p>
              <p className="mt-1 text-3xl font-black">{formatBrl(result.hourly)}</p>
              <p className="mt-1 text-xs text-slate-400">O cálculo não substitui orientação contábil.</p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-400/20 dark:bg-blue-400/10">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-200">Projeto 80h</p>
              <p className="mt-1 text-2xl font-black text-blue-950 dark:text-white">{formatBrl(result.project)}</p>
              <p className="mt-1 text-xs text-blue-700/70 dark:text-blue-200/70">Estimativa orientativa</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><Sparkles className="size-3.5 text-blue-600" /> Personalize o cálculo completo no Certo AI</span>
            <Link href="/ferramentas/calculadora" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
              Abrir calculadora completa <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
