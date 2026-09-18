'use client';
import { useState } from 'react';

export default function IntentOnboarding() {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<'client' | 'provider' | null>(null);
  const [answers, setAnswers] = useState({ budget: '', timeline: '', category: '' });

  if (step === 0) {
    return (
      <>
        <style>{`
          .intent-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: grid;
            place-items: center;
            z-index: 60;
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .intent-card {
            background: white;
            border-radius: 20px;
            padding: 50px 40px;
            max-width: 520px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          }
          .intent-card h1 {
            margin: 0 0 12px;
            font-size: 32px;
            font-weight: 700;
            color: #1d174f;
          }
          .intent-card p {
            margin: 0 0 40px;
            font-size: 16px;
            color: #5d5969;
          }
          .intent-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .intent-btn {
            padding: 24px 20px;
            border: 2px solid #ece9e4;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 16px;
            font-weight: 700;
          }
          .intent-btn:hover {
            border-color: #ef4b31;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(239, 75, 49, 0.15);
          }
          .intent-btn.client:hover {
            background: #ffe1da;
          }
          .intent-btn.provider:hover {
            background: #e8f5f0;
          }
        `}</style>

        <div className="intent-modal">
          <div className="intent-card">
            <h1>Bem-vindo! 👋</h1>
            <p>O que você quer fazer?</p>
            <div className="intent-buttons">
              <button 
                className="intent-btn client"
                onClick={() => {
                  setIntent('client');
                  setStep(1);
                }}
              >
                💼 Contratar<br/><small style={{fontSize: 12, opacity: 0.7}}>Encontrar prestador</small>
              </button>
              <button 
                className="intent-btn provider"
                onClick={() => {
                  setIntent('provider');
                  setStep(1);
                }}
              >
                ⭐ Prestar<br/><small style={{fontSize: 12, opacity: 0.7}}>Oferecer serviço</small>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .questions-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: grid;
          place-items: center;
          z-index: 60;
        }
        .questions-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        .questions-card h2 {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 700;
          color: #1d174f;
        }
        .questions-card .progress {
          height: 3px;
          background: #ece9e4;
          border-radius: 2px;
          margin: 16px 0 24px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #ef4b31;
          width: calc(${step - 1} * 50% + 33%);
          transition: width 0.3s ease-out;
        }
        .question-group {
          margin-bottom: 20px;
        }
        .question-group label {
          display: block;
          font-weight: 700;
          color: #1d174f;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .question-group select, .question-group input {
          width: 100%;
          border: 1px solid #d7d2ca;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          font-family: inherit;
        }
        .question-group select:focus, .question-group input:focus {
          outline: 0;
          border-color: #ef4b31;
        }
        .q-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }
        .q-actions button {
          flex: 1;
          padding: 12px;
          border: 1px solid #d7d2ca;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          transition: all 0.2s;
        }
        .q-actions .back {
          background: white;
          color: #5d5969;
        }
        .q-actions .back:hover {
          background: #f5f3f0;
        }
        .q-actions .next {
          background: #ef4b31;
          color: white;
          border: 0;
        }
        .q-actions .next:hover {
          background: #d4381f;
        }
      `}</style>

      <div className="questions-modal">
        <div className="questions-card">
          <h2>{intent === 'client' ? '📋' : '⭐'} Quase lá!</h2>
          <div className="progress"><div className="progress-fill" /></div>

          {step === 1 && (
            <div className="question-group">
              <label>
                {intent === 'client' 
                  ? 'Qual é o orçamento?' 
                  : 'Qual é sua principal área?'}
              </label>
              <select 
                value={answers.budget}
                onChange={(e) => setAnswers({...answers, budget: e.target.value})}
              >
                <option>Selecione...</option>
                {intent === 'client' ? (
                  <>
                    <option>Até R$ 1.000</option>
                    <option>R$ 1.000 - R$ 5.000</option>
                    <option>R$ 5.000 - R$ 20.000</option>
                    <option>Acima de R$ 20.000</option>
                  </>
                ) : (
                  <>
                    <option>Arquitetura</option>
                    <option>Engenharia</option>
                    <option>Design</option>
                    <option>Reforma</option>
                  </>
                )}
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="question-group">
              <label>
                {intent === 'client' 
                  ? 'Quando você precisa?' 
                  : 'Qual o tempo de resposta?'}
              </label>
              <select 
                value={answers.timeline}
                onChange={(e) => setAnswers({...answers, timeline: e.target.value})}
              >
                <option>Selecione...</option>
                {intent === 'client' ? (
                  <>
                    <option>Urgente (até 1 semana)</option>
                    <option>Próximas 2-4 semanas</option>
                    <option>Próximos 2-3 meses</option>
                    <option>Sem pressa</option>
                  </>
                ) : (
                  <>
                    <option>Até 1 hora</option>
                    <option>Até 4 horas</option>
                    <option>Até 24 horas</option>
                    <option>2-3 dias</option>
                  </>
                )}
              </select>
            </div>
          )}

          <div className="q-actions">
            <button 
              className="back"
              onClick={() => step > 1 ? setStep(step - 1) : setStep(0)}
            >
              Voltar
            </button>
            <button 
              className="next"
              onClick={() => step < 2 ? setStep(step + 1) : setStep(0)}
            >
              {step === 2 ? '✅ Pronto!' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
