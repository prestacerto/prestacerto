'use client';
import { useState } from 'react';

export default function FAQNarrative() {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    { q: 'Como contratar um profissional?', a: 'Conte o que você precisa, explore perfis e compare portfólio, prazo, avaliações e proposta antes de conversar. Sem pressão.' },
    { q: 'Posso publicar um projeto gratuitamente?', a: 'Sim. Publicar o briefing é grátis. Você só paga quando contrata alguém e apenas pelo que foi acordado.' },
    { q: 'O que é o Certo AI?', a: 'É um assistente que ajuda a transformar ideias vagas em briefings claros. Deixa a negociação mais objetiva para ambos.' },
    { q: 'Como sei se a avaliação é real?', a: 'Todas as avaliações vêm de projetos verificados. Você vê o histórico completo de quem fez o quê, quando e com qual resultado.' },
  ];

  return (
    <>
      <style>{`
        .faq { background: linear-gradient(180deg, #f9f7f3 0%, white 100%); padding: 80px 40px; }
        @media (max-width: 768px) { .faq { padding: 40px 24px; } }
        
        .faq-container { max-width: 1200px; margin: 0 auto; }
        .faq-header { margin-bottom: 60px; }
        .faq-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #0066ff; text-transform: uppercase; margin: 0 0 16px; }
        .faq-title { font-size: 44px; font-weight: 900; color: #1d174f; margin: 0; line-height: 1.2; }
        
        .faq-list { display: grid; gap: 0; max-width: 800px; }
        .faq-item { border-bottom: 1px solid #e5e0eb; }
        .faq-item:last-child { border-bottom: 0; }
        
        .faq-question { padding: 24px 0; cursor: pointer; display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; transition: all 0.2s; }
        .faq-question:hover { color: #0066ff; }
        
        .faq-q-text { font-size: 16px; font-weight: 700; color: #1d174f; margin: 0; }
        .faq-question:hover .faq-q-text { color: #0066ff; }
        
        .faq-toggle { width: 24px; height: 24px; border-radius: 50%; background: #e5e0eb; display: grid; place-items: center; font-size: 12px; font-weight: 700; color: #1d174f; flex-shrink: 0; transition: all 0.3s; }
        .faq-item.active .faq-toggle { background: #0066ff; color: white; transform: rotate(180deg); }
        
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; padding: 0; }
        .faq-item.active .faq-answer { max-height: 200px; padding: 0 0 24px 0; }
        
        .faq-a-text { font-size: 14px; line-height: 1.7; color: #5d5969; margin: 0; }
      `}</style>

      <section className="faq">
        <div className="faq-container">
          <div className="faq-header">
            <p className="faq-label">Perguntas frequentes</p>
            <h2 className="faq-title">Clareza também é cuidado.</h2>
          </div>

          <div className="faq-list">
            {faqs.map((item, i) => (
              <div key={i} className={`faq-item ${openIndex === i ? 'active' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  style={{background: 'none', border: 'none', textAlign: 'left', font: 'inherit', cursor: 'pointer', width: '100%'}}
                >
                  <p className="faq-q-text">{item.q}</p>
                  <div className="faq-toggle">+</div>
                </button>
                <div className="faq-answer">
                  <p className="faq-a-text">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
