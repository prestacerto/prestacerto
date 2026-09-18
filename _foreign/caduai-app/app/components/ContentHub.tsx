'use client';
export default function ContentHub() {
  const articles = [
    { title: 'Guia: Como Contratar um Designer', views: '12.3k', category: '📚' },
    { title: '5 Dicas para Briefing Perfeito', views: '8.9k', category: '💡' },
    { title: 'Quanto Custa um Projeto Web?', views: '15.2k', category: '💰' },
  ];

  return (
    <>
      <style>{`
        .content-container { max-width: 900px; margin: 40px auto; padding: 0 40px; }
        .content-title { font-size: 24px; font-weight: 700; color: #1d174f; margin: 0 0 8px; }
        .content-subtitle { font-size: 12px; color: #5d5969; margin: 0 0 20px; }
        .content-grid { display: grid; gap: 12px; }
        .article-card { background: white; border-radius: 12px; padding: 16px; display: grid; grid-template-columns: 30px 1fr auto; gap: 12px; align-items: center; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); cursor: pointer; transition: all 0.2s; }
        .article-card:hover { box-shadow: 0 8px 20px rgba(29, 23, 79, 0.12); }
        .article-icon { font-size: 20px; }
        .article-title { font-size: 13px; font-weight: 700; color: #1d174f; margin: 0; }
        .article-views { font-size: 11px; color: #a8a3b5; }
      `}</style>

      <div className="content-container">
        <h2 className="content-title">📖 Centro de Conteúdo</h2>
        <p className="content-subtitle">Guias e artigos para contratar melhor e ganhar mais</p>
        
        <div className="content-grid">
          {articles.map((a, i) => (
            <div key={i} className="article-card">
              <span>{a.category}</span>
              <div>
                <p className="article-title">{a.title}</p>
                <p className="article-views">{a.views} visualizações</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
