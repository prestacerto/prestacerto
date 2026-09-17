"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Download } from "lucide-react";

interface TimeEntry {
  id: string;
  projectName: string;
  duration: number; // in seconds
  date: string;
  hourlyRate: number;
}

export function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [hourlyRate, setHourlyRate] = useState(100);
  const [entries, setEntries] = useState<TimeEntry[]>([
    {
      id: "1",
      projectName: "Website Redesign",
      duration: 3600 * 2 + 1800, // 2.5 hours
      date: new Date().toISOString().split("T")[0],
      hourlyRate: 150,
    },
  ]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStop = () => {
    if (time > 0 && projectName) {
      setEntries([
        {
          id: Date.now().toString(),
          projectName,
          duration: time,
          date: new Date().toISOString().split("T")[0],
          hourlyRate,
        },
        ...entries,
      ]);
      setTime(0);
      setProjectName("");
    }
    setIsRunning(false);
  };

  const calculateEarnings = (duration: number, rate: number) => {
    return (duration / 3600) * rate;
  };

  const totalEarnings = entries.reduce(
    (sum, entry) => sum + calculateEarnings(entry.duration, entry.hourlyRate),
    0
  );

  const handleExportInvoice = () => {
    const invoiceContent = `
FATURA DE SERVIÇOS PRESTADOS

Data: ${new Date().toLocaleDateString("pt-BR")}

DETALHAMENTO DE HORAS:
${entries
  .map(
    (entry) => `
Projeto: ${entry.projectName}
Data: ${entry.date}
Duração: ${formatTime(entry.duration)}
Taxa: R$ ${entry.hourlyRate}/h
Valor: R$ ${calculateEarnings(entry.duration, entry.hourlyRate).toFixed(2)}
`
  )
  .join("\n---\n")}

TOTAL: R$ ${totalEarnings.toFixed(2)}

Dados Bancários: [ADICIONAR_DADOS_BANCARIOS]
`;

    const element = document.createElement("a");
    const file = new Blob([invoiceContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Timer Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <h2 className="text-3xl font-bold mb-6">⏱️ Time Tracker</h2>

        {/* Big Timer Display */}
        <div className="bg-black/30 rounded-lg p-8 text-center mb-6 font-mono">
          <div className="text-6xl font-bold mb-2">{formatTime(time)}</div>
          <p className="text-lg opacity-90">
            Ganho: R$ {calculateEarnings(time, hourlyRate).toFixed(2)}
          </p>
        </div>

        {/* Input Fields */}
        <div className="grid gap-4 mb-6 sm:grid-cols-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Nome do projeto..."
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            placeholder="Taxa horária (R$)"
            className="px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={!projectName}
            className="flex-1 px-6 py-3 rounded-lg bg-white/30 hover:bg-white/40 disabled:opacity-50 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {isRunning ? (
              <>
                <Pause className="size-5" /> Pausar
              </>
            ) : (
              <>
                <Play className="size-5" /> Iniciar
              </>
            )}
          </button>
          <button
            onClick={handleStop}
            disabled={time === 0}
            className="flex-1 px-6 py-3 rounded-lg bg-red-500/30 hover:bg-red-500/40 disabled:opacity-50 font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="size-5" /> Parar & Salvar
          </button>
        </div>
      </div>

      {/* Time Entries List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            📋 Entradas de Tempo
          </h3>
          <button
            onClick={handleExportInvoice}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="size-4" />
            Exportar Fatura
          </button>
        </div>

        <div className="space-y-2">
          {entries.map((entry) => {
            const earnings = calculateEarnings(entry.duration, entry.hourlyRate);
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {entry.projectName}
                  </p>
                  <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span>{entry.date}</span>
                    <span>{formatTime(entry.duration)}</span>
                    <span>R$ {entry.hourlyRate}/h</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    R$ {earnings.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total de Horas
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {(
              entries.reduce((sum, e) => sum + e.duration, 0) / 3600
            ).toFixed(1)}h
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Ganho
          </p>
          <p className="text-2xl font-bold text-green-600">
            R$ {totalEarnings.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Projetos
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {entries.length}
          </p>
        </div>
      </div>
    </div>
  );
}
