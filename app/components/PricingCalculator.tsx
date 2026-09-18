'use client';
import { useState } from 'react';

export default function PricingCalculator() {
  const [service, setService] = useState('design');
  const [complexity, setComplexity] = useState('standard');
  const [budget, setBudget] = useState(3000);

  const prices: Record<string, Record<string, number>> = {
    design: { simple: 1500, standard: 3000, complex: 7500 },
    development: { simple: 3000, standard: 8000, complex: 20000 },
    marketing: { simple: 1000, standard: 3000, complex: 10000 },
  };

  const currentPrice = prices[service][complexity];

  return (
    <>
      <style>{`
        .calculator { background: linear-gradient(180deg, #0a0820 0%, #1d174f 100%); padding: 80px 40px; }
        @media (max-width: 768px) { .calculator { padding: 40px 24px; } }
        
        .calculator-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
        @media (max-width: 768px) { .calculator-container { grid-template-columns: 1fr; gap: 40px; } }
        
        .calc-content { display: grid; gap: 32px; }
        .calc-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #ccff00; text-transform: uppercase; margin: 0; }
        .calc-title { font-size: 44px; font-weight: 900; color: white; margin: 0; line-height: 1.2; }
        .calc-desc { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.7); margin: 0; }
        
        .calc-cta { margin-top: 24px; }
        .btn-calc { background: #ccff00; color: #1d174f; border: 0; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.3s; }
        .btn-calc:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(204, 255, 0, 0.3); }
        
        .calculator-box { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; display: grid; gap: 24px; }
        
        .calc-field-label { font-size: 12px; font-weight: 700; color: #ccff00; text-transform: uppercase; display: block; margin-bottom: 8px; }
        
        .calc-select { width: 100%; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px; border-radius: 8px; font-size: 14px; cursor: pointer; }
        .calc-select:focus { outline: 0; border-color: #ccff00; }
        .calc-select option { background: #1d174f; color: white; }
        
        .calc-result { background: rgba(204, 255, 0, 0.1); border: 2px solid #ccff00; border-radius: 12px; padding: 24px; display: grid; gap: 8px; }
        .calc-result-label { font-size: 12px; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; }
        .calc-result-value { font-size: 48px; font-weight: 900; color: #ccff00; }
        .calc-result-desc { font-size: 12px; color: rgba(255, 255, 255, 0.6); margin-top: 12px; }
      `}</style>

      <section className="calculator">
        <div className="calculator-container">
          <div className="calc-content">
            <p className="calc-label">Ferramenta gratuita</p>
            <h2 className="calc-title">A calculadora não é extra. É porta de entrada.</h2>
            <p className="calc-desc">Para muita gente, o primeiro passo é descrever quanto cobrar, quanto investir ou como organizar o próximo orçamento.</p>
            <div className="calc-cta">
              <button className="btn-calc">Ver calculadora completa →</button>
            </div>
          </div>

          <div className="calculator-box">
            <div>
              <label className="calc-field-label">Tipo de serviço</label>
              <select className="calc-select" value={service} onChange={(e) => setService(e.target.value)}>
                <option value="design">Design e identidade visual</option>
                <option value="development">Desenvolvimento Web</option>
                <option value="marketing">Marketing e estratégia</option>
              </select>
            </div>

            <div>
              <label className="calc-field-label">Nível de complexidade</label>
              <select className="calc-select" value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                <option value="simple">Projeto padrão</option>
                <option value="standard">Projeto robusto</option>
                <option value="complex">Projeto enterprise</option>
              </select>
            </div>

            <div className="calc-result">
              <div className="calc-result-label">Preço mínimo estimado/hora</div>
              <div className="calc-result-value">R$ {(currentPrice / 40).toFixed(0)}</div>
              <div className="calc-result-label">Projeto 40h</div>
              <div className="calc-result-value" style={{fontSize: '32px'}}>R$ {currentPrice.toLocaleString('pt-BR')}</div>
              <div className="calc-result-desc">O cálculo é uma estimativa orientadora e não substitui orientação confiável.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
