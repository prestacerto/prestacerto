'use client';
import { useState } from 'react';

export default function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState('metricas');
  const [subscription, setSubscription] = useState('pro');
  const [notifications, setNotifications] = useState(3);

  return (
    <>
      <style>{`
        .dashboard-wrapper {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .dashboard-tabs {
          display: flex;
          border-bottom: 1px solid #ece9e4;
          background: #f9f7f3;
        }
        .dashboard-tab {
          flex: 1;
          padding: 16px;
          background: transparent;
          border: 0;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #a8a3b5;
          position: relative;
          transition: color 0.2s;
        }
        .dashboard-tab.active {
          color: #ef4b31;
        }
        .dashboard-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: #ef4b31;
        }
        .dashboard-content {
          padding: 24px;
        }
        .metric-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .metric-mini {
          background: #f9f7f3;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }
        .metric-mini strong {
          display: block;
          font-size: 24px;
          color: #ef4b31;
          margin: 8px 0;
        }
        .metric-mini small {
          color: #a8a3b5;
          font-size: 11px;
        }
        .subscription-card {
          background: linear-gradient(135deg, #17134c 0%, #2a245b 100%);
          color: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .subscription-card h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }
        .subscription-card p {
          margin: 0;
          font-size: 13px;
          color: #aaa5bf;
        }
        .plan-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 16px;
        }
        .plan-option {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .plan-option:hover {
          border-color: #ef4b31;
          background: rgba(239, 75, 49, 0.1);
        }
        .plan-option.active {
          background: #ef4b31;
          border-color: #ef4b31;
        }
        .plan-option small {
          display: block;
          font-size: 11px;
          margin-top: 4px;
          opacity: 0.8;
        }
        .portfolio-manager {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .portfolio-edit-section {
          background: #f9f7f3;
          padding: 16px;
          border-radius: 8px;
        }
        .portfolio-edit-section h4 {
          margin: 0 0 12px;
          font-size: 13px;
          font-weight: 700;
          color: #1d174f;
        }
        .edit-field {
          margin-bottom: 12px;
        }
        .edit-field label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #5d5969;
          margin-bottom: 4px;
        }
        .edit-field input, .edit-field textarea {
          width: 100%;
          border: 1px solid #d7d2ca;
          border-radius: 6px;
          padding: 8px;
          font-size: 12px;
          font-family: inherit;
        }
        .edit-field textarea {
          resize: vertical;
          min-height: 80px;
        }
        .save-btn {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
        }
        .save-btn:hover {
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .metric-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .plan-options {
            grid-template-columns: 1fr;
          }
          .portfolio-manager {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${activeTab === 'metricas' ? 'active' : ''}`}
            onClick={() => setActiveTab('metricas')}
          >
            📊 Métricas
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'assinatura' ? 'active' : ''}`}
            onClick={() => setActiveTab('assinatura')}
          >
            💳 Assinatura
          </button>
          <button 
            className={`dashboard-tab ${activeTab === 'portifolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portifolio')}
          >
            📸 Portfólio
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'metricas' && (
            <>
              <div className="metric-row">
                <div className="metric-mini">
                  <small>👁️ Visualizações</small>
                  <strong>1.248</strong>
                  <small>este mês</small>
                </div>
                <div className="metric-mini">
                  <small>💬 Contatos</small>
                  <strong>342</strong>
                  <small>este mês</small>
                </div>
                <div className="metric-mini">
                  <small>✅ Conversões</small>
                  <strong>87</strong>
                  <small>este mês</small>
                </div>
                <div className="metric-mini">
                  <small>⭐ Avaliação</small>
                  <strong>4.9</strong>
                  <small>média</small>
                </div>
              </div>
            </>
          )}

          {activeTab === 'assinatura' && (
            <>
              <div className="subscription-card">
                <h3>📋 Plano Atual: {subscription.toUpperCase()}</h3>
                <p>Você tem acesso a todos os recursos. Próxima cobrança em 15 dias.</p>
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong style={{ fontSize: 13, display: 'block', marginBottom: 12, color: '#1d174f' }}>
                  Escolha seu plano:
                </strong>
              </div>
              <div className="plan-options">
                <div 
                  className={`plan-option ${subscription === 'basico' ? 'active' : ''}`}
                  onClick={() => setSubscription('basico')}
                >
                  <strong>Básico</strong>
                  <small>R$ 49/mês</small>
                </div>
                <div 
                  className={`plan-option ${subscription === 'pro' ? 'active' : ''}`}
                  onClick={() => setSubscription('pro')}
                >
                  <strong>Pro</strong>
                  <small>R$ 99/mês</small>
                </div>
                <div 
                  className={`plan-option ${subscription === 'premium' ? 'active' : ''}`}
                  onClick={() => setSubscription('premium')}
                >
                  <strong>Premium</strong>
                  <small>R$ 199/mês</small>
                </div>
              </div>
            </>
          )}

          {activeTab === 'portifolio' && (
            <div className="portfolio-manager">
              <div className="portfolio-edit-section">
                <h4>ℹ️ Informações Gerais</h4>
                <div className="edit-field">
                  <label>Título Profissional</label>
                  <input type="text" placeholder="Ex: Arquiteto Especialista..." />
                </div>
                <div className="edit-field">
                  <label>Sobre Você</label>
                  <textarea placeholder="Descreva sua experiência e especialidades..." />
                </div>
                <button className="save-btn">Salvar Alterações</button>
              </div>
              <div className="portfolio-edit-section">
                <h4>🎯 Especialidades</h4>
                <div className="edit-field">
                  <label>Categorias</label>
                  <input type="text" placeholder="Arquitetura, Design, Reforma..." />
                </div>
                <div className="edit-field">
                  <label>Serviços Oferecidos</label>
                  <textarea placeholder="Descreva os serviços que você oferece..." />
                </div>
                <button className="save-btn">Salvar Alterações</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
