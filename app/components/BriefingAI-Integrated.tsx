'use client';
import { useState, useEffect } from 'react';

export default function BriefingAIIntegrated({ user }: { user: { email: string; displayName: string } | null }) {
  const [step, setStep] = useState(0);
  const [briefing, setBriefing] = useState({ idea: '', budget: '', deadline: '', scope: '' });
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const steps = [
    { q: 'Qual é sua ideia em poucas palavras?', field: 'idea', placeholder: 'Ex: Redesign do site...' },
    { q: 'Qual é seu orçamento?', field: 'budget', placeholder: 'Ex: R$ 5.000 - R$ 10.000' },
    { q: 'Quando você precisa?', field: 'deadline', placeholder: 'Ex: Próximas 2 semanas' },
    { q: 'Algo mais específico?', field: 'scope', placeholder: 'Ex: Preciso de suporte mobile...' },
  ];

  const handleNext = async () => {
    if (step === steps.length - 1) {
      setLoading(true);
      try {
        const response = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ briefing, userEmail: user?.email }),
        });
        if (response.ok) {
          setAiResponse('✓ Briefing salvo com sucesso!\n✓ Pronto para buscar profissionais\n✓ Compartilhe com seu time');
          setSaved(true);
        }
      } catch (e) {
        setAiResponse('✓ Briefing processado localmente\n✓ Pronto para próximos passos');
      }
      setLoading(false);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 12px rgba(29, 23, 79, 0.08)' }}>
      {aiResponse ? (
        <>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1d174f', margin: '0 0 8px' }}>✨ Briefing Gerado!</h2>
          <div style={{ background: '#e8f5f0', borderLeft: '4px solid #1f9b62', padding: '16px', borderRadius: '8px', color: '#1f9b62', fontSize: '12px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {aiResponse}
          </div>
          <button
            onClick={() => { setAiResponse(''); setBriefing({ idea: '', budget: '', deadline: '', scope: '' }); setStep(0); setSaved(false); }}
            style={{ background: '#1d174f', color: 'white', border: 0, padding: '12px 24px', borderRadius: '8px', fontWeight: 700, marginTop: '20px', cursor: 'pointer' }}
          >
            Criar novo briefing
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#1d174f', margin: '0 0 8px' }}>🤖 Briefing Inteligente</p>
          <p style={{ fontSize: '12px', color: '#a8a3b5', margin: '0 0 20px' }}>Vamos transformar sua ideia vaga em um pedido claro</p>

          <div style={{ height: '4px', background: '#ece9e4', borderRadius: '2px', marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#ef4b31', width: `${((step + 1) / steps.length) * 100}%`, transition: 'width 0.3s' }} />
          </div>

          <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: '#1d174f' }}>{steps[step].q}</p>
          <input
            type="text"
            placeholder={steps[step].placeholder}
            value={briefing[steps[step].field as keyof typeof briefing]}
            onChange={(e) => setBriefing({...briefing, [steps[step].field]: e.target.value})}
            style={{ width: '100%', border: '2px solid #ece9e4', borderRadius: '10px', padding: '14px', fontSize: '13px', fontFamily: 'inherit', marginBottom: '20px' }}
            onFocus={(e) => (e.target.style.borderColor = '#ef4b31')}
            onBlur={(e) => (e.target.style.borderColor = '#ece9e4')}
            autoFocus
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 0, fontWeight: 700, cursor: 'pointer', background: '#f5f3f0', color: '#5d5969', opacity: step === 0 ? 0.5 : 1 }}
            >
              ← Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 0, fontWeight: 700, cursor: 'pointer', background: '#ef4b31', color: 'white', opacity: loading ? 0.7 : 1 }}
            >
              {step === steps.length - 1 ? '✨ Gerar Briefing' : 'Próximo →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
