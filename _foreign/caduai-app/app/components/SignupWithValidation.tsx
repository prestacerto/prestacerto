'use client';
import { useState } from 'react';

interface SignupData {
  email: string;
  password: string;
  name: string;
  category: string;
  responseTime: string;
  phone: string;
}

export default function SignupWithValidation() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SignupData>({
    email: '',
    password: '',
    name: '',
    category: '',
    responseTime: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<SignupData>>({});
  const [saved, setSaved] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd: string) => pwd.length >= 8;
  const validatePhone = (phone: string) => /^\d{10,11}$/.test(phone.replace(/\D/g, ''));

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Partial<SignupData> = {};
    
    if (stepNum === 0) {
      if (!data.email) newErrors.email = 'Email obrigatório';
      else if (!validateEmail(data.email)) newErrors.email = 'Email inválido';
      if (!data.password) newErrors.password = 'Senha obrigatória';
      else if (!validatePassword(data.password)) newErrors.password = 'Mínimo 8 caracteres';
    } else if (stepNum === 1) {
      if (!data.name) newErrors.name = 'Nome obrigatório';
      if (!data.category) newErrors.category = 'Categoria obrigatória';
      if (!data.responseTime) newErrors.responseTime = 'Tempo de resposta obrigatório';
    } else if (stepNum === 2) {
      if (!data.phone) newErrors.phone = 'Telefone obrigatório';
      else if (!validatePhone(data.phone)) newErrors.phone = 'Telefone inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 2) {
        // Simula salvar no localStorage/banco
        localStorage.setItem('prestador', JSON.stringify(data));
        setSaved(true);
        setTimeout(() => {
          alert('✅ Cadastro completo! Bem-vindo à plataforma!');
          setStep(0);
          setData({ email: '', password: '', name: '', category: '', responseTime: '', phone: '' });
          setSaved(false);
        }, 1500);
      } else {
        setStep(step + 1);
      }
    }
  };

  return (
    <>
      <style>{`
        .signup-validation {
          max-width: 500px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .validation-progress {
          height: 4px;
          background: #ece9e4;
          border-radius: 2px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .validation-fill {
          height: 100%;
          background: linear-gradient(90deg, #ef4b31, #1f9b62);
          width: ${((step + 1) / 3) * 100}%;
          transition: width 0.3s ease-out;
        }
        .validation-title {
          font-size: 20px;
          font-weight: 700;
          color: #1d174f;
          margin: 0 0 8px;
        }
        .validation-subtitle {
          color: #5d5969;
          font-size: 12px;
          margin: 0 0 20px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #5d5969;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          border: 2px solid #ece9e4;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          font-family: inherit;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: 0;
          border-color: #ef4b31;
        }
        .form-input.error {
          border-color: #ff6b6b;
          background: #ffe1da;
        }
        .form-error {
          color: #ff6b6b;
          font-size: 11px;
          margin-top: 4px;
        }
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .form-actions button {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          border: 0;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-back {
          background: #f5f3f0;
          color: #5d5969;
        }
        .btn-back:hover {
          background: #ece9e4;
        }
        .btn-next {
          background: #ef4b31;
          color: white;
        }
        .btn-next:hover {
          background: #d4381f;
        }
        .success-state {
          text-align: center;
          padding: 40px 0;
        }
        .success-icon {
          font-size: 64px;
          margin-bottom: 16px;
          animation: bounce 0.6s ease-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="signup-validation">
        <div className="validation-progress">
          <div className="validation-fill" />
        </div>

        {!saved ? (
          <>
            <h2 className="validation-title">Cadastro Prestador</h2>
            <p className="validation-subtitle">Passo {step + 1} de 3 - {step === 0 ? 'Acesso' : step === 1 ? 'Perfil' : 'Contato'}</p>

            {step === 0 && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="seu@email.com"
                    value={data.email}
                    onChange={(e) => setData({...data, email: e.target.value})}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Senha</label>
                  <input
                    type="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                    value={data.password}
                    onChange={(e) => setData({...data, password: e.target.value})}
                  />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="João Silva"
                    value={data.name}
                    onChange={(e) => setData({...data, name: e.target.value})}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select
                    className={`form-input ${errors.category ? 'error' : ''}`}
                    value={data.category}
                    onChange={(e) => setData({...data, category: e.target.value})}
                  >
                    <option>Selecione...</option>
                    <option>Arquitetura</option>
                    <option>Design</option>
                    <option>Reforma</option>
                    <option>Engenharia</option>
                  </select>
                  {errors.category && <div className="form-error">{errors.category}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Tempo de Resposta</label>
                  <select
                    className={`form-input ${errors.responseTime ? 'error' : ''}`}
                    value={data.responseTime}
                    onChange={(e) => setData({...data, responseTime: e.target.value})}
                  >
                    <option>Selecione...</option>
                    <option>Até 1 hora</option>
                    <option>Até 4 horas</option>
                    <option>Até 24 horas</option>
                  </select>
                  {errors.responseTime && <div className="form-error">{errors.responseTime}</div>}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input
                  type="text"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="(11) 99999-9999"
                  value={data.phone}
                  onChange={(e) => setData({...data, phone: e.target.value})}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
            )}

            <div className="form-actions">
              <button className="btn-back" onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}>
                ← Voltar
              </button>
              <button className="btn-next" onClick={handleNext}>
                {step === 2 ? '✅ Finalizar' : 'Próximo →'}
              </button>
            </div>
          </>
        ) : (
          <div className="success-state">
            <div className="success-icon">✨</div>
            <h3 style={{margin: 0, color: '#1f9b62'}}>Cadastro Salvo!</h3>
            <p style={{margin: '8px 0 0', color: '#a8a3b5', fontSize: 13}}>
              Seus dados foram armazenados com segurança
            </p>
          </div>
        )}
      </div>
    </>
  );
}
