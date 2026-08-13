'use client';

import { useState } from 'react';
import { DollarSign, Zap } from 'lucide-react';

export default function PricingPage() {
  const [skill, setSkill] = useState('Desenvolvimento Web');
  const [experience, setExperience] = useState('3-5 anos');
  const [complexity, setComplexity] = useState('Médio');
  const [recommended, setRecommended] = useState(5000);

  const handleCalculate = () => {
    const skillMultiplier: any = { 'Desenvolvimento Web': 1.2, 'Design': 0.9, 'Marketing': 1.0, 'DevOps': 1.4 };
    const expMultiplier: any = { '0-1 anos': 0.7, '1-3 anos': 1.0, '3-5 anos': 1.3, '5+ anos': 1.6 };
    const compMultiplier: any = { 'Baixo': 1.0, 'Médio': 1.2, 'Alto': 1.5, 'Muito Alto': 1.8 };

    const base = 3000;
    const calc =
      base *
      (skillMultiplier[skill] || 1) *
      (expMultiplier[experience] || 1) *
      (compMultiplier[complexity] || 1);

    setRecommended(Math.round(calc));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certo Preço</h1>
        <p className="text-gray-600">Recomendação inteligente de preços baseada em IA</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Skill Principal</label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option>Desenvolvimento Web</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>DevOps</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Experiência</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option>0-1 anos</option>
              <option>1-3 anos</option>
              <option>3-5 anos</option>
              <option>5+ anos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Complexidade do Projeto</label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option>Baixo</option>
              <option>Médio</option>
              <option>Alto</option>
              <option>Muito Alto</option>
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Calcular Preço
          </button>
        </div>

        {/* Result */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-8 flex flex-col justify-center">
          <p className="text-sm opacity-90 mb-2">PREÇO RECOMENDADO</p>
          <div className="mb-4">
            <p className="text-5xl font-bold">R$ {(recommended / 100).toFixed(0)}</p>
            <p className="text-sm opacity-90 mt-2">por projeto</p>
          </div>

          <div className="bg-white bg-opacity-20 rounded p-4 space-y-2">
            <p className="text-sm opacity-90">Baseado em:</p>
            <ul className="text-sm space-y-1">
              <li>✓ {skill}</li>
              <li>✓ {experience} experiência</li>
              <li>✓ Complexidade {complexity}</li>
              <li>✓ Mercado atual</li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-2">FAIXA RECOMENDADA</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-xs opacity-75 mb-1">Mínimo</p>
                <p className="font-bold text-lg">R$ {Math.round(recommended * 0.8)}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs opacity-75 mb-1">Máximo</p>
                <p className="font-bold text-lg">R$ {Math.round(recommended * 1.2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">📊 Dados de Mercado</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="opacity-75 mb-1">Preço Médio</p>
            <p className="font-bold">R$ 4.200</p>
          </div>
          <div>
            <p className="opacity-75 mb-1">Preço Min</p>
            <p className="font-bold">R$ 1.500</p>
          </div>
          <div>
            <p className="opacity-75 mb-1">Preço Max</p>
            <p className="font-bold">R$ 15.000</p>
          </div>
          <div>
            <p className="opacity-75 mb-1">Taxa Aceitação</p>
            <p className="font-bold">73%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
