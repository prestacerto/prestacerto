'use client';
export default function DiscoverSection() {
  return (
    <>
      <style>{`
        .discover { background: white; padding: 80px 40px; }
        @media (max-width: 768px) { .discover { padding: 40px 24px; } }
        
        .discover-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        @media (max-width: 768px) { .discover-container { grid-template-columns: 1fr; gap: 40px; } }
        
        .discover-content { display: grid; gap: 32px; }
        .discover-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #0066ff; text-transform: uppercase; margin: 0; }
        .discover-title { font-size: 44px; font-weight: 900; color: #1d174f; margin: 0; line-height: 1.2; }
        .discover-desc { font-size: 16px; line-height: 1.7; color: #5d5969; margin: 0; }
        
        .discover-steps { display: grid; gap: 20px; margin-top: 20px; }
        .step { display: grid; grid-template-columns: 40px 1fr; gap: 16px; align-items: start; }
        .step-number { width: 40px; height: 40px; background: #ccff00; border-radius: 8px; display: grid; place-items: center; font-weight: 700; color: #1d174f; flex-shrink: 0; }
        .step-text { font-size: 14px; color: #1d174f; font-weight: 600; line-height: 1.6; }
        
        .discover-cta { margin-top: 24px; }
        .btn-discover { background: #1d174f; color: white; border: 0; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.3s; }
        .btn-discover:hover { background: #0a0820; transform: translateY(-2px); }
        
        .discover-image { position: relative; width: 100%; height: 400px; background: linear-gradient(135deg, #e5e0eb 0%, #d5d0e0 100%); border-radius: 20px; display: grid; place-items: center; font-size: 100px; }
        @media (max-width: 768px) { .discover-image { height: 250px; } }
        
        .discover-badge { position: absolute; bottom: 24px; left: 24px; background: #ccff00; color: #1d174f; padding: 12px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; }
      `}</style>

      <section className="discover">
        <div className="discover-container">
          <div className="discover-content">
            <p className="discover-label">Contratação sem ruído</p>
            <h2 className="discover-title">Descubra o que realmente importa.</h2>
            <p className="discover-desc">Mais contexto para comparar, menos pressão para fechar correndo.</p>
            
            <div className="discover-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-text">Conte o que você precisa</div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-text">Busque profissionais</div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-text">Combine com clareza</div>
              </div>
            </div>
            
            <div className="discover-cta">
              <button className="btn-discover">Como funciona →</button>
            </div>
          </div>

          <div className="discover-image">
            👥
            <div className="discover-badge">Comunidade que faz acontecer.</div>
          </div>
        </div>
      </section>
    </>
  );
}
