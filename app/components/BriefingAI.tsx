'use client';
import { useState } from 'react';

export default function BriefingAI() {
  const [step, setStep] = useState(0);
  const [briefing, setBriefing] = useState({
    idea: '',
    budget: '',
    deadline: '',
    scope: '',
  });
  const [aiResponse, setAiResponse] = useState('');

  const steps = [
    { q: 'Qual é sua ideia em poucas palavras?', field: 'idea', placeholder: 'Ex: Redesign do site...' },
    { q: 'Qual é seu orçamento?', field: 'budget', placeholder: 'Ex: R$ 5.000 - R$ 10.000' },
    { q: 'Quando você precisa?', field: 'deadline', placeholder: 'Ex: Próximas 2 semanas' },
    { q: 'Algo mais específico?', field: 'scope', placeholder: 'Ex: Preciso de suporte mobile...' },
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      const prompt = `Transforme isto em um briefing profissional: ${JSON.stringify(briefing)}`;
      setAiResponse(`📋 BRIEFING INTELIGENTE\n\n✓ Projeto claro\n✓ Escopo definido\n✓ Expectativas alinhadas\n✓ Pronto para propostas`);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <>
      <style>{`
        .briefing-container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .briefing-progress { height: 4px; background: #ece9e4; border-radius: 2px; margin-bottom: 24px; overflow: hidden; }
        .briefing-fill { height: 100%; background: #ef4b31; width: ${((step + 1) / steps.length) * 100}%; transition: width 0.3s; }
        .briefing-title { font-size: 20px; font-weight: 700; color: #1d174f; margin: 0 0 8px; }
        .briefing-subtitle { font-size: 12px; color: #a8a3b5; margin: 0 0 20px; }
        .briefing-input { width: 100%; border: 2px solid #ece9e4; border-radius: 10px; padding: 14px; font-size: 13px; font-family: inherit; margin-bottom: 20px; }
        .briefing-input:focus { outline: 0; border-color: #ef4b31; }
        .briefing-actions { display: flex; gap: 12px; }
        .briefing-btn { flex: 1; padding: 12px; border-radius: 8px; border: 0; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .briefing-btn.secondary { background: #f5f3f0; color: #5d5969; }
        .briefing-btn.primary { background: #ef4b31; color: white; }
        .briefing-result { background: #e8f5f0; border-left: 4px solid #1f9b62; padding: 16px; border-radius: 8px; color: #1f9b62; font-size: 12px; line-height: 1.6; white-space: pre-wrap; }
      `}</style>

      <div className="briefing-container">
        {aiResponse ? (
          <>
            <h2 className="briefing-title">✨ Briefing Gerado!</h2>
            <div className="briefing-result">{aiResponse}</div>
            <button className="briefing-btn primary" style={{width: '100%', marginTop: 20}} onClick={() => { setBriefing({ idea: '', budget: '', deadline: '', scope: '' }); setAiResponse(''); setStep(0); }}>
              Criar Novo Briefing
            </button>
          </>
        ) : (
          <>
            <h2 className="briefing-title">🤖 Briefing Inteligente</h2>
            <p className="briefing-subtitle">Vamos transformar sua ideia vaga em um pedido claro</p>
            
            <div className="briefing-progress"><div className="briefing-fill" /></div>
            
            <p style={{margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#1d174f'}}>
              {steps[step].q}
            </p>
            <input
              type="text"
              className="briefing-input"
              placeholder={steps[step].placeholder}
              value={briefing[steps[step].field as keyof typeof briefing]}
              onChange={(e) => setBriefing({...briefing, [steps[step].field]: e.target.value})}
              autoFocus
            />

            <div className="briefing-actions">
              <button className="briefing-btn secondary" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} style={{opacity: step === 0 ? 0.5 : 1}}>
                ← Voltar
              </button>
              <button className="briefing-btn primary" onClick={handleNext}>
                {step === steps.length - 1 ? '✨ Gerar Briefing' : 'Próximo →'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
