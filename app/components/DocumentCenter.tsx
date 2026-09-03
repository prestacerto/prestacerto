'use client';
export default function DocumentCenter() {
  const docs = [
    { name: 'Briefing Projeto X', date: '2 dias atrás', type: '📄' },
    { name: 'Proposta Aceita', date: '1 semana atrás', type: '✅' },
    { name: 'Contrato Assinado', date: '2 semanas atrás', type: '🔐' },
    { name: 'Comprovante Pagamento', date: '3 dias atrás', type: '💳' },
  ];

  return (
    <>
      <style>{`
        .docs-container { max-width: 900px; margin: 40px auto; padding: 0 40px; }
        .docs-title { font-size: 24px; font-weight: 700; color: #1d174f; margin: 0 0 20px; }
        .docs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .doc-card { padding: 16px; background: #f9f7f3; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .doc-card:hover { background: #ffe1da; }
        .doc-icon { font-size: 28px; margin-bottom: 8px; }
        .doc-name { font-size: 12px; font-weight: 700; color: #1d174f; margin: 0 0 4px; }
        .doc-date { font-size: 10px; color: #a8a3b5; margin: 0; }
      `}</style>

      <div className="docs-container">
        <h2 className="docs-title">📁 Central de Documentos</h2>
        
        <div className="docs-grid">
          {docs.map((d, i) => (
            <div key={i} className="doc-card">
              <div className="doc-icon">{d.type}</div>
              <p className="doc-name">{d.name}</p>
              <p className="doc-date">{d.date}</p>
            </div>
          ))}
          <div className="doc-card" style={{display: 'grid', placeItems: 'center'}}>
            <div className="doc-icon">➕</div>
            <p className="doc-name">Upload</p>
          </div>
        </div>
      </div>
    </>
  );
}
