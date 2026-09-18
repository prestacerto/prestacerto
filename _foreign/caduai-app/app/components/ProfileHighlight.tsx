'use client';
import { useState } from 'react';

export default function ProfileHighlight() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  return (
    <>
      <style>{`
        .highlight-card {
          background: linear-gradient(135deg, #fef3c7 0%, #ffe1da 100%);
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
        }
        .highlight-title { font-size: 16px; font-weight: 700; color: #1d174f; margin: 0 0 12px; }
        .highlight-desc { font-size: 12px; color: #5d5969; margin: 0 0 16px; line-height: 1.5; }
        .highlight-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .highlight-btn { padding: 12px; border-radius: 8px; border: 0; cursor: pointer; font-weight: 700; font-size: 12px; transition: all 0.2s; }
        .highlight-btn.active { background: #f59e0b; color: white; }
        .highlight-btn.inactive { background: white; color: #5d5969; border: 1px solid #ece9e4; }
        .highlight-btn:hover { transform: translateY(-1px); }
        .highlight-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; background: white; border-radius: 8px; }
        .stat { text-align: center; }
        .stat strong { display: block; font-size: 18px; color: #f59e0b; }
        .stat small { display: block; font-size: 10px; color: #a8a3b5; }
      `}</style>
      <div className="highlight-card">
        <p className="highlight-title">⭐ Destaque seu Perfil</p>
        <p className="highlight-desc">Apareça no topo dos resultados por 7, 30 ou 90 dias. Sem alterar avaliações - apenas posição.</p>
        <div className="highlight-options">
          <button className={`highlight-btn ${isHighlighted && daysLeft > 0 ? 'active' : 'inactive'}`} onClick={() => { setIsHighlighted(true); setDaysLeft(7); }}>7 dias - R$ 49</button>
          <button className={`highlight-btn ${isHighlighted && daysLeft > 7 ? 'active' : 'inactive'}`} onClick={() => { setIsHighlighted(true); setDaysLeft(30); }}>30 dias - R$ 149</button>
        </div>
        {isHighlighted && <div className="highlight-stats">
          <div className="stat"><strong>{daysLeft}d</strong><small>Dias Restantes</small></div>
          <div className="stat"><strong>+150%</strong><small>Mais Visibilidade</small></div>
        </div>}
      </div>
    </>
  );
}
