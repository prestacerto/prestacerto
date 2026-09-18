'use client';
export default function B2BMatch() {
  return (
    <>
      <style>{`
        .b2b-card { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
        .b2b-title { font-size: 16px; font-weight: 700; margin: 0 0 12px; }
        .b2b-desc { font-size: 12px; color: rgba(255,255,255,0.8); margin: 0 0 16px; line-height: 1.5; }
        .b2b-benefits { list-style: none; padding: 0; margin: 0 0 16px; }
        .b2b-benefits li { font-size: 11px; margin-bottom: 6px; padding-left: 18px; position: relative; }
        .b2b-benefits li:before { content: '✓'; position: absolute; left: 0; }
        .b2b-btn { width: 100%; padding: 12px; background: white; color: #6366f1; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; }
      `}</style>
      <div className="b2b-card">
        <p className="b2b-title">🤝 Match Patrocinado B2B</p>
        <p className="b2b-desc">Para empresas: curadoria de shortlist + SLA + atendimento.</p>
        <ul className="b2b-benefits">
          <li>Curadoria Manual de Prestadores</li>
          <li>SLA Garantido</li>
          <li>Atendimento Especializado</li>
          <li>Integração CRM</li>
          <li>Relatórios Customizados</li>
        </ul>
        <button className="b2b-btn">Solicitar Demo</button>
      </div>
    </>
  );
}
