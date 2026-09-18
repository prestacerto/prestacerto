'use client';
import { useState } from 'react';

export default function PhotoProof() {
  const [step, setStep] = useState(0);

  return (
    <>
      <style>{`
        .proof-container { max-width: 900px; margin: 40px auto; padding: 0 40px; }
        .proof-title { font-size: 24px; font-weight: 700; color: #1d174f; margin: 0 0 20px; }
        .proof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .proof-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); text-align: center; }
        .proof-label { font-size: 12px; font-weight: 700; color: #5d5969; margin-bottom: 12px; }
        .proof-image { width: 100%; height: 180px; background: #f5f3f0; border-radius: 8px; display: grid; place-items: center; font-size: 48px; margin-bottom: 12px; }
        .proof-upload { background: #ffe1da; color: #ef4b31; border: 2px dashed #ef4b31; padding: 20px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 700; }
      `}</style>

      <div className="proof-container">
        <h2 className="proof-title">📸 Antes & Depois</h2>
        
        <div className="proof-grid">
          <div className="proof-card">
            <div className="proof-label">ANTES</div>
            <div className="proof-image">🖼️</div>
            <div className="proof-upload">+ Adicionar foto</div>
          </div>
          <div className="proof-card">
            <div className="proof-label">DEPOIS</div>
            <div className="proof-image">✨</div>
            <div className="proof-upload">+ Adicionar foto</div>
          </div>
        </div>
      </div>
    </>
  );
}
