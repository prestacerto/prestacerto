'use client';
import { useState } from 'react';

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const whatsappNumber = '5513988251275';
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de conhecer mais sobre a Prestacerto.');

  return (
    <>
      <style>{`
        .whatsapp-widget {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 40;
        }
        .whatsapp-bubble {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #20c966 0%, #1a9d54 100%);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: white;
          font-size: 28px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(32, 201, 102, 0.3);
          transition: all 0.2s;
        }
        .whatsapp-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(32, 201, 102, 0.4);
        }
        .whatsapp-menu {
          position: absolute;
          bottom: 80px;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          min-width: 280px;
        }
        .whatsapp-header {
          background: #20c966;
          color: white;
          padding: 16px;
          font-weight: 700;
          font-size: 14px;
        }
        .whatsapp-option {
          padding: 14px 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          font-size: 13px;
          color: #333;
          transition: background 0.2s;
        }
        .whatsapp-option:hover {
          background: #f5f5f5;
        }
        .whatsapp-option:last-child {
          border: 0;
        }
        .whatsapp-option strong {
          display: block;
          color: #20c966;
          margin-bottom: 4px;
        }
      `}</style>

      <div className="whatsapp-widget">
        {open && (
          <div className="whatsapp-menu">
            <div className="whatsapp-header">Como podemos ajudar?</div>
            <div 
              className="whatsapp-option"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')}
            >
              <strong>💬 Dúvida Geral</strong>
              Fale com nosso time
            </div>
            <div 
              className="whatsapp-option"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Gostaria de uma demonstração da plataforma.')}`, '_blank')}
            >
              <strong>🎬 Demo</strong>
              Ver como funciona
            </div>
            <div 
              className="whatsapp-option"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Qual é o melhor plano para mim?')}`, '_blank')}
            >
              <strong>💰 Planos</strong>
              Escolher meu plano
            </div>
          </div>
        )}
        <div 
          className="whatsapp-bubble"
          onClick={() => setOpen(!open)}
        >
          💬
        </div>
      </div>
    </>
  );
}
