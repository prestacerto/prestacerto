'use client';
import { useState } from 'react';

export default function VerifiedServices() {
  const [services, setServices] = useState([
    { id: 1, name: 'Verificação de Identidade', status: 'Pendente', price: 'Grátis', icon: '🆔' },
    { id: 2, name: 'Certificação Profissional', status: 'Verificado', price: 'R$ 49', icon: '📜' },
    { id: 3, name: 'Verificação de Portfólio', status: 'Disponível', price: 'R$ 79', icon: '🎨' },
    { id: 4, name: 'Verificação de Empresa', status: 'Disponível', price: 'R$ 99', icon: '🏢' },
  ]);

  return (
    <>
      <style>{`
        .verified-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .verified-title { font-size: 16px; font-weight: 700; color: #1d174f; margin: 0 0 16px; }
        .verified-grid { display: grid; gap: 12px; }
        .service-item { display: grid; grid-template-columns: 40px 1fr auto; gap: 12px; padding: 12px; background: #f9f7f3; border-radius: 8px; align-items: center; }
        .service-icon { font-size: 20px; }
        .service-info { display: grid; gap: 2px; }
        .service-name { font-size: 12px; font-weight: 700; color: #1d174f; margin: 0; }
        .service-status { font-size: 10px; color: #a8a3b5; margin: 0; }
        .service-action { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .service-price { font-size: 11px; font-weight: 700; color: #ef4b31; }
        .service-btn { padding: 6px 10px; border: 0; border-radius: 4px; font-size: 10px; font-weight: 700; cursor: pointer; }
        .service-btn.primary { background: #ef4b31; color: white; }
        .service-btn.secondary { background: #ece9e4; color: #5d5969; }
      `}</style>
      <div className="verified-card">
        <p className="verified-title">✅ Serviços Verificados</p>
        <div className="verified-grid">
          {services.map(s => (
            <div key={s.id} className="service-item">
              <span className="service-icon">{s.icon}</span>
              <div className="service-info">
                <p className="service-name">{s.name}</p>
                <p className="service-status">{s.status}</p>
              </div>
              <div className="service-action">
                <span className="service-price">{s.price}</span>
                <button className={`service-btn ${s.status === 'Verificado' ? 'secondary' : 'primary'}`}>
                  {s.status === 'Verificado' ? '✓' : 'Verificar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
