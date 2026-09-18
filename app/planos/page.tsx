'use client';
import { useState } from 'react';

export default function Planos() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: billing === 'monthly' ? 49 : 490,
      features: ['Até 5 projetos', 'Portfólio básico', 'Suporte por email', 'Análise de perfil'],
      cta: 'Começar grátis',
      icon: '🚀',
      popular: false,
    },
    {
      name: 'Pro',
      price: billing === 'monthly' ? 99 : 990,
      features: ['Projetos ilimitados', 'Portfólio premium', 'Suporte prioritário', 'Certo AI integrado', 'Relatórios avançados', 'Destaque nos resultados'],
      cta: 'Escolher plano',
      icon: '⭐',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Tudo do Pro', 'Gestor de conta dedicado', 'API customizada', 'Integração CRM', 'Treinamento da equipe', 'SLA garantido'],
      cta: 'Falar com time',
      icon: '👑',
      popular: false,
    },
  ];

  return (
    <>
      <style>{`
        .plans-page {
          min-height: 100vh;
          background: #f5f3ee;
        }
        .plans-hero {
          background: linear-gradient(135deg, #17134c 0%, #2a245b 100%);
          color: white;
          padding: 60px 40px;
          text-align: center;
        }
        .plans-hero h1 {
          margin: 0;
          font-size: clamp(42px, 8vw, 64px);
          line-height: 1.1;
          letter-spacing: -.05em;
        }
        .plans-hero p {
          margin: 16px 0 24px;
          font-size: 16px;
          color: #aaa5bf;
        }
        .billing-toggle {
          display: flex;
          justify-content: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 4px;
          width: fit-content;
          margin: 0 auto;
        }
        .billing-toggle button {
          border: 0;
          background: transparent;
          color: white;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .billing-toggle button.active {
          background: white;
          color: #17134c;
        }
        .plans-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .plan-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
          position: relative;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .plan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(29, 23, 79, 0.15);
        }
        .plan-card.popular {
          border: 3px solid #ef4b31;
          transform: scale(1.05);
        }
        .plan-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: #ef4b31;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }
        .plan-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .plan-name {
          font-size: 24px;
          font-weight: 700;
          color: #1d174f;
          margin: 0 0 8px;
        }
        .plan-price {
          font-size: 42px;
          font-weight: 700;
          color: #ef4b31;
          margin: 0 0 4px;
        }
        .plan-price small {
          font-size: 14px;
          color: #a8a3b5;
          font-weight: 400;
        }
        .plan-description {
          color: #5d5969;
          font-size: 13px;
          margin: 16px 0 24px;
          flex: 1;
        }
        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
        }
        .plan-features li {
          padding: 10px 0;
          border-bottom: 1px solid #ece9e4;
          font-size: 13px;
          color: #5d5969;
        }
        .plan-features li:before {
          content: '✓ ';
          color: #1f9b62;
          font-weight: 700;
          margin-right: 8px;
        }
        .plan-features li:last-child {
          border: 0;
        }
        .plan-cta {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .plan-card.popular .plan-cta {
          background: #ef4b31;
        }
        .plan-cta:hover {
          background: #d4381f;
          transform: translateY(-2px);
        }
        .plan-card:not(.popular) .plan-cta {
          background: #f5f3f0;
          color: #5d5969;
        }
        .plan-card:not(.popular) .plan-cta:hover {
          background: #ece9e4;
          color: #1d174f;
        }
        @media (max-width: 768px) {
          .plan-card.popular {
            transform: none;
          }
        }
      `}</style>

      <div className="plans-page">
        <div className="plans-hero">
          <h1>Planos que crescem com você</h1>
          <p>Escolha o melhor para seu negócio</p>
          
          <div className="billing-toggle">
            <button 
              className={billing === 'monthly' ? 'active' : ''}
              onClick={() => setBilling('monthly')}
            >
              📅 Mensal
            </button>
            <button 
              className={billing === 'annual' ? 'active' : ''}
              onClick={() => setBilling('annual')}
            >
              🎯 Anual (-17%)
            </button>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="plan-badge">⭐ Mais Popular</div>}
              
              <div className="plan-icon">{plan.icon}</div>
              <h2 className="plan-name">{plan.name}</h2>
              <div className="plan-price">
                {typeof plan.price === 'number' ? `R$ ${plan.price}` : plan.price}
                <small>{typeof plan.price === 'number' ? '/mês' : ''}</small>
              </div>
              <p className="plan-description">
                {plan.name === 'Starter' && 'Perfeito para começar'}
                {plan.name === 'Pro' && 'Para profissionais que crescem'}
                {plan.name === 'Enterprise' && 'Para empresas e equipes'}
              </p>

              <ul className="plan-features">
                {plan.features.map((feature, j) => (
                  <li key={j}>{feature}</li>
                ))}
              </ul>

              <button className="plan-cta">{plan.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
