"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PRODUTOS = [
  // FASE 1
  {
    id: 1,
    name: "🎯 CERTO MATCH",
    slug: "match",
    category: "Matching",
    phase: 1,
    price: 2.9,
    pricingType: "per-proposal",
    status: "live",
    description: "IA Matching - Descubra sua chance de ganhar cada projeto",
    mrr: 2900,
    assinifyUrl: "https://assinify.com.br/certo-match",
  },
  {
    id: 2,
    name: "💰 CERTO PREÇO",
    slug: "preco",
    category: "Pricing",
    phase: 1,
    price: 14.9,
    pricingType: "monthly",
    status: "building",
    description: "Dynamic Pricing - Recomendação de preço ótimo baseado em IA",
    mrr: 22000,
    assinifyUrl: "https://assinify.com.br/certo-preco",
  },
  {
    id: 3,
    name: "⏰ CERTO TIMING",
    slug: "timing",
    category: "Timing",
    phase: 1,
    price: 9.9,
    pricingType: "monthly",
    status: "building",
    description: "Hora de Ouro - Melhor momento para enviar suas propostas",
    mrr: 18000,
    assinifyUrl: "https://assinify.com.br/certo-timing",
  },
  // FASE 2
  {
    id: 4,
    name: "📊 DASHBOARD IA",
    slug: "dashboard-ia",
    category: "Intelligence",
    phase: 2,
    price: 49.9,
    pricingType: "monthly",
    status: "planned",
    description: "Dashboard inteligente com Match, Pricing, Timing, Insights",
    mrr: 74850,
    assinifyUrl: "https://assinify.com.br/certo-dashboard-ia",
  },
  {
    id: 5,
    name: "🔍 INSIGHTS",
    slug: "insights",
    category: "Intelligence",
    phase: 2,
    price: 24.9,
    pricingType: "monthly",
    status: "planned",
    description: "Market Intelligence - Skills trending, salários, competição",
    mrr: 37425,
    assinifyUrl: "https://assinify.com.br/certo-insights",
  },
  {
    id: 6,
    name: "🏆 BADGE",
    slug: "badge",
    category: "Intelligence",
    phase: 2,
    price: 19.9,
    pricingType: "monthly",
    status: "planned",
    description: "Badges verificadas - Top Performer, Verified Pro, Trending",
    mrr: 29850,
    assinifyUrl: "https://assinify.com.br/certo-badge",
  },
  {
    id: 7,
    name: "📜 CERTIFICAÇÃO",
    slug: "certificacao",
    category: "Intelligence",
    phase: 2,
    price: 29.9,
    pricingType: "one-time",
    status: "planned",
    description: "Skills Certification - Mini-teste + projeto + review",
    mrr: 44850,
    assinifyUrl: "https://assinify.com.br/certo-certificacao",
  },
  {
    id: 8,
    name: "📚 BIBLIOTECA PROPOSTA",
    slug: "biblioteca-proposta",
    category: "Intelligence",
    phase: 2,
    price: 19.9,
    pricingType: "monthly",
    status: "planned",
    description: "Histórico de propostas vencedoras (privadas)",
    mrr: 29850,
    assinifyUrl: "https://assinify.com.br/certo-biblioteca-proposta",
  },
  {
    id: 9,
    name: "🎨 PORTFOLIO IA",
    slug: "portfolio-ia",
    category: "Intelligence",
    phase: 2,
    price: 12.9,
    pricingType: "monthly",
    status: "planned",
    description: "Portfolio auto-gerado de seus melhores projetos",
    mrr: 19350,
    assinifyUrl: "https://assinify.com.br/certo-portfolio-ia",
  },
  {
    id: 10,
    name: "📧 FOLLOW-UP IA",
    slug: "followup-ia",
    category: "Intelligence",
    phase: 2,
    price: 12.9,
    pricingType: "monthly",
    status: "planned",
    description: "Auto-sequência inteligente de follow-ups (dia 3, 5, 7)",
    mrr: 19350,
    assinifyUrl: "https://assinify.com.br/certo-followup-ia",
  },
  {
    id: 11,
    name: "💬 CONTRA-PROPOSTA IA",
    slug: "contraproposta-ia",
    category: "Intelligence",
    phase: 2,
    price: 9.9,
    pricingType: "monthly",
    status: "planned",
    description: "Gera contra-propostas profissionais baseado em orçamento",
    mrr: 14850,
    assinifyUrl: "https://assinify.com.br/certo-contraproposta-ia",
  },
  // FASE 3
  {
    id: 12,
    name: "📋 CURRÍCULO",
    slug: "curriculo",
    category: "Tools",
    phase: 3,
    price: 0,
    pricingType: "free",
    status: "planned",
    description: "Seu currículo no PrestaCerto (otimizado, com histórico)",
    mrr: 0,
    assinifyUrl: null,
  },
  {
    id: 13,
    name: "🔐 ESCROW",
    slug: "escrow",
    category: "Payments",
    phase: 3,
    price: 5,
    pricingType: "commission",
    status: "planned",
    description: "Pagamento seguro com intermediário",
    mrr: 74500,
    assinifyUrl: null,
  },
  {
    id: 14,
    name: "📍 MILESTONES",
    slug: "milestones",
    category: "Payments",
    phase: 3,
    price: 2,
    pricingType: "commission",
    status: "planned",
    description: "Pagamento por etapa de projeto",
    mrr: 29800,
    assinifyUrl: null,
  },
  {
    id: 15,
    name: "📈 ANALYTICS CLIENTE",
    slug: "analytics-cliente",
    category: "Tools",
    phase: 3,
    price: 49.9,
    pricingType: "monthly",
    status: "planned",
    description: "Dashboard para cliente ver progresso do projeto",
    mrr: 74850,
    assinifyUrl: "https://assinify.com.br/certo-analytics-cliente",
  },
  {
    id: 16,
    name: "⚖️ CONTRATO IA",
    slug: "contrato-ia",
    category: "Tools",
    phase: 3,
    price: 24.9,
    pricingType: "monthly",
    status: "planned",
    description: "Contrato automático gerado por IA",
    mrr: 37425,
    assinifyUrl: "https://assinify.com.br/certo-contrato-ia",
  },
  {
    id: 17,
    name: "🧪 QA AUTOMÁTICO",
    slug: "qa-automatico",
    category: "Tools",
    phase: 3,
    price: 34.9,
    pricingType: "monthly",
    status: "planned",
    description: "Teste automático de website/design antes de aprovar",
    mrr: 52350,
    assinifyUrl: "https://assinify.com.br/certo-qa-automatico",
  },
  {
    id: 18,
    name: "👑 VIP NETWORK",
    slug: "vip-network",
    category: "Tools",
    phase: 3,
    price: 999.9,
    pricingType: "monthly",
    status: "planned",
    description: "Network exclusivo com leads premium (R$ 5k+)",
    mrr: 1499850,
    assinifyUrl: "https://assinify.com.br/certo-vip-network",
  },
  {
    id: 19,
    name: "💬 COMMUNITY",
    slug: "community",
    category: "Tools",
    phase: 3,
    price: 39.9,
    pricingType: "monthly",
    status: "planned",
    description: "Discord/Slack privado com networking",
    mrr: 59850,
    assinifyUrl: "https://assinify.com.br/certo-community",
  },
  // FASE 4
  {
    id: 20,
    name: "🎓 ACADEMY",
    slug: "academy",
    category: "Education",
    phase: 4,
    price: 297,
    pricingType: "one-time",
    status: "planned",
    description: "Cursos online com certificados",
    mrr: 445500,
    assinifyUrl: "https://assinify.com.br/certo-academy",
  },
  {
    id: 21,
    name: "📄 TEMPLATES",
    slug: "templates",
    category: "Education",
    phase: 4,
    price: 29.9,
    pricingType: "monthly",
    status: "planned",
    description: "Biblioteca de templates (propostas, contracts, etc)",
    mrr: 44850,
    assinifyUrl: "https://assinify.com.br/certo-templates",
  },
  {
    id: 22,
    name: "🧾 INVOICE",
    slug: "invoice",
    category: "Payments",
    phase: 4,
    price: 19.9,
    pricingType: "monthly",
    status: "planned",
    description: "NF-e automática integrado com Supabase",
    mrr: 29850,
    assinifyUrl: "https://assinify.com.br/certo-invoice",
  },
  {
    id: 23,
    name: "✉️ COLD EMAIL",
    slug: "cold-email",
    category: "Education",
    phase: 4,
    price: 79.9,
    pricingType: "monthly",
    status: "planned",
    description: "IA gera emails personalizados para conseguir projetos",
    mrr: 119850,
    assinifyUrl: "https://assinify.com.br/certo-cold-email",
  },
  {
    id: 24,
    name: "💳 TAX",
    slug: "tax",
    category: "Payments",
    phase: 4,
    price: 49.9,
    pricingType: "monthly",
    status: "live",
    description: "Cálculo automático de IR + INSS (70% pronto)",
    mrr: 74850,
    assinifyUrl: "https://assinify.com.br/certo-tax",
  },
  {
    id: 25,
    name: "⭐ DESTAQUE",
    slug: "destaque",
    category: "Visibility",
    phase: 4,
    price: 99.9,
    pricingType: "monthly",
    status: "planned",
    description: "Destaque pago na busca (como Featured Projects)",
    mrr: 149850,
    assinifyUrl: "https://assinify.com.br/certo-destaque",
  },
  {
    id: 26,
    name: "🎯 CANDIDATO",
    slug: "candidato",
    category: "Visibility",
    phase: 4,
    price: 0,
    pricingType: "free",
    status: "planned",
    description: "Ser candidato recomendado para clientes",
    mrr: 0,
    assinifyUrl: null,
  },
  {
    id: 27,
    name: "🌟 CERTO PREMIUM",
    slug: "certo-premium",
    category: "Tier",
    phase: 4,
    price: 199.9,
    pricingType: "monthly",
    status: "planned",
    description: "Tier premium para top performers (badge especial, boost)",
    mrr: 299700,
    assinifyUrl: "https://assinify.com.br/certo-premium",
  },
];

