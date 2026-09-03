'use client';
import { useState } from 'react';

export default function ComoFunciona() {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');

  return (
    <>
      <style>{`
        .how-it-works {
          min-height: 100vh;
          background: #f5f3ee;
        }
        .how-hero {
          background: linear-gradient(135deg, #17134c 0%, #2a245b 100%);
          color: white;
          padding: 80px 40px;
          text-align: center;
        }
        .how-hero h1 {
          margin: 0;
          font-size: clamp(42px, 8vw, 72px);
          line-height: 1;
          letter-spacing: -.05em;
        }
        .how-hero p {
          margin: 20px 0 0;
          font-size: 18px;
          color: #aaa5bf;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .flow-tabs {
          display: flex;
          justify-content: center;
          gap: 0;
          background: white;
          padding: 0;
          margin-top: 40px;
        }
        .flow-tab {
          flex: 1;
          max-width: 300px;
          padding: 20px;
          background: transparent;
          border: 2px solid #ece9e4;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.3s;
        }
        .flow-tab.active {
          background: #ef4b31;
          color: white;
          border-color: #ef4b31;
        }
        .flow-tab:hover:not(.active) {
          border-color: #ef4b31;
        }
        .flow-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 40px;
        }
        .flow-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }
        .flow-step {
          background: white;
          border-radius: 16px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .flow-step::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ef4b31, #1f9b62);
        }
        .flow-step:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(29, 23, 79, 0.12);
        }
        .flow-number {
          width: 50px;
          height: 50px;
          background: #ef4b31;
          color: white;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 28px;
          font-weight: 700;
          margin: 0 auto 16px;
        }
        .flow-step h3 {
          margin: 0 0 12px;
          font-size: 18px;
          font-weight: 700;
          color: #1d174f;
        }
        .flow-step p {
          margin: 0;
          color: #5d5969;
          font-size: 14px;
          line-height: 1.6;
        }
        .flow-benefits {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .flow-benefits h2 {
          margin: 0 0 30px;
          font-size: 32px;
          font-weight: 700;
          color: #1d174f;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }
        .benefit-item {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 16px;
        }
        .benefit-icon {
          width: 48px;
          height: 48px;
          background: #ffe1da;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-size: 24px;
        }
        .benefit-item h4 {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 700;
          color: #1d174f;
        }
        .benefit-item p {
          margin: 0;
          font-size: 13px;
          color: #5d5969;
          line-height: 1.5;
        }
      `}</style>

      <div className="how-it-works">
        <div className="how-hero">
          <h1>Como Funciona</h1>
          <p>Descubra como conectamos quem precisa com quem oferece qualidade</p>
        </div>

        <div className="flow-tabs">
          <button 
            className={`flow-tab ${activeTab === 'client' ? 'active' : ''}`}
            onClick={() => setActiveTab('client')}
          >
            👤 Para Clientes
          </button>
          <button 
            className={`flow-tab ${activeTab === 'provider' ? 'active' : ''}`}
            onClick={() => setActiveTab('provider')}
          >
            ⭐ Para Prestadores
          </button>
        </div>

        <div className="flow-content">
          <div className="flow-steps">
            {activeTab === 'client' ? (
              <>
                <div className="flow-step">
                  <div className="flow-number">1</div>
                  <h3>Descreva seu projeto</h3>
                  <p>Conte tudo que você precisa. Nosso sistema entende cada detalhe.</p>
                </div>
                <div className="flow-step">
                  <div className="flow-number">2</div>
                  <h3>Receba propostas</h3>
                  <p>Prestadores qualificados enviam propostas customizadas para você.</p>
                </div>
                <div className="flow-step">
                  <div className="flow-number">3</div>
                  <h3>Compare e escolha</h3>
                  <p>Veja lado a lado, leia avaliações, negocie na plataforma.</p>
                </div>
                <div className="flow-step">
                  <div className="flow-number">4</div>
                  <h3>Acompanhe tudo</h3>
                  <p>Chat integrado, atualizações em tempo real, pagamento seguro.</p>
                </div>
              </>
            ) : (
              <>
                <div className="flow-step">
                  <div className="flow-number">1</div>
                  <h3>Complete seu perfil</h3>
                  <p>Bio, serviços, portfólio e disponibilidade prontos para trabalhar.</p>
                </div>
                <div className="flow-step">
                  <div className="flow-number">2</div>
                  <h3>Receba oportunidades</h3>
                  <p>Projetos chegam direto para você conforme sua especialidade.</p>
                </div>
                <div className="flow-step">
                  <div className="flow-number">3</div>
                  <h3>Envie propostas</h3>
                  <p>Customize sua proposta, preço e timeline para cada projeto.</p>
                </div>
                <div className="flow-step">
                  <div className="flow-number">4</div>
                  <h3>Ganhe reputação</h3>
                  <p>Avaliações reais constroem seu histórico e atraem mais clientes.</p>
                </div>
              </>
            )}
          </div>

          <div className="flow-benefits">
            <h2>✨ Por que isso funciona</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">🔒</div>
                <div>
                  <h4>Segurança garantida</h4>
                  <p>Plataforma verifica identidades e histórico de todos</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <div>
                  <h4>Rápido e eficiente</h4>
                  <p>IA ajuda a conectar pessoas certas em minutos</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">💬</div>
                <div>
                  <h4>Sem intermediários</h4>
                  <p>Negocie direto, sem comissões escondidas</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✅</div>
                <div>
                  <h4>Transparência total</h4>
                  <p>Avaliações reais, preços claros, sem surpresas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
