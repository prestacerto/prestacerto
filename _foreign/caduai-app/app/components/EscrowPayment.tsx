'use client';
import { useState } from 'react';

export default function EscrowPayment() {
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [amount] = useState(5000);

  const steps = [
    { stage: 'pending', title: 'Pagamento Iniciado', icon: '💳', desc: 'Cliente autorizou o pagamento' },
    { stage: 'in_progress', title: 'Em Escrow', icon: '🔒', desc: 'Valor protegido até conclusão' },
    { stage: 'completed', title: 'Liberado', icon: '✅', desc: 'Prestador recebeu o valor' },
  ];

  return (
    <>
      <style>{`
        .escrow-container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .escrow-title {
          text-align: center;
          margin-bottom: 30px;
        }
        .escrow-title h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1d174f;
        }
        .escrow-title p {
          margin: 8px 0 0;
          color: #5d5969;
          font-size: 13px;
        }
        .escrow-timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }
        .timeline-step {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          align-items: center;
          text-align: center;
          padding: 16px;
          background: #f9f7f3;
          border-radius: 10px;
          border: 2px solid #ece9e4;
          transition: all 0.2s;
        }
        .timeline-step.active {
          background: #ffe1da;
          border-color: #ef4b31;
        }
        .timeline-step.completed {
          background: #d5f7c7;
          border-color: #1f9b62;
        }
        .timeline-icon {
          font-size: 28px;
        }
        .timeline-title {
          font-size: 12px;
          font-weight: 700;
          color: #1d174f;
          margin: 0;
        }
        .timeline-desc {
          font-size: 10px;
          color: #a8a3b5;
          margin: 0;
        }
        .escrow-details {
          background: #f9f7f3;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .detail-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .detail-row:last-child {
          margin: 0;
          padding-top: 12px;
          border-top: 1px solid #ece9e4;
          font-weight: 700;
          color: #1d174f;
        }
        .escrow-info {
          background: #e8f5f0;
          border-left: 4px solid #1f9b62;
          padding: 12px 16px;
          border-radius: 6px;
          font-size: 12px;
          color: #1f9b62;
          line-height: 1.5;
        }
        .escrow-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 20px;
        }
        .escrow-btn {
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          border: 0;
          cursor: pointer;
          transition: all 0.2s;
        }
        .escrow-btn.primary {
          background: #ef4b31;
          color: white;
        }
        .escrow-btn.primary:hover {
          background: #d4381f;
        }
        .escrow-btn.secondary {
          background: #f5f3f0;
          color: #5d5969;
        }
        .escrow-btn.secondary:hover {
          background: #ece9e4;
        }
      `}</style>

      <div className="escrow-container">
        <div className="escrow-title">
          <h2>🔒 Pagamento Protegido</h2>
          <p>Seu dinheiro é seguro até o projeto ser concluído</p>
        </div>

        <div className="escrow-timeline">
          {steps.map((step, i) => (
            <div 
              key={step.stage}
              className={`timeline-step ${status === step.stage ? 'active' : status === steps[steps.length - 1].stage && i < steps.indexOf(steps.find(s => s.stage === status)!) ? 'completed' : ''}`}
            >
              <div className="timeline-icon">{step.icon}</div>
              <p className="timeline-title">{step.title}</p>
              <p className="timeline-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="escrow-details">
          <div className="detail-row">
            <span>Valor do Projeto</span>
            <strong>R$ {amount.toLocaleString('pt-BR')}</strong>
          </div>
          <div className="detail-row">
            <span>Taxa da Plataforma (5%)</span>
            <strong>R$ {Math.round(amount * 0.05).toLocaleString('pt-BR')}</strong>
          </div>
          <div className="detail-row">
            <span>Proteção contra Fraude</span>
            <strong style={{color: '#1f9b62'}}>✓ Incluída</strong>
          </div>
          <div className="detail-row">
            <span>Valor a Receber</span>
            <strong style={{fontSize: 16, color: '#ef4b31'}}>R$ {Math.round(amount * 0.95).toLocaleString('pt-BR')}</strong>
          </div>
        </div>

        <div className="escrow-info">
          <strong>🛡️ Como funciona:</strong><br/>
          1️⃣ Cliente paga na plataforma (não vai direto para prestador)<br/>
          2️⃣ Dinheiro fica protegido enquanto trabalho é feito<br/>
          3️⃣ Depois de aprovado, você recebe na conta<br/>
          4️⃣ Se houver disputa, plataforma media de forma justa
        </div>

        <div className="escrow-actions">
          <button className="escrow-btn secondary">← Voltar</button>
          <button className="escrow-btn primary" onClick={() => {
            setStatus(status === 'pending' ? 'in_progress' : 'completed');
          }}>
            {status === 'completed' ? '✅ Concluído' : 'Próxima Etapa →'}
          </button>
        </div>
      </div>
    </>
  );
}
