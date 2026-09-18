'use client';
export default function ProjectHistory() {
  const projects = [
    { id: 1, name: 'Website Redesign', status: 'Concluído', date: '2 meses atrás', value: 'R$ 8.000', rating: '⭐⭐⭐⭐⭐' },
    { id: 2, name: 'App Mobile', status: 'Em andamento', date: 'Iniciado há 1 mês', value: 'R$ 15.000', rating: '-' },
    { id: 3, name: 'Consultoria UX', status: 'Concluído', date: '4 meses atrás', value: 'R$ 5.000', rating: '⭐⭐⭐⭐⭐' },
  ];

  return (
    <>
      <style>{`
        .history-container { max-width: 900px; margin: 40px auto; padding: 0 40px; }
        .history-title { font-size: 24px; font-weight: 700; color: #1d174f; margin: 0 0 20px; }
        .history-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .history-tab { padding: 10px; text-align: center; background: #f5f3f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; }
        .history-tab.active { background: #ef4b31; color: white; }
        .history-grid { display: grid; gap: 12px; }
        .history-item { background: white; border-radius: 12px; padding: 16px; display: grid; grid-template-columns: 1fr auto; gap: 16px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .history-info { display: grid; gap: 4px; }
        .history-name { font-weight: 700; color: #1d174f; margin: 0; }
        .history-meta { font-size: 11px; color: #a8a3b5; }
        .history-status { display: flex; gap: 8px; align-items: center; font-size: 11px; }
        .status-badge { background: #d5f7c7; color: #1f9b62; padding: 4px 8px; border-radius: 4px; font-weight: 700; }
      `}</style>

      <div className="history-container">
        <h2 className="history-title">📋 Histórico de Projetos</h2>
        
        <div className="history-tabs">
          <div className="history-tab active">Concluídos</div>
          <div className="history-tab">Em andamento</div>
          <div className="history-tab">Favoritos</div>
        </div>

        <div className="history-grid">
          {projects.map(p => (
            <div key={p.id} className="history-item">
              <div className="history-info">
                <p className="history-name">{p.name}</p>
                <p className="history-meta">{p.date} • {p.value}</p>
              </div>
              <div className="history-status">
                <span className="status-badge">{p.status}</span>
                <span>{p.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
