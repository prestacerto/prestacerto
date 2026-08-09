import { Wand2, TrendingUp, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Certo AI — Assistente de Propostas com IA | PrestaCerto",
  description: "Aumentar suas chances de ganhar projetos em 35% com Certo AI. Otimizador de propostas com inteligência artificial.",
};

export default function CertoAILanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Wand2 size={16} />
            <span className="text-sm font-semibold">Novo em PrestaCerto</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Propostas que <span className="text-blue-600">Ganham</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Certo AI reescreve suas propostas com inteligência artificial. Resultado: +35% de taxa de ganho e mais projetos contratados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard/certo-ai"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
            >
              Testar Grátis <ArrowRight size={20} />
            </Link>
            <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-900 px-8 py-3 rounded-lg font-bold">
              Ver Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-600" />
              <span>1,200+ freelancers ativos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-600" />
              <span>50K+ propostas otimizadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-600" />
              <span>99.9% uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "✍️",
                title: "Cole sua proposta",
                description: "Escreva normalmente, do seu jeito.",
              },
              {
                icon: "🤖",
                title: "IA reescreve",
                description: "Certo AI melhora tom, clareza e persuasão.",
              },
              {
                icon: "📈",
                title: "Ganhe mais projetos",
                description: "Taxa de ganho +35% vs. propostas normais.",
              },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Recursos Inclusos</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "✨ Otimizador de Propostas — Reescreve com IA",
              "⚖️ Comparar Propostas — Vê qual é melhor",
              "📊 Padrões de Vencedores — Aprenda o que funciona",
              "💡 Sugestões de Melhoria — Feedback automático",
              "🔥 Taxa de Ganho Estimada — Sabe antes de enviar",
              "📱 Mobile-friendly — Otimize de qualquer lugar",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Planos Simples</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold mb-2">Grátis</h3>
              <p className="text-gray-600 mb-6">Teste sem compromisso</p>
              <p className="text-4xl font-bold mb-6">
                R$ 0 <span className="text-lg text-gray-600">/mês</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>3 otimizações/mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Comparar propostas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Insights básicos</span>
                </li>
              </ul>
              <button className="w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-50">
                Começar Grátis
              </button>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white relative border-4 border-blue-600 md:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full font-bold text-sm">
                POPULAR
              </div>

              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-blue-100 mb-6">Melhor relação custo-benefício</p>
              <p className="text-4xl font-bold mb-6">
                R$ 19,90 <span className="text-lg text-blue-100">/mês</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-300" />
                  <span>Otimizações ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-300" />
                  <span>Análise de concorrência</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-300" />
                  <span>Insights avançados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-300" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-gray-100">
                Assinar Agora
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Para agências e times</p>
              <p className="text-4xl font-bold mb-6">
                Custom <span className="text-lg text-gray-600">/mês</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Tudo do Premium</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Múltiplas contas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>API custom</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Dedicado Account Manager</span>
                </li>
              </ul>
              <button className="w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-50">
                Contatar Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pronto para Ganhar Mais?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece grátis. Sem cartão de crédito. Sem compromisso.
          </p>
          <Link
            href="/dashboard/certo-ai"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Testar Agora <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
