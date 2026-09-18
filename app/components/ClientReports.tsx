'use client';
export default function ClientReports() {
  return (
    <>
      <style>{`
        .reports-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .reports-title { font-size: 16px; font-weight: 700; color: #1d174f; margin: 0 0 12px; }
        .reports-desc { font-size: 12px; color: #5d5969; margin: 0 0 16px; }
        .reports-features { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
        .report-feature { padding: 12px; background: #f9f7f3; border-radius: 8px; text-align: center; }
        .report-feature strong { display: block; font-size: 12px; color: #1d174f; }
        .report-feature small { display: block; font-size: 10px; color: #a8a3b5; margin-top: 4px; }
        .reports-btn { width: 100%; padding: 12px; background: #ef4b31; color: white; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; }
      `}</style>
      <div className="reports-card">
        <p className="reports-title">📊 Relatórios para Clientes</p>
        <p className="reports-desc">Assinatura para acompanhar performance, ROI e qualidade.</p>
        <div className="reports-features">
          <div className="report-feature"><strong>Propostas</strong><small>Comparar</small></div>
          <div className="report-feature"><strong>Prazos</strong><small>Acompanhar</small></div>
          <div className="report-feature"><strong>Custo/Qualidade</strong><small>Medir</small></div>
          <div className="report-feature"><strong>Recorrência</strong><small>Analisar</small></div>
        </div>
        <button className="reports-btn">Ativar Relatórios - R$ 49/mês</button>
      </div>
    </>
  );
}
