'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, MapPin, DollarSign } from 'lucide-react';

interface MarketData {
  skill: string;
  category: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  demand: number;
  trend: 'up' | 'down' | 'stable';
  city: string;
}

export default function MarketDashboard() {
  const [data, setData] = useState<MarketData[]>([]);
  const [selectedCity, setSelectedCity] = useState('São Paulo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular dados de mercado
        const mockData: MarketData[] = [
          {
            skill: 'React',
            category: 'Frontend',
            avg_price: 2800,
            min_price: 1800,
            max_price: 4500,
            demand: 35,
            trend: 'up',
            city: 'São Paulo',
          },
          {
            skill: 'Node.js',
            category: 'Backend',
            avg_price: 3200,
            min_price: 2000,
            max_price: 5000,
            demand: 28,
            trend: 'stable',
            city: 'São Paulo',
          },
          {
            skill: 'UI/UX Design',
            category: 'Design',
            avg_price: 2200,
            min_price: 1500,
            max_price: 3500,
            demand: 22,
            trend: 'down',
            city: 'São Paulo',
          },
          {
            skill: 'Copywriting',
            category: 'Content',
            avg_price: 1800,
            min_price: 1000,
            max_price: 3000,
            demand: 18,
            trend: 'up',
            city: 'São Paulo',
          },
          {
            skill: 'Fotografia',
            category: 'Visual',
            avg_price: 1500,
            min_price: 800,
            max_price: 2500,
            demand: 15,
            trend: 'stable',
            city: 'São Paulo',
          },
        ];
        setData(mockData);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-blue-400" />
            Dashboard de Mercado
          </h1>
          <p className="text-slate-400 mb-6">Preços médios esta semana em {selectedCity}</p>

          <div className="flex gap-2 flex-wrap">
            {['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Market Data Cards */}
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.skill}
              className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                {/* Skill */}
                <div>
                  <p className="text-slate-400 text-xs mb-1">Skill</p>
                  <p className="text-white font-bold text-lg">{item.skill}</p>
                  <p className="text-slate-500 text-xs">{item.category}</p>
                </div>

                {/* Avg Price */}
                <div>
                  <p className="text-slate-400 text-xs mb-1">Preço Médio</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <p className="text-2xl font-bold text-emerald-400">
                      R$ {item.avg_price.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Range */}
                <div>
                  <p className="text-slate-400 text-xs mb-1">Faixa de Preço</p>
                  <p className="text-slate-300 text-sm">
                    R$ {item.min_price.toLocaleString('pt-BR')} - R$ {item.max_price.toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Demand */}
                <div>
                  <p className="text-slate-400 text-xs mb-1">Demanda</p>
                  <p className="text-lg font-bold text-blue-400">{item.demand} projetos</p>
                </div>

                {/* Trend */}
                <div className="text-right">
                  <p className="text-slate-400 text-xs mb-1">Tendência</p>
                  <div className="flex items-center justify-end gap-2">
                    {item.trend === 'up' ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">⬆️ +15%</span>
                      </>
                    ) : item.trend === 'down' ? (
                      <>
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 font-bold">⬇️ -8%</span>
                      </>
                    ) : (
                      <span className="text-amber-400 font-bold">→ Estável</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-blue-600/10 border border-blue-600/30 rounded-lg p-6">
          <h3 className="text-white font-bold mb-3">💡 Dicas para Precificar</h3>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>• Comece na faixa mínima se for iniciante</li>
            <li>• Aumente conforme ganha reviews e experiência</li>
            <li>• Skills em alta demanda = maior valor</li>
            <li>• Projetos complexos = acrescente 30-50%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
