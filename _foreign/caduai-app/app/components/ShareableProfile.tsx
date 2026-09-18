'use client';
import { useState } from 'react';

export default function ShareableProfile() {
  const [copied, setCopied] = useState(false);
  const profileUrl = 'prestacerto.com.br/perfil/joao-silva-123';

  return (
    <>
      <style>{`
        .shareable-card { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .share-title { font-size: 20px; font-weight: 700; color: #1d174f; margin: 0 0 12px; }
        .share-desc { font-size: 12px; color: #5d5969; margin: 0 0 20px; }
        .share-url { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
        .share-input { border: 2px solid #ece9e4; border-radius: 8px; padding: 12px; font-size: 12px; font-family: monospace; color: #1d174f; }
        .share-btn { background: #ef4b31; color: white; border: 0; padding: 12px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .share-options { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 20px; }
        .share-option { padding: 12px; background: #f9f7f3; border-radius: 8px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .share-option:hover { background: #ffe1da; }
        .share-option-icon { font-size: 20px; margin-bottom: 6px; }
        .share-option-text { font-size: 11px; font-weight: 700; color: #1d174f; }
      `}</style>

      <div className="shareable-card">
        <p className="share-title">🔗 Perfil Público Compartilhável</p>
        <p className="share-desc">Seu perfil único para aquisição orgânica. Compartilhe em redes sociais, portfólio ou CV.</p>
        
        <div className="share-url">
          <input type="text" className="share-input" value={profileUrl} readOnly />
          <button className="share-btn" onClick={() => { navigator.clipboard.writeText(profileUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
            {copied ? '✓' : '📋'}
          </button>
        </div>

        <div className="share-options">
          <div className="share-option">
            <div className="share-option-icon">📱</div>
            <div className="share-option-text">WhatsApp</div>
          </div>
          <div className="share-option">
            <div className="share-option-icon">💼</div>
            <div className="share-option-text">LinkedIn</div>
          </div>
          <div className="share-option">
            <div className="share-option-icon">✉️</div>
            <div className="share-option-text">Email</div>
          </div>
        </div>
      </div>
    </>
  );
}
