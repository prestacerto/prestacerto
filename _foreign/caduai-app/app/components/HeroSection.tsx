'use client';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <style>{`
        .hero { position: relative; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; padding: 80px 40px; background: white; overflow: hidden; }
        
        @media (max-width: 768px) { .hero { grid-template-columns: 1fr; min-height: auto; padding: 40px 24px; } }
        
        .hero-content { display: grid; gap: 32px; }
        .hero-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #a8a3b5; text-transform: uppercase; margin: 0; }
        
        .hero-headline { margin: 0; font-size: 56px; font-weight: 900; line-height: 1.15; color: #1d174f; }
        .hero-headline-accent { color: #0066ff; display: block; }
        
        @media (max-width: 768px) { .hero-headline { font-size: 40px; } }
        
        .hero-description { font-size: 16px; line-height: 1.7; color: #5d5969; margin: 0; max-width: 90%; }
        .hero-description strong { color: #1d174f; font-weight: 700; }
        
        .hero-ctas { display: grid; grid-template-columns: auto auto; gap: 16px; align-items: center; }
        
        @media (max-width: 768px) { .hero-ctas { grid-template-columns: 1fr; } }
        
        .btn-primary { background: #0066ff; color: white; border: 0; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .btn-primary:hover { background: #0052cc; transform: translateY(-2px); box-shadow: 0 12px 24px rgba(0, 102, 255, 0.2); }
        
        .btn-secondary { background: white; color: #1d174f; border: 2px solid #e5e0eb; padding: 12px 26px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { border-color: #1d174f; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        
        .hero-image { position: relative; width: 100%; height: 500px; background: linear-gradient(135deg, #f0ebf8 0%, #e8e3f0 100%); border-radius: 20px; display: grid; place-items: center; font-size: 120px; overflow: hidden; }
        
        @media (max-width: 768px) { .hero-image { height: 300px; } }
        
        .hero-badge { position: absolute; bottom: 20px; right: 20px; background: #ccff00; color: #1d174f; padding: 12px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; backdrop-filter: blur(10px); }
        
        .fade-in { opacity: 0; animation: fadeInUp 0.8s ease-out forwards; }
        .fade-in-1 { animation-delay: 0.1s; }
        .fade-in-2 { animation-delay: 0.2s; }
        .fade-in-3 { animation-delay: 0.3s; }
        .fade-in-4 { animation-delay: 0.4s; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="hero">
        <div className="hero-content">
          <p className={`hero-label ${isVisible ? 'fade-in fade-in-1' : ''}`}>
            Contrate melhor, sem comissões
          </p>

          <h1 className={`hero-headline ${isVisible ? 'fade-in fade-in-2' : ''}`}>
            Contrate<br/>
            melhor.<br/>
            <span className="hero-headline-accent">Sem comissões.</span>
          </h1>
          
          <p className={`hero-description ${isVisible ? 'fade-in fade-in-3' : ''}`}>
            Encontre <strong>freelancers e prestadores com histórico verificado</strong>. Compare <strong>portfólio, prazo e valor</strong> antes de decidir. Contrate com <strong>segurança, contexto e sem comissões</strong>.
          </p>
          
          <div className={`hero-ctas ${isVisible ? 'fade-in fade-in-4' : ''}`}>
            <button className="btn-primary">Publicar projeto grátis</button>
            <button className="btn-secondary">Explorar prestadores →</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px', fontSize: '12px', color: '#a8a3b5' }}>
            <div>✓ Avaliações reais verificadas</div>
            <div>✓ Sem comissões ou taxas</div>
            <div>✓ Negociação transparente</div>
            <div>✓ Pagamento seguro com escrow</div>
          </div>
        </div>

        <div className={`hero-image ${isVisible ? 'fade-in fade-in-4' : ''}`}>
          👨‍💼
          <div className="hero-badge">Profissional em destaque: Mais sinais antes de conversar.</div>
        </div>
      </section>
    </>
  );
}
// Deploy timestamp: Thu Sep  3 12:52:22 -03 2026
