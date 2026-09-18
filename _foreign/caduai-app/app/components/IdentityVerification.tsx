'use client';
import { useState } from 'react';

export default function IdentityVerification() {
  const [step, setStep] = useState(0);
  const [verified, setVerified] = useState(false);
  const [docType, setDocType] = useState('cpf');
  const [docNumber, setDocNumber] = useState('');

  const handleVerify = () => {
    if (docNumber.length > 5) {
      setVerified(true);
    }
  };

  return (
    <>
      <style>{`
        .verify-card { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .verify-title { font-size: 20px; font-weight: 700; color: #1d174f; margin: 0 0 8px; }
        .verify-desc { font-size: 12px; color: #5d5969; margin: 0 0 20px; }
        .verify-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .verify-tab { padding: 12px; text-align: center; background: #f5f3f0; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; transition: all 0.2s; border: 2px solid transparent; }
        .verify-tab.active { background: #ef4b31; color: white; }
        .verify-input { width: 100%; border: 2px solid #ece9e4; border-radius: 10px; padding: 14px; font-size: 13px; font-family: monospace; margin-bottom: 20px; }
        .verify-input:focus { outline: 0; border-color: #ef4b31; }
        .verify-btn { width: 100%; background: #ef4b31; color: white; border: 0; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .verify-success { background: #d5f7c7; border-left: 4px solid #1f9b62; padding: 16px; border-radius: 8px; color: #1f9b62; font-size: 12px; line-height: 1.6; }
        .verify-badge { display: inline-flex; align-items: center; gap: 6px; background: #d5f7c7; color: #1f9b62; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-top: 12px; }
        .badge-icon { font-size: 14px; }
      `}</style>

      <div className="verify-card">
        <p className="verify-title">✅ Verificação de Identidade</p>
        <p className="verify-desc">Aumenta confiança e acesso a mais oportunidades</p>

        {!verified ? (
          <>
            <div className="verify-tabs">
              <div className={`verify-tab ${docType === 'cpf' ? 'active' : ''}`} onClick={() => setDocType('cpf')}>
                CPF
              </div>
              <div className={`verify-tab ${docType === 'cnpj' ? 'active' : ''}`} onClick={() => setDocType('cnpj')}>
                CNPJ
              </div>
            </div>

            <input
              type="text"
              className="verify-input"
              placeholder={docType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
            />

            <button className="verify-btn" onClick={handleVerify}>
              Verificar {docType.toUpperCase()}
            </button>
          </>
        ) : (
          <div className="verify-success">
            ✓ Identidade verificada com sucesso!
            <div className="verify-badge">
              <span className="badge-icon">🟢</span>
              <span>Verificado</span>
            </div>
            <p style={{marginTop: 12, marginBottom: 0}}>Seu perfil agora exibe o selo de confiança. Isso aumenta a taxa de conversão em propostas.</p>
          </div>
        )}
      </div>
    </>
  );
}
