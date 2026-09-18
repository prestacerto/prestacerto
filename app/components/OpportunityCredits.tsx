'use client';
import { useState } from 'react';

export default function OpportunityCredits() {
  const [credits, setCredits] = useState(250);

  return (
    <>
      <style>{`
        .credits-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .credits-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .credits-title { font-size: 14px; font-weight: 700; color: #1d174f; margin: 0; }
        .credits-amount { font-size: 24px; font-weight: 700; color: #ef4b31; }
        .credits-bar { height: 8px; background: #ece9e4; border-radius: 4px; overflow: hidden; margin-bottom: 12px; }
        .credits-fill { height: 100%; background: linear-gradient(90deg, #ef4b31, #1f9b62); width: ${credits / 500 * 100}%; transition: width 0.3s; }
        .credits-info { font-size: 11px; color: #a8a3b5; }
        .credits-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
        .credits-btn { padding: 8px; border-radius: 6px; border: 0; font-size: 11px; font-weight: 700; cursor: pointer; }
        .credits-btn.primary { background: #ef4b31; color: white; }
        .credits-btn.secondary { background: #f5f3f0; color: #5d5969; }
      `}</style>
      <div className="credits-card">
        <div className="credits-header">
          <p className="credits-title">💳 Créditos de Oportunidade</p>
          <div className="credits-amount">{credits}</div>
        </div>
        <div className="credits-bar"><div className="credits-fill" /></div>
        <div className="credits-info">Use para enviar propostas qualificadas. 5-10 créditos por proposta.</div>
        <div className="credits-actions">
          <button className="credits-btn secondary">Histórico</button>
          <button className="credits-btn primary">+ Comprar Créditos</button>
        </div>
      </div>
    </>
  );
}
