'use client';
import { useState } from 'react';

export default function ProgressiveSignup() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', profession: '', category: '', photo: '' });

  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log('Signup completo:', formData);
      alert('✅ Cadastro iniciado com sucesso!');
      setOpen(false);
      setStep(1);
    }
  };

  return (
    <>
      <style>{`
        .signup-trigger {
          position: fixed;
          bottom: 110px;
          right: 24px;
          z-index: 35;
        }
        .signup-btn {
          background: linear-gradient(135deg, #ef4b31 0%, #d4381f 100%);
          color: white;
          border: 0;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(239, 75, 49, 0.3);
          transition: all 0.2s;
        }
        .signup-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(239, 75, 49, 0.4);
        }
        .signup-modal {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          display: grid;
          place-items: center;
          z-index: 50;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .signup-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 420px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }
        .signup-header {
          margin-bottom: 30px;
        }
        .signup-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1d174f;
        }
        .signup-header p {
          margin: 8px 0 0;
          color: #777381;
          font-size: 13px;
        }
        .progress-bar {
          height: 3px;
          background: #ece9e4;
          border-radius: 2px;
          margin: 20px 0;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #ef4b31;
          width: calc(${step} * 33.33%);
          transition: width 0.3s ease-out;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #5d5969;
          margin-bottom: 6px;
        }
        .form-group input, .form-group select {
          width: 100%;
          border: 1px solid #d7d2ca;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          font-family: inherit;
        }
        .form-group input:focus, .form-group select:focus {
          outline: 0;
          border-color: #ef4b31;
        }
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .form-actions button {
          flex: 1;
          border: 1px solid #d7d2ca;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .form-actions .cancel {
          background: transparent;
          color: #5d5969;
        }
        .form-actions .cancel:hover {
          background: #f5f3f0;
        }
        .form-actions .submit {
          background: #ef4b31;
          color: white;
          border: 0;
        }
        .form-actions .submit:hover {
          background: #d4381f;
        }
        @media (max-width: 640px) {
          .signup-card {
            padding: 28px 20px;
          }
        }
      `}</style>

      {open && (
        <div className="signup-modal" onClick={() => setOpen(false)}>
          <div className="signup-card" onClick={e => e.stopPropagation()}>
            <div className="signup-header">
              <h2>Cadastre-se Grátis</h2>
              <p>Passo {step} de 3 - {step === 1 ? 'Email' : step === 2 ? 'Profissão' : 'Finalizar'}</p>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" />
            </div>

            {step === 1 && (
              <>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Senha</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label>Profissão</label>
                  <select value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})}>
                    <option>Selecione sua profissão</option>
                    <option>Imobiliário</option>
                    <option>Arquiteto</option>
                    <option>Engenheiro</option>
                    <option>Designer</option>
                    <option>Consultor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Selecione sua categoria</option>
                    <option>Residencial</option>
                    <option>Comercial</option>
                    <option>Industrial</option>
                  </select>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="form-group">
                <label>Foto de Perfil (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={formData.photo}
                  onChange={e => setFormData({...formData, photo: e.target.value})}
                />
              </div>
            )}

            <div className="form-actions">
              <button className="cancel" onClick={() => setOpen(false)}>Cancelar</button>
              <button className="submit" onClick={handleSubmit}>
                {step === 3 ? 'Finalizar' : 'Próximo'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="signup-trigger">
        <button className="signup-btn" onClick={() => setOpen(true)}>
          ✨
        </button>
      </div>
    </>
  );
}
