import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, BarChart3, MessageSquare, Target } from 'lucide-react';
import Link from 'next/link';
import { SalesAgentDemo } from '@/components/sales-agent/demo';

export default function SalesAgentLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-200">IA que vende enquanto você dorme</span>
          </div>

          <h1 className="mb-6 text-5xl md:text-7xl font-bold text-white tracking-tight">
            Seu time de vendas
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              automatizado
            </span>
          </h1>

          <p className="mb-10 text-xl text-slate-300 max-w-2xl mx-auto">
            Agente de vendas IA que prospeita, qualifica e segue leads 24/7. Aumenta conversão, reduz custo por venda e não dorme.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Começar agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
              Ver demo ao vivo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: '24/7', desc: 'Prospecção contínua' },
            { label: '10x', desc: 'Mais leads qualificados' },
            { label: '-70%', desc: 'Custo por venda' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">{stat.label}</div>
              <div className="text-slate-300">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
          O que o agente faz
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              icon: Target,
              title: 'Prospecção Automática',
              desc: 'Busca prospects no setor, analisa site, LinkedIn, histórico de negócios',
            },
            {
              icon: MessageSquare,
              title: 'Mensagens Personalizadas',
              desc: 'Gera outreach por email/whatsapp com valor específico por prospect',
            },
            {
              icon: BarChart3,
              title: 'Scoring Inteligente',
              desc: 'Qualifica leads automaticamente: hot/warm/cold em tempo real',
            },
            {
              icon: Zap,
              title: 'Follow-up 24/7',
              desc: 'Segue leads sem resposta, ajusta tom, tira objeções com IA',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Live */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          Veja o agente em ação
        </h2>
        <SalesAgentDemo />
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
          Simples. Transparente. Escalável.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Startup',
              price: '$99',
              features: ['1 agente', '100 leads/mês', 'Email & Whatsapp', 'Suporte por email'],
            },
            {
              name: 'Growth',
              price: '$299',
              features: ['3 agentes', '1000 leads/mês', 'Email, Whatsapp, LinkedIn', 'Prioridade', 'Dashboard completo'],
              popular: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              features: ['Agentes ilimitados', 'Leads ilimitados', 'Todas as integrações', 'Suporte 24/7', 'API custom'],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-8 ${
                plan.popular
                  ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/50'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-emerald-400 mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-300">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'border-slate-600 text-white hover:bg-slate-800'
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Começar
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Pronto para vender mais?
        </h2>
        <p className="text-xl text-slate-400 mb-10">
          Seus primeiros 10 leads qualificados saem hoje.
        </p>
        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white">
          Começar 7 dias grátis <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </div>
  );
}
