'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp } from 'lucide-react';

export default function TimingPage() {
  const [optimal, setOptimal] = useState({ day: 'Terça', time: '09:00', confidence: 87 });
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    const data = days.flatMap(day =>
      hours.slice(6, 20).map(hour => ({
        day,
        time: hour,
        score: Math.floor(Math.random() * 40 + 40),
        volume: Math.floor(Math.random() * 100),
      }))
    );

    setSchedule(data.sort((a, b) => b.score - a.score).slice(0, 10));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certo Timing</h1>
        <p className="text-gray-600">Encontre o melhor momento para enviar suas propostas</p>
      </div>

      {/* Optimal Time */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-lg mb-8">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Clock className="w-12 h-12" />
          </div>
          <div>
            <p className="text-sm opacity-90">MELHOR MOMENTO PARA ENVIAR</p>
            <p className="text-4xl font-bold">{optimal.time}</p>
            <p className="text-lg opacity-90">{optimal.day}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-32 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${optimal.confidence}%` }} />
              </div>
              <span className="text-sm">{optimal.confidence}% confiança</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Times */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top 10 Melhores Horários</h2>
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Dia</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Horário</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Volume de Buscas</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium">{slot.day}</td>
                  <td className="px-6 py-3 text-sm">{slot.time}</td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${slot.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-purple-600">{slot.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    {slot.volume} buscas
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">💡 Dicas de Timing</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Terças e quartas são os melhores dias</li>
          <li>✓ Manhã (7-10h) tem maior taxa de resposta</li>
          <li>✓ Evite fins de semana e fins de mês</li>
          <li>✓ Horário do cliente influencia taxa de aceitação</li>
        </ul>
      </div>
    </div>
  );
}
