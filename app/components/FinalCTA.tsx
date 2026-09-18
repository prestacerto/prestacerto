'use client';
export default function FinalCTA() {
  return (
    <>
      <style>{`
        .final-cta { background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%); padding: 80px 40px; text-align: center; }
        @media (max-width: 768px) { .final-cta { padding: 40px 24px; } }
        
        .final-cta-container { max-width: 900px; margin: 0 auto; display: grid; gap: 32px; }
        
        .final-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #ccff00; text-transform: uppercase; margin: 0; }
        .final-title { font-size: 48px; font-weight: 900; color: white; margin: 0; line-height: 1.2; }
        .final-desc { font-size: 18px; line-height: 1.7; color: rgba(255, 255, 255, 0.9); margin: 0; }
        
        .final-button { background: #ccff00; color: #0066ff; border: 0; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); display: inline-block; }
        .final-button:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(204, 255, 0, 0.3); }
      `}</style>

      <section className="final-cta">
        <div className="final-cta-container">
          <p className="final-label">O próximo Certo pode começar aqui</p>
          <h2 className="final-title">Trabalho real pede contexto real.</h2>
          <button className="final-button">Criar minha conta →</button>
        </div>
      </section>
    </>
  );
}
