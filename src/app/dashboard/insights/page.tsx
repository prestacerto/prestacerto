'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [trending, setTrending] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [insRes, trendRes] = await Promise.all([
        fetch('/api/insights/market?user_id=test'),
        fetch('/api/trending/alerts'),
      ]);

      const insData = await insRes.json();
      const trendData = await trendRes.json();

      setInsights(insData);
      setTrending(trendData);
    } catch (error) {
      toast.error('Erro ao carregar insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Carregando market intelligence...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* TRENDING ALERT */}
      {trending?.push_notification && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-lg">
          <div className="text-2xl font-bold mb-2">🔥 ALERTA TRENDING</div>
          <p className="text-lg mb-4">{trending.push_notification.message}</p>
          <button className="bg-white text-red-600 px-6 py-2 rounded font-bold hover:bg-gray-100">
            Ativar Notificações Push
          </button>
        </div>
      )}

      {/* SKILLS TRENDING */}
      <div>
        <h2 className="text-3xl font-bold mb-4">📈 Skills em Trending Agora</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trending?.trending_now?.map((skill: any, idx: number) => (
            <div key={idx} className="p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{skill.skill}</h3>
                <span className={`text-lg ${idx === 0 ? '🔥' : '⬆️'}`}>{skill.growth}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{skill.demand_level}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Projetos esta semana</p>
                  <p className="font-bold">{skill.projects_this_week}</p>
                </div>
                <div>
                  <p className="text-gray-500">Preço médio</p>
                  <p className="font-bold">R$ {skill.avg_project.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSIGHTS */}
      {insights?.market_intelligence && (
        <div>
          <h2 className="text-3xl font-bold mb-4">💡 Recomendação de IA</h2>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Skill que você DEVERIA aprender</p>
                <p className="text-2xl font-bold text-green-700">
                  {insights.market_intelligence.recommendation.best_skill_to_learn}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">ROI Esperado</p>
                  <p className="text-xl font-bold">{insights.market_intelligence.recommendation.roi}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tempo pra aprender</p>
                  <p className="text-xl font-bold">{insights.market_intelligence.recommendation.time_to_learn}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded mt-4">
                <p className="text-sm text-gray-600 mb-1">Previsão de aumento</p>
                <p className="text-lg font-bold text-green-600">
                  {insights.market_intelligence.recommendation.expected_price_increase}
                </p>
              </div>
            </div>
            <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
              ✅ Iniciar Aprendizado
            </button>
          </div>
        </div>
      )}

      {/* SALARY BENCHMARKS */}
      {insights?.market_intelligence?.salary_benchmarks && (
        <div>
          <h2 className="text-3xl font-bold mb-4">💰 Benchmarks de Salário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.market_intelligence.salary_benchmarks.map((item: any, idx: number) => (
              <div key={idx} className="p-4 border rounded-lg">
                <h3 className="font-bold mb-3">{item.skill}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Junior:</span>
                    <span className="font-bold">{item.junior}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mid:</span>
                    <span className="font-bold">{item.mid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Senior:</span>
                    <span className="font-bold">{item.senior}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
