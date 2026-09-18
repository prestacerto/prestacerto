'use client';
import { useState } from 'react';

export default function EscrowRules() {
  const [rules, setRules] = useState({
    autoRelease: 7,
    disputeWindow: 3,
    refundWindow: 30,
    chargebackProtection: true,
    minProjectValue: 100,
    maxProjectValue: 50000,
  });

  const fraudChecks = [
    { id: 1, check: 'Verificação de Identidade', status: '✅ Obrigatória', risk: 'Alto' },
    { id: 2, check: 'Histórico de Transações', status: '✅ Automático', risk: 'Médio' },
    { id: 3, check: 'IP Geolocation Match', status: '✅ Automático', risk: 'Médio' },
    { id: 4, check: 'Chargeback History', status: '✅ Automático', risk: 'Alto' },
    { id: 5, check: 'Payment Method Verification', status: '✅ Automático', risk: 'Médio' },
    { id: 6, check: 'Account Age Check', status: '✅ Automático', risk: 'Baixo' },
  ];

  const releaseScenarios = [
    { trigger: 'Cliente aprova projeto', daysToRelease: 0, condition: 'Imediato' },
    { trigger: 'Auto-release após deadline', daysToRelease: 7, condition: 'Se sem disputa' },
    { trigger: 'Disputa resolvida', daysToRelease: 1, condition: 'Após arbitragem' },
    { trigger: 'Refund solicitado', daysToRelease: 3, condition: 'Retorna ao cliente' },
  ];

  return (
    <>
      <style>{`
        .escrow-rules {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 40px;
        }
        .rules-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .rules-header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #1d174f;
        }
        .rules-header p {
          margin: 8px 0 0;
          color: #5d5969;
          font-size: 14px;
        }
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .rule-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
          border-left: 4px solid #ef4b31;
        }
        .rule-label {
          font-size: 12px;
          color: #a8a3b5;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .rule-value {
          font-size: 28px;
          font-weight: 700;
          color: #1d174f;
        }
        .rule-desc {
          font-size: 12px;
          color: #5d5969;
          margin-top: 8px;
        }
        .section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1d174f;
          margin: 0 0 20px;
        }
        .checks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .check-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          padding: 16px;
          background: #f9f7f3;
          border-radius: 10px;
          align-items: center;
        }
        .check-info {
          display: grid;
          gap: 4px;
        }
        .check-name {
          font-size: 13px;
          font-weight: 700;
          color: #1d174f;
          margin: 0;
        }
        .check-status {
          font-size: 11px;
          color: #1f9b62;
        }
        .check-risk {
          display: flex;
          gap: 4px;
          align-items: center;
          font-size: 10px;
          font-weight: 700;
        }
        .risk-alto {
          color: #ff6b6b;
          background: #ffe1da;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .risk-medio {
          color: #f59e0b;
          background: #fef3c7;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .risk-baixo {
          color: #1f9b62;
          background: #d5f7c7;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .scenarios-table {
          width: 100%;
          border-collapse: collapse;
        }
        .scenarios-table th {
          text-align: left;
          padding: 12px;
          border-bottom: 2px solid #ece9e4;
          background: #f9f7f3;
          font-size: 12px;
          font-weight: 700;
          color: #5d5969;
        }
        .scenarios-table td {
          padding: 12px;
          border-bottom: 1px solid #ece9e4;
          font-size: 12px;
          color: #5d5969;
        }
        .scenarios-table tr:hover {
          background: #f9f7f3;
        }
        .scenario-days {
          background: #ffe1da;
          color: #c4572f;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }
      `}</style>

      <div className="escrow-rules">
        <div className="rules-header">
          <h1>🔒 Regras de Escrow</h1>
          <p>Proteção total contra fraude e chargebacks</p>
        </div>

        <div className="rules-grid">
          <div className="rule-card">
            <div className="rule-label">Auto-Release</div>
            <div className="rule-value">{rules.autoRelease}d</div>
            <div className="rule-desc">Libera automaticamente se sem disputa</div>
          </div>
          <div className="rule-card">
            <div className="rule-label">Janela de Disputa</div>
            <div className="rule-value">{rules.disputeWindow}d</div>
            <div className="rule-desc">Cliente pode abrir disputa até este prazo</div>
          </div>
          <div className="rule-card">
            <div className="rule-label">Proteção Chargeback</div>
            <div className="rule-value">✅ Sim</div>
            <div className="rule-desc">Plataforma absorve risco de chargeback</div>
          </div>
          <div className="rule-card">
            <div className="rule-label">Valor Máximo</div>
            <div className="rule-value">R$ 50k</div>
            <div className="rule-desc">Projetos acima precisam de aprovação</div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">🛡️ Verificações de Fraude (Automáticas)</h2>
          <div className="checks-grid">
            {fraudChecks.map(check => (
              <div key={check.id} className="check-item">
                <div className="check-info">
                  <p className="check-name">{check.check}</p>
                  <span className="check-status">{check.status}</span>
                </div>
                <div className={`risk-${check.risk.toLowerCase()}`}>
                  {check.risk}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">⏱️ Cenários de Liberação</h2>
          <table className="scenarios-table">
            <thead>
              <tr>
                <th>Trigger</th>
                <th>Dias até Liberar</th>
                <th>Condição</th>
              </tr>
            </thead>
            <tbody>
              {releaseScenarios.map((scenario, i) => (
                <tr key={i}>
                  <td>{scenario.trigger}</td>
                  <td><span className="scenario-days">{scenario.daysToRelease}d</span></td>
                  <td>{scenario.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2 className="section-title">📋 Política de Reembolso</h2>
          <div style={{display: 'grid', gap: 12}}>
            <div style={{padding: 12, background: '#f9f7f3', borderRadius: 8}}>
              <p style={{margin: 0, fontWeight: 700, fontSize: 13, color: '#1d174f'}}>
                ✓ Reembolso Total
              </p>
              <p style={{margin: '4px 0 0', fontSize: 12, color: '#5d5969'}}>
                Se cliente solicitar antes da conclusão (dentro de 30 dias)
              </p>
            </div>
            <div style={{padding: 12, background: '#f9f7f3', borderRadius: 8}}>
              <p style={{margin: 0, fontWeight: 700, fontSize: 13, color: '#1d174f'}}>
                ✓ Mediação de Disputa
              </p>
              <p style={{margin: '4px 0 0', fontSize: 12, color: '#5d5969'}}>
                Se houver desacordo, plataforma arbitrai e decide divisão justa
              </p>
            </div>
            <div style={{padding: 12, background: '#f9f7f3', borderRadius: 8}}>
              <p style={{margin: 0, fontWeight: 700, fontSize: 13, color: '#1d174f'}}>
                ✓ Proteção contra Chargeback
              </p>
              <p style={{margin: '4px 0 0', fontSize: 12, color: '#5d5969'}}>
                Se cliente faz chargeback, prestador fica protegido e plataforma absorve
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
