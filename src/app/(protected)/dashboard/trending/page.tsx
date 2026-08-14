'use client';

import { TrendingUp, BarChart3 } from 'lucide-react';

export default function TrendingPage() {
  const skills = [
    { name: 'TypeScript/Next.js', growth: '+45%', demand: 'Muito Alto', projects: 2340, avgPrice: 8500 },
    { name: 'React', growth: '+38%', demand: 'Alto', projects: 2100, avgPrice: 7800 },
    { name: 'Python/AI', growth: '+52%', demand: 'Muito Alto', projects: 1890, avgPrice: 9200 },
    { name: 'DevOps/Kubernetes', growth: '+35%', demand: 'Alto', projects: 1240, avgPrice: 10500 },
    { name: 'Mobile (Flutter)', growth: '+28%', demand: 'Médio', projects: 890, avgPrice: 6500 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certo Trending</h1>
        <p className="text-gray-600">Top 5 skills com maior crescimento e demanda</p>
      </div>

      <div className="space-y-4">
        {skills.map((skill, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{i + 1}. {skill.name}</h3>
              <div className="flex items-center gap-2 text-green-600 font-bold">
                <TrendingUp className="w-5 h-5" />
                {skill.growth}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Demanda</p>
                <p className="font-semibold text-sm">{skill.demand}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Projetos/Mês</p>
                <p className="font-semibold text-sm">{skill.projects.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Preço Médio</p>
                <p className="font-semibold text-sm">R$ {(skill.avgPrice / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <button className="w-full bg-blue-500 text-white py-2 rounded text-sm font-semibold hover:bg-blue-600 transition">
                  Explorar
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(skill.projects / 2500) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">Taxa de crescimento este mês</p>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-12 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Insights de Mercado
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>📈 Python/AI teve crescimento de <strong>52%</strong> — maior oportunidade este mês</li>
          <li>💰 DevOps comanda preços mais altos (média R$ 10.5k)</li>
          <li>🚀 TypeScript continua dominando com <strong>2.3k projetos/mês</strong></li>
          <li>⚠️ Mobile (Flutter) tem crescimento moderado — nicho emergente</li>
        </ul>
      </div>
    </div>
  );
}
