'use client';
export default function ThreePillars() {
  const pillars = [
    { number: '01', title: 'Feito para o Brasil', desc: 'Linguagem, categorias e jornada próximos da rotina local.' },
    { number: '02', title: 'Compare com clareza', desc: 'Perfil, portfólio, prazo, avaliações e preço lado a lado.' },
    { number: '03', title: 'Certo Suite', desc: 'Ferramentas para contratar e trabalhar melhor.' },
  ];

  return (
    <>
      <style>{`
        .pillars { background: white; padding: 80px 40px; }
        @media (max-width: 768px) { .pillars { padding: 40px 24px; } }
        
        .pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) { .pillars-grid { grid-template-columns: 1fr; gap: 24px; } }
        
        .pillar-card { padding: 32px 0; border-bottom: 2px solid #e5e0eb; }
        .pillar-number { font-size: 48px; font-weight: 900; color: #0066ff; margin: 0 0 16px; }
        .pillar-title { font-size: 20px; font-weight: 700; color: #1d174f; margin: 0 0 12px; }
        .pillar-desc { font-size: 14px; line-height: 1.6; color: #5d5969; margin: 0; }
      `}</style>

      <section className="pillars">
        <div className="pillars-grid">
          {pillars.map((p, i) => (
            <div key={i} className="pillar-card">
              <div className="pillar-number">{p.number}</div>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
