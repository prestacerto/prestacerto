'use client';
export default function Partnerships() {
  const partners = [
    { name: 'Contabilidade XYZ', category: 'Contabilidade', icon: '📊' },
    { name: 'Emissão Fiscal', category: 'Fiscal', icon: '📄' },
    { name: 'Seguros Pro', category: 'Seguros', icon: '🛡️' },
    { name: 'Academy Cursos', category: 'Educação', icon: '📚' },
  ];

  return (
    <>
      <style>{`
        .partnerships-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .partnerships-title { font-size: 16px; font-weight: 700; color: #1d174f; margin: 0 0 16px; }
        .partners-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
        .partner-item { padding: 16px; background: #f9f7f3; border-radius: 10px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .partner-item:hover { background: white; border: 2px solid #ef4b31; }
        .partner-icon { font-size: 28px; margin-bottom: 8px; }
        .partner-name { font-size: 12px; font-weight: 700; color: #1d174f; margin: 0 0 4px; }
        .partner-category { font-size: 10px; color: #a8a3b5; margin: 0; }
      `}</style>
      <div className="partnerships-card">
        <p className="partnerships-title">🤝 Parcerias Complementares</p>
        <div className="partners-grid">
          {partners.map((p, i) => (
            <div key={i} className="partner-item">
              <div className="partner-icon">{p.icon}</div>
              <p className="partner-name">{p.name}</p>
              <p className="partner-category">{p.category}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
