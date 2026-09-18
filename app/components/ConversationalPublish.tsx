'use client';
import { useState } from 'react';

export default function ConversationalPublish() {
  const [step, setStep] = useState(0);
  const [project, setProject] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
  });

  const steps = [
    { question: "Qual é o nome do seu projeto?", field: 'title', placeholder: 'Ex: Reforma Cozinha Apartamento' },
    { question: "Descreva o que você precisa", field: 'description', placeholder: 'Conte tudo sobre o projeto...' },
    { question: "Qual é a categoria?", field: 'category', placeholder: 'Selecione a categoria' },
    { question: "Qual é seu orçamento?", field: 'budget', placeholder: 'Ex: R$ 5.000 - R$ 10.000' },
    { question: "Quando você precisa?", field: 'deadline', placeholder: 'Ex: Próximas 2 semanas' },
  ];

  const current = steps[step];
  const progress = Math.round(((step + 1) / steps.length) * 100);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePublish = () => {
    console.log('Projeto publicado:', project);
    alert('✅ Projeto publicado com sucesso!');
    setStep(0);
    setProject({ title: '', description: '', category: '', budget: '', deadline: '' });
  };

  return (
    <>
      <style>{`
        .publish-wizard {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: grid;
          place-items: center;
          z-index: 60;
          animation: fadeIn 0.3s ease-out;
        }
        .publish-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        .publish-progress {
          height: 4px;
          background: #ece9e4;
          border-radius: 2px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .publish-fill {
          height: 100%;
          background: linear-gradient(90deg, #ef4b31, #d4381f);
          width: ${progress}%;
          transition: width 0.3s ease-out;
        }
        .publish-step-counter {
          font-size: 12px;
          color: #a8a3b5;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .publish-question {
          font-size: 24px;
          font-weight: 700;
          color: #1d174f;
          margin: 0 0 20px;
        }
        .publish-input {
          width: 100%;
          border: 2px solid #ece9e4;
          border-radius: 10px;
          padding: 14px 16px;
          font-size: 14px;
          font-family: inherit;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .publish-input:focus {
          outline: 0;
          border-color: #ef4b31;
        }
        .publish-input::placeholder {
          color: #d7d2ca;
          font-weight: 400;
        }
        .publish-summary {
          background: #f9f7f3;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 20px;
          max-height: 300px;
          overflow-y: auto;
        }
        .summary-item {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ece9e4;
        }
        .summary-item:last-child {
          border: 0;
          margin: 0;
          padding: 0;
        }
        .summary-label {
          font-size: 11px;
          font-weight: 700;
          color: #a8a3b5;
          text-transform: uppercase;
        }
        .summary-value {
          font-size: 13px;
          color: #1d174f;
          font-weight: 600;
        }
        .publish-actions {
          display: flex;
          gap: 12px;
        }
        .publish-actions button {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: 0;
        }
        .publish-actions .back {
          background: #f5f3f0;
          color: #5d5969;
        }
        .publish-actions .back:hover {
          background: #ece9e4;
        }
        .publish-actions .next {
          background: #ef4b31;
          color: white;
        }
        .publish-actions .next:hover {
          background: #d4381f;
        }
      `}</style>

      <div className="publish-wizard">
        <div className="publish-card">
          <div className="publish-progress">
            <div className="publish-fill" />
          </div>

          <div className="publish-step-counter">Passo {step + 1} de {steps.length}</div>
          <h2 className="publish-question">{current.question}</h2>

          {step === steps.length - 1 ? (
            <>
              <div className="publish-summary">
                {Object.entries(project).map(([key, value]) => (
                  <div key={key} className="summary-item">
                    <span className="summary-label">{key}</span>
                    <span className="summary-value">{value}</span>
                  </div>
                ))}
              </div>
              <p style={{fontSize: 12, color: '#a8a3b5', marginBottom: 20}}>
                ✓ Tudo certo? Revise e publique seu projeto!
              </p>
            </>
          ) : (
            <input
              type={current.field === 'description' ? 'textarea' : 'text'}
              className="publish-input"
              placeholder={current.placeholder}
              value={project[current.field as keyof typeof project]}
              onChange={(e) => setProject({...project, [current.field]: e.target.value})}
              autoFocus
            />
          )}

          <div className="publish-actions">
            <button 
              className="back"
              onClick={() => step > 0 ? setStep(step - 1) : null}
              disabled={step === 0}
              style={{opacity: step === 0 ? 0.5 : 1}}
            >
              ← Voltar
            </button>
            <button 
              className="next"
              onClick={() => step === steps.length - 1 ? handlePublish() : handleNext()}
            >
              {step === steps.length - 1 ? '🚀 Publicar Projeto' : 'Próximo →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