export default function ProdutosPage() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [totalMRR, setTotalMRR] = useState(0);

  useEffect(() => {
    const total = PRODUTOS.reduce((sum, p) => sum + p.mrr, 0);
    setTotalMRR(total);
  }, []);

  const filteredProducts = selectedPhase
    ? PRODUTOS.filter((p) => p.phase === selectedPhase)
    : PRODUTOS;

  const statusColors = {
    live: "bg-green-100 text-green-800 border-green-300",
    building: "bg-yellow-100 text-yellow-800 border-yellow-300",
    planned: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const phaseNames = {
    1: "🚀 FASE 1 - TOP 3 (Week 1-2)",
    2: "🧠 FASE 2 - INTELIGÊNCIA (Week 3-6)",
    3: "🛠️ FASE 3 - CLIENT TOOLS (Week 7-10)",
    4: "👥 FASE 4 - COMUNIDADE (Week 11-14)",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">
            🌟 CERTO ECOSYSTEM — 27 Produtos
          </h1>
          <p className="text-purple-200 text-lg mb-6">
            Ecosistema completo de monetização para freelancers do Brasil
          </p>

          {/* MRR Total */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 inline-block">
            <p className="text-sm opacity-90">Projeção MRR Total (100% implementado)</p>
            <p className="text-4xl font-bold">
              R$ {(totalMRR / 1000).toFixed(0)}k/mês
            </p>
          </div>
        </div>

        {/* Phase Selector */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedPhase(null)}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selectedPhase === null
                ? "bg-purple-600 text-white"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            Todos (27)
          </button>
          {[1, 2, 3, 4].map((phase) => (
            <button
              key={phase}
              onClick={() => setSelectedPhase(phase)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                selectedPhase === phase
                  ? "bg-purple-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              Fase {phase}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="space-y-12">
          {[1, 2, 3, 4].map((phase) => {
            const phaseProducts = PRODUTOS.filter((p) => p.phase === phase);
            if (selectedPhase && selectedPhase !== phase) return null;

            return (
              <div key={phase}>
                <h2 className="text-2xl font-bold mb-6 text-purple-300">
                  {phaseNames[phase as keyof typeof phaseNames]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {phaseProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            {product.name}
                          </h3>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                              statusColors[
                                product.status as keyof typeof statusColors
                              ]
                            }`}
                          >
                            {product.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-300 text-sm mb-4">
                        {product.description}
                      </p>

                      {/* Pricing */}
                      <div className="bg-slate-700 rounded p-3 mb-4">
                        <p className="text-xs text-slate-400 mb-1">
                          {product.pricingType === "monthly" && "Mensalidade"}
                          {product.pricingType === "one-time" && "Uma única vez"}
                          {product.pricingType === "per-proposal" &&
                            "Por proposta"}
                          {product.pricingType === "commission" && "Comissão"}
                          {product.pricingType === "free" && "Gratuito"}
                        </p>
                        <p className="text-2xl font-bold">
                          {product.price === 0 ? (
                            "Free"
                          ) : (
                            <>
                              R$ {product.price.toFixed(2)}
                              {product.pricingType === "monthly" && "/mês"}
                              {product.pricingType === "commission" && "%"}
                            </>
                          )}
                        </p>
                        {product.mrr > 0 && (
                          <p className="text-xs text-green-400 mt-2">
                            Potencial: R$ {(product.mrr / 1000).toFixed(1)}k/mês
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      {product.assinifyUrl ? (
                        <a
                          href={product.assinifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg text-center transition mb-3"
                        >
                          Assinar
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-slate-600 text-slate-400 font-semibold py-3 rounded-lg cursor-not-allowed mb-3"
                        >
                          Em breve
                        </button>
                      )}

                      {/* Demo Link */}
                      {product.status === "live" && (
                        <Link
                          href={`/dashboard/products/${product.slug}`}
                          className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg text-center transition text-sm"
                        >
                          Ver Demo
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-20 bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">📊 Roadmap de Implementação</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-purple-300 font-semibold">Fase 1</p>
              <p className="text-sm text-slate-300">3 produtos</p>
              <p className="text-lg font-bold">R$ 69k/mês</p>
            </div>
            <div>
              <p className="text-purple-300 font-semibold">Fase 2</p>
              <p className="text-sm text-slate-300">8 produtos</p>
              <p className="text-lg font-bold">+R$ 309k/mês</p>
            </div>
            <div>
              <p className="text-purple-300 font-semibold">Fase 3</p>
              <p className="text-sm text-slate-300">8 produtos</p>
              <p className="text-lg font-bold">+R$ 193k/mês</p>
            </div>
            <div>
              <p className="text-purple-300 font-semibold">Fase 4</p>
              <p className="text-sm text-slate-300">8 produtos</p>
              <p className="text-lg font-bold">+R$ 174k/mês</p>
            </div>
          </div>
          <p className="text-slate-400 mt-6 text-sm">
            Total: 27 produtos | R$ 745k/mês em potencial MRR
          </p>
        </div>
      </div>
    </div>
  );
}
