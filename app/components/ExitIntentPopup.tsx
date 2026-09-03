'use client';
import { useState, useEffect } from 'react';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dismissed]);

  if (dismissed || !show) return null;

  return (
    <>
      <style>{`
        .exit-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: grid;
          place-items: center;
          z-index: 100;
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .exit-popup {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 480px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .exit-popup h2 {
          margin: 0 0 12px;
          font-size: 28px;
          color: #1d174f;
          font-weight: 700;
        }
        .exit-popup p {
          margin: 0 0 8px;
          color: #5d5969;
          font-size: 15px;
          line-height: 1.5;
        }
        .exit-offer {
          background: linear-gradient(135deg, #ffe1da 0%, #ffd3ca 100%);
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          border: 2px solid #ef4b31;
        }
        .exit-offer strong {
          display: block;
          color: #ef4b31;
          font-size: 24px;
          margin-bottom: 6px;
        }
        .exit-offer small {
          color: #c4572f;
          font-size: 12px;
        }
        .exit-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .exit-actions button {
          flex: 1;
          border: 0;
          border-radius: 8px;
          padding: 14px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .exit-actions .secondary {
          background: #f5f3f0;
          color: #5d5969;
        }
        .exit-actions .secondary:hover {
          background: #ece9e4;
        }
        .exit-actions .primary {
          background: #ef4b31;
          color: white;
        }
        .exit-actions .primary:hover {
          background: #d4381f;
        }
      `}</style>

      <div className="exit-overlay" onClick={() => setDismissed(true)}>
        <div className="exit-popup" onClick={e => e.stopPropagation()}>
          <h2>Espera aí! 🛑</h2>
          <p>Ganhe <strong>20% de desconto</strong> em qualquer plano</p>
          
          <div className="exit-offer">
            <strong>-20% OFF</strong>
            <small>Válido por 30 dias • Cancelável a qualquer momento</small>
          </div>

          <p style={{ fontSize: '12px', color: '#a8a3b5' }}>
            Junte-se a 342 prestadores que já economizam com a gente
          </p>

          <div className="exit-actions">
            <button className="secondary" onClick={() => setDismissed(true)}>
              Não, obrigado
            </button>
            <button className="primary" onClick={() => {
              window.location.href = '/dashboard';
            }}>
              Aproveitar Desconto ✨
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
