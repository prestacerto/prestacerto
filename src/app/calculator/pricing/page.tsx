'use client';

import { useState } from 'react';
import { Calculator, Mail } from 'lucide-react';

const SKILL_MULTIPLIERS: Record<string, number> = {
  'Desenvolvimento': 1.0,
  'Design': 0.85,
  'Copywriting': 0.7,
  'Consultoria': 1.2,
  'Fotografia': 0.8,
  'Video': 1.1,
  'Marketing': 0.9,
  'Tradução': 0.6,
};

const EXPERIENCE_LEVELS = {
  'Iniciante (0-1 ano)': 0.7,
  'Junior (1-3 anos)': 1.0,
  'Pleno (3-5 anos)': 1.4,
  'Senior (5-10 anos)': 1.8,
  'Expert (10+ anos)': 2.2,
};

export default function PricingCalculator() {
  const [skill, setSkill] = useState('Desenvolvimento');
  const [experience, setExperience] = useState('Pleno (3-5 anos)');
  const [location, setLocation] = useState('São Paulo');
  const [projectType, setProjectType] = useState('horaria');
  const [hours, setHours] = useState(40);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Base hourly rate (R$ 50/h como referência)
  const baseRate = 50;
  const skillMultiplier = SKILL_MULTIPLIERS[skill] || 1.0;
  const experienceMultiplier = EXPERIENCE_LEVELS[experience] || 1.0;

  // Ajuste por localização
  const locationMultiplier = location === 'São Paulo' ? 1.2 : location === 'Rio de Janeiro' ? 1.1 : 1.0;

  const hourlyRate = Math.round(baseRate * skillMultiplier * experienceMultiplier * locationMultiplier);
  const monthlyRate = hourlyRate * 160; // 160 horas/mês
  const projectRate = projectType === 'horaria' ? monthlyRate : Math.round(monthlyRate * 2.5); // Projetos = 2.5x mais

  const handleEmailSubmit = async () => {
    if (!email) return;

    try {
      await fetch('/api/calculator/send-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          skill,
          experience,
          hourlyRate,
          monthlyRate,
          projectRate,
        }),
      });
      setEmailSent(true);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-10 h-10 text-blue-400" />
            Calculadora de Precificação
          </h1>
          <p className="text-slate-400">Descubra quanto você deve cobrar pelos seus serviços</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Skill */}
            <div>
              <label className="block text-white font-semibold mb-2">Sua Especialidade</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {Object.keys(SKILL_MULTIPLIERS).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-white font-semibold mb-2">Sua Experiência</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {Object.keys(EXPERIENCE_LEVELS).map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-white font-semibold mb-2">Localização Principal</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option>São Paulo</option>
                <option>Rio de Janeiro</option>
                <option>Belo Horizonte</option>
                <option>Curitiba</option>
                <option>Brasília</option>
                <option>Outras</option>
              </select>
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-white font-semibold mb-2">Tipo de Trabalho</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="horaria"
                    checked={projectType === 'horaria'}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Trabalho por Hora</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="projeto"
                    checked={projectType === 'projeto'}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Trabalho por Projeto</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-br from-blue-600/20 to-slate-800/30 border border-blue-600/30 rounded-lg p-8 flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Taxa Horária Recomendada</p>
              <p className="text-5xl font-bold text-emerald-400 mb-8">
                R$ {hourlyRate}
                <span className="text-2xl text-slate-400">/h</span>
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-1">Renda Mensal (160h/mês)</p>
                  <p className="text-2xl font-bold text-white">R$ {monthlyRate.toLocaleString('pt-BR')}</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-1">
                    {projectType === 'horaria' ? 'Valor por Projeto Médio' : 'Preço Recomendado por Projeto'}
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">R$ {projectRate.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4 text-sm text-blue-300">
                <p className="font-semibold mb-2">💡 Recomendações:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Comece com este valor como referência</li>
                  <li>• Aumente conforme ganha experiência</li>
                  <li>• Projetos complexos = maior valor</li>
                  <li>• Clientes recorrentes = desconto pequeno</li>
                </ul>
              </div>
            </div>

            {/* Email capture */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-slate-400 text-sm mb-3">Receba essas dicas no seu email:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="flex-1 bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleEmailSubmit}
                  disabled={!email || emailSent}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm"
                >
                  {emailSent ? '✓ Enviado' : <Mail className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600/20 to-slate-800/30 border border-emerald-600/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Pronto para ganhar R$ {monthlyRate.toLocaleString('pt-BR')}/mês?
          </h2>
          <p className="text-slate-400 mb-6">
            Crie sua conta no PrestaCerto e comece a receber projetos com esses valores
          </p>
          <a
            href="/signup"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition"
          >
            Criar Conta Grátis →
          </a>
        </div>
      </div>
    </div>
  );
}
