'use client';
import { useState } from 'react';

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'free',
      name: 'Grátis',
      price: 0,
      features: ['Até 5 propostas/mês', 'Portfólio básico', 'Suporte por email'],
      cta: 'Você está aqui',
      disabled: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 99,
      savings: '3 meses grátis no anual',
      features: [
        '✓ Propostas ilimitadas',
        '✓ Portfólio premium com destaque',
        '✓ Certo AI integrado',
        '✓ Suporte prioritário via chat',
        '✓ Análise de performance',
        '✓ Candidaturas com créditos',
      ],
      cta: 'Upgrade para Pro',
      recommended: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: 199,
      features: [
        '✓ Tudo do Pro',
        '✓ Múltiplos usuários (até 5)',
        '✓ Gestor de conta dedicado',
        '✓ Integrações CRM',
        '✓ Relatórios avançados',
        '✓ API customizada',
      ],
      cta: 'Falar com time',
      forTeams: true,
    },
  ];

  const benefits = [
    { icon: '📊', title: 'Mais Visibilidade', desc: 'Apareça no topo dos resultados e receba mais oportunidades' },
    { icon: '⚡', title: 'Ferramentas Profissionais', desc: 'Certo AI, relatórios e análise de performance' },
    { icon: '🎯', title: 'Conversão Maior', desc: 'Usuários Pro recebem 3x mais propostas' },
    { icon: '🤝', title: 'Suporte Premium', desc: 'Resposta garantida em 2 horas' },
  ];

  return (
    <>
      <style>{`
        .upgrade-page {
          min-height: 100vh;
          background: #f5f3ee;
        }
        .upgrade-hero {
          background: linear-gradient(135deg, #17134c 0%, #2a245b 100%);
          color: white;
          padding: 60px 40px;
          text-align: center;
        }
        .upgrade-hero h1 {
          margin: 0;
          font-size: clamp(32px, 6vw, 56px);
          line-height: 1.1;
          letter-spacing: -.04em;
        }
        .upgrade-hero p {
          margin: 16px 0 0;
          font-size: 16px;
          color: #aaa5bf;
        }
        .upgrade-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
        }
        .plans-compare {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }
        .plan-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
          position: relative;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .plan-card:hover:not(.disabled-card) {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(29, 23, 79, 0.12);
        }
        .plan-card.recommended {
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
        .plan-name {
          font-size: 20px;
          font-weight: 700;
          color: #1d174f;
          margin: 0 0 8px;
        }
        .plan-price {
          font-size: 36px;
          font-weight: 700;
          color: #ef4b31;
          margin: 0 0 4px;
        }
        .plan-price small {
          font-size: 14px;
          color: #a8a3b5;
          font-weight: 400;
        }
        .plan-savings {
          font-size: 11px;
          color: #1f9b62;
          font-weight: 700;
          margin: 8px 0 16px;
        }
        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          flex: 1;
        }
        .plan-features li {
          padding: 10px 0;
          border-bottom: 1px solid #ece9e4;
          font-size: 13px;
          color: #5d5969;
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
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
        }
        .plan-cta:hover {
          background: #d4381f;
        }
        .plan-card.disabled-card .plan-cta {
          background: #ece9e4;
          cursor: not-allowed;
          color: #a8a3b5;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .benefit-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .benefit-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }
        .benefit-card h3 {
          margin: 0 0 6px;
          font-size: 15px;
          font-weight: 700;
          color: #1d174f;
        }
        .benefit-card p {
          margin: 0;
          font-size: 13px;
          color: #5d5969;
          line-height: 1.5;
        }
        .faq-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .faq-title {
          text-align: center;
          margin-bottom: 30px;
        }
        .faq-title h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1d174f;
        }
        .faq-item {
          margin-bottom: 16px;
        }
        .faq-item h4 {
          margin: 0 0 6px;
          font-size: 14px;
          font-weight: 700;
          color: #1d174f;
        }
        .faq-item p {
          margin: 0;
          font-size: 13px;
          color: #5d5969;
          line-height: 1.5;
        }
      `}</style>

      <div className="upgrade-page">
        <div className="upgrade-hero">
          <h1>Desbloqueie Seu Potencial 🚀</h1>
          <p>Usuários Pro recebem 3x mais propostas. Quando você vai fazer o upgrade?</p>
        </div>

        <div className="upgrade-content">
          <div className="plans-compare">
            {plans.map(plan => (
              <div 
                key={plan.id}
                className={`plan-card ${plan.recommended ? 'recommended' : ''} ${plan.disabled ? 'disabled-card' : ''}`}
              >
                {plan.recommended && <div className="plan-badge">⭐ Recomendado</div>}
                
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  R$ {plan.price}
                  <small>/mês</small>
                </div>
                {plan.savings && <div className="plan-savings">💰 {plan.savings}</div>}

                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>

                <button className="plan-cta" disabled={plan.disabled}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="benefits-grid">
            {benefits.map((benefit, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>

          <div className="faq-section">
            <div className="faq-title">
              <h2>Perguntas Frequentes</h2>
            </div>

            <div className="faq-item">
              <h4>Posso cancelar a qualquer momento?</h4>
              <p>Sim! Sem compromisso. Você pode cancelar seu plano Pro sem multas ou questões a qualquer hora.</p>
            </div>

            <div className="faq-item">
              <h4>Quanto vou ganhar a mais com Pro?</h4>
              <p>Usuários Pro recebem destaque nos resultados e aparecem para clientes que buscam qualidade. Em média, recebem 3x mais propostas.</p>
            </div>

            <div className="faq-item">
              <h4>E se não gostar?</h4>
              <p>Oferecemos garantia de 7 dias. Se você não vir resultados, devolvemos o dinheiro.</p>
            </div>

            <div className="faq-item">
              <h4>Quantos créditos eu ganho?</h4>
              <p>Plano Pro inclui 100 créditos/mês. Cada proposta enviada custa 5-10 créditos dependendo da categoria.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
