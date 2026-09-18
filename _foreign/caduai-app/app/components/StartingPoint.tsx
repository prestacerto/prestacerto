'use client';
export default function StartingPoint() {
  return (
    <>
      <style>{`
        .starting { background: white; padding: 80px 40px; }
        @media (max-width: 768px) { .starting { padding: 40px 24px; } }
        
        .starting-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        @media (max-width: 768px) { .starting-container { grid-template-columns: 1fr; gap: 40px; } }
        
        .starting-image { position: relative; width: 100%; height: 450px; background: linear-gradient(135deg, #e5e0eb 0%, #d5d0e0 100%); border-radius: 20px; display: grid; place-items: center; font-size: 100px; overflow: hidden; }
        @media (max-width: 768px) { .starting-image { height: 250px; } }
        
        .starting-badge { position: absolute; bottom: 24px; left: 24px; background: #ccff00; color: #1d174f; padding: 12px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; }
        
        .starting-content { display: grid; gap: 32px; }
        .starting-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #0066ff; text-transform: uppercase; margin: 0; }
        .starting-title { font-size: 44px; font-weight: 900; color: #1d174f; margin: 0; line-height: 1.2; }
        
        .starting-options { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 24px; }
        @media (max-width: 768px) { .starting-options { grid-template-columns: 1fr; } }
        
        .option-card { background: #f9f7f3; border-radius: 12px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; }
        .option-card:hover { border-color: #0066ff; background: white; box-shadow: 0 8px 24px rgba(0, 102, 255, 0.1); }
        
        .option-icon { font-size: 32px; margin-bottom: 12px; }
        .option-title { font-size: 13px; font-weight: 700; color: #1d174f; margin: 0; }
        .option-desc { font-size: 12px; color: #5d5969; margin: 6px 0 0; }
      `}</style>

      <section className="starting">
        <div className="starting-container">
          <div className="starting-image">
            👥
            <div className="starting-badge">Comunidade que faz acontecer.</div>
          </div>

          <div className="starting-content">
            <p className="starting-label">Seu ponto de partida</p>
            <h2 className="starting-title">Chegue como você está. A gente organiza o próximo passo.</h2>
            
            <div className="starting-options">
              <div className="option-card">
                <div className="option-icon">🔍</div>
                <p className="option-title">Preciso de alguém</p>
                <p className="option-desc">Explorar profissionais</p>
              </div>
              <div className="option-card">
                <div className="option-icon">📝</div>
                <p className="option-title">Tenho um projeto</p>
                <p className="option-desc">Publicar briefing</p>
              </div>
              <div className="option-card">
                <div className="option-icon">💰</div>
                <p className="option-title">Quero cobrar melhor</p>
                <p className="option-desc">Abrir calculadora</p>
              </div>
            </div>

            <p style={{fontSize: '14px', color: '#5d5969', margin: '24px 0 0', lineHeight: '1.6'}}>
              Ainda entendendo o que você precisa? Tudo bem. Comece pelo caminho que fizer sentido agora — sem pressão para decidir tudo de uma vez.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
