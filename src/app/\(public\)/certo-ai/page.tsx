'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Check, Zap, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function CertoAILandingPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-blue-300">Novo! Powered by Claude AI</span>
        </div>

        <h1 className="text-6xl font-black text-white mb-6 leading-tight">
          Propostas que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Vencem</span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Reescreva suas propostas com IA. Aumente taxa de ganho em até 40%. Freelancers ganham 73% mais com Certo AI.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link
            href="/dashboard/certo-ai"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Começar Grátis
          </Link>
          <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition">
            Ver Demo
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-8 mb-16">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">1.2K+</div>
            <div className="text-sm text-slate-400">Usuários ativos</div>
          </div>
          <div className="w-px h-12 bg-slate-700"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">50K+</div>
            <div className="text-sm text-slate-400">Propostas otimizadas</div>
          </div>
          <div className="w-px h-12 bg-slate-700"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">73%</div>
            <div className="text-sm text-slate-400">Taxa de ganho média</div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-6xl mx-auto px-4 py-16 mb-16">
        <h2 className="text-4xl font-black text-white mb-12 text-center">Como Funciona</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Cole a Proposta', desc: 'Seu pitch atual' },
            { step: 2, title: 'IA Reescreve', desc: 'Claude otimiza' },
            { step: 3, title: 'Receba Score', desc: '0-100 taxa de ganho' },
            { step: 4, title: 'Copie & Envie', desc: 'Use a otimizada' },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -top-8 left-0 w-full text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold">
                  {item.step}
                </div>
              </div>
              <Card className="border-slate-700 bg-slate-800/50 pt-8">
                <CardContent className="text-center">
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </CardContent>
              </Card>
              {idx < 3 && (
                <div className="absolute top-6 -right-3 text-slate-600">
                  <Zap className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16 mb-16">
        <h2 className="text-4xl font-black text-white mb-12 text-center">Recursos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: 'Otimizador com IA',
              desc: 'Reescreve propostas com Claude 3.5 Sonnet',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Comparador',
              desc: 'Compare 2 propostas e veja qual é melhor',
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: 'Score de Qualidade',
              desc: 'Visualize taxa de ganho estimada (0-100%)',
            },
            {
              icon: <BarChart3 className="w-6 h-6" />,
              title: 'Insights & Analytics',
              desc: 'Veja padrões de propostas vencedoras',
            },
          ].map((feature, idx) => (
            <Card key={idx} className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="text-blue-400">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-6xl mx-auto px-4 py-16 mb-16">
        <h2 className="text-4xl font-black text-white mb-12 text-center">Planos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Grátis',
              price: 'R$ 0',
              desc: 'Teste agora',
              features: ['3 otimizações/mês', 'Comparador básico', 'Insights limitados'],
              cta: 'Começar Grátis',
              highlighted: false,
            },
            {
              name: 'Premium',
              price: 'R$ 19,90',
              desc: '/mês',
              features: ['Ilimitadas', 'Análise de concorrência', 'Sugestões avançadas', 'Exportar resultados'],
              cta: 'Upgrade Agora',
              highlighted: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              desc: 'Para agências',
              features: ['Tudo do Premium', 'API acesso', 'Account manager', 'SLA garantido'],
              cta: 'Falar com time',
              highlighted: false,
            },
          ].map((plan, idx) => (
            <Card
              key={idx}
              className={`border-2 transition ${
                plan.highlighted
                  ? 'border-blue-500 bg-blue-900/10 relative'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ Recomendado
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-400">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.desc}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    plan.highlighted
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 py-16 mb-16">
        <h2 className="text-4xl font-black text-white mb-12 text-center">Depoimentos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'João Dev',
              role: 'Desenvolvedor Full-Stack',
              text: 'Comecei com 30% de taxa de ganho. Com Certo AI, cheguei a 78%. Mudou minha vida.',
              avatar: '👨‍💻',
            },
            {
              name: 'Maria Designer',
              role: 'Designer UI/UX',
              text: 'As sugestões da IA são incríveis. Aprendo padrões que funcionam e aplico em todas as minhas propostas.',
              avatar: '👩‍🎨',
            },
            {
              name: 'Pedro Consultor',
              role: 'Consultor Estratégia',
              text: 'Ferramentas como essa deveriam ser obrigatórias para todo freelancer. Ganhei R$ 5k a mais no mês.',
              avatar: '👨‍💼',
            },
          ].map((testimonial, idx) => (
            <Card key={idx} className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center mb-16">
        <h2 className="text-4xl font-black text-white mb-4">Pronto para vencer mais propostas?</h2>
        <p className="text-xl text-slate-400 mb-8">
          Comece grátis com 3 otimizações. Upgrade quando precisar de ilimitado.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard/certo-ai"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition"
          >
            Começar Grátis
          </Link>
          <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition">
            Explorar Recursos
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center">
        <p className="text-slate-400 text-sm">
          © 2026 Certo AI — Powered by PrestaCerto & Anthropic Claude
        </p>
      </footer>
    </div>
  );
}
