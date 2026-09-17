"use client";

import { useState } from "react";
import { MatchScore } from "@/lib/certo-ecosystem/match-engine";

export default function CertoMatchPage() {
  const [projectTitle, setProjectTitle] = useState("");
  const [budget, setBudget] = useState(5000);
  const [skills, setSkills] = useState("React, Node.js, TypeScript");
  const [hourlyRate, setHourlyRate] = useState(100);
  const [totalProjects, setTotalProjects] = useState(50);
  const [rating, setRating] = useState(4.8);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchScore | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectData: {
            title: projectTitle,
            description: "Test project",
            budget,
            skills_required: skills.split(",").map((s) => s.trim()),
            duration: "40",
            experience_level: "intermediate",
            client_country: "BR",
          },
          freelancerProfile: {
            skills: skills.split(",").map((s) => s.trim()),
            hourly_rate: hourlyRate,
            total_projects: totalProjects,
            success_rate: 75,
            avg_rating: rating,
            years_experience: 5,
            portfolio_items: 15,
            response_time_hours: 2,
            specialization: "Web Development",
          },
        }),
      });

      const data = await response.json();
      if (data.matchScore) {
        setMatchResult(data.matchScore);
      }
    } catch (error) {
      console.error("Erro ao calcular match:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            🎯 Certo Match — IA Matching
          </h1>
          <p className="text-gray-600 mt-2">
            Descubra sua chance de ganhar cada projeto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Simule seu Match
            </h2>

            <input
              type="text"
              placeholder="Título do projeto"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget: R$ {budget.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <input
              type="text"
              placeholder="Skills (separadas por vírgula)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sua Taxa Horária: R$ {hourlyRate}
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projetos Concluídos: {totalProjects}
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={totalProjects}
                onChange={(e) => setTotalProjects(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating: {rating}⭐
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Calculando..." : "🚀 Calcular Match"}
            </button>
          </div>

          {/* Resultados */}
          {matchResult && (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-sm text-gray-600 mb-2">Match Score</h3>
                <div className="flex items-center justify-between">
                  <div className="text-5xl font-bold text-blue-600">
                    {matchResult.overallScore}
                  </div>
                  <div className="w-32 h-32 rounded-full border-8 border-blue-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {matchResult.winChance}%
                      </div>
                      <div className="text-xs text-gray-500">Win Chance</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(matchResult.matchBreakdown).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 w-12 text-right">
                          {value}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Recommended Bid */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
                <p className="text-sm opacity-90">Recomendado Cobrar</p>
                <p className="text-4xl font-bold">
                  R$ {matchResult.recommendedBid.toLocaleString()}
                </p>
              </div>

              {/* Recommendations */}
              {matchResult.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
                  {matchResult.recommendations.map((rec, i) => (
                    <p key={i} className="text-sm text-yellow-900">
                      {rec}
                    </p>
                  ))}
                </div>
              )}

              {/* Should Apply */}
              <div
                className={`rounded-lg p-4 text-center ${
                  matchResult.shouldApply
                    ? "bg-green-100 border border-green-300"
                    : "bg-red-100 border border-red-300"
                }`}
              >
                <p
                  className={`font-semibold ${
                    matchResult.shouldApply
                      ? "text-green-900"
                      : "text-red-900"
                  }`}
                >
                  {matchResult.shouldApply
                    ? "✅ Você deveria aplicar!"
                    : "⚠️ Pode não ser a melhor fit"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Como Funciona
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>
              ✨ <strong>Skills Match:</strong> Compara suas skills com o projeto
            </li>
            <li>
              💰 <strong>Rate Match:</strong> Verifica se seu preço é competitivo
            </li>
            <li>
              🏆 <strong>Experience Match:</strong> Analisa seu histórico
            </li>
            <li>
              ⭐ <strong>Rating Impact:</strong> Quanto sua avaliação ajuda
            </li>
            <li>
              🎯 <strong>Win Chance:</strong> Probabilidade de ganhar aquele
              projeto
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
