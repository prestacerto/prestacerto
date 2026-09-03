'use client';
import { useState, useEffect } from 'react';

export default function AdvancedCalculator() {
  const [service, setService] = useState('architecture');
  const [size, setSize] = useState(100);
  const [complexity, setComplexity] = useState('medium');
  const [urgency, setUrgency] = useState('normal');
  const [displayedPrice, setDisplayedPrice] = useState(5000);

  const services: Record<string, { name: string; basePrice: number; unit: string; icon: string }> = {
    architecture: { name: 'Arquitetura', basePrice: 5000, unit: 'm²', icon: '🏗️' },
    design: { name: 'Design de Interiores', basePrice: 3000, unit: 'm²', icon: '🎨' },
    reform: { name: 'Reforma', basePrice: 4000, unit: 'm²', icon: '🔨' },
    landscape: { name: 'Paisagismo', basePrice: 2000, unit: 'm²', icon: '🌳' },
    engineering: { name: 'Engenharia', basePrice: 6000, unit: 'm²', icon: '⚙️' },
    consulting: { name: 'Consultoria', basePrice: 200, unit: 'hora', icon: '💼' },
  };

  const multipliers = {
    complexity: { simple: 0.7, medium: 1, complex: 1.5 },
    urgency: { low: 0.9, normal: 1, high: 1.3, critical: 1.6 },
  };

  const currentService = services[service];
  const baseCalc = currentService.basePrice * (size / 100);
  const withComplexity = baseCalc * multipliers.complexity[complexity as keyof typeof multipliers.complexity];
  const finalPrice = withComplexity * multipliers.urgency[urgency as keyof typeof multipliers.urgency];

  useEffect(() => {
    let current = displayedPrice;
    const target = Math.round(finalPrice);
    if (current === target) return;

    const increment = (target - current) / 20;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        setDisplayedPrice(target);
        clearInterval(timer);
      } else {
        setDisplayedPrice(Math.round(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [finalPrice]);

  const savings = {
    complexity: baseCalc * (multipliers.complexity[complexity as keyof typeof multipliers.complexity] - 1),
    urgency: withComplexity * (multipliers.urgency[urgency as keyof typeof multipliers.urgency] - 1),
  };

  return (
    <>
      <style>{`
        .calculator-container {
          max-width: 800px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .calc-title {
          text-align: center;
          margin-bottom: 30px;
        }
        .calc-title h2 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #1d174f;
        }
        .calc-title p {
          margin: 8px 0 0;
          color: #5d5969;
          font-size: 14px;
        }
        .calc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 30px;
        }
        .calc-section {
          display: grid;
          gap: 16px;
        }
        .calc-field {
          display: grid;
          gap: 8px;
        }
        .calc-label {
          font-size: 12px;
          font-weight: 700;
          color: #5d5969;
          text-transform: uppercase;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .calc-label span:last-child {
          background: #ffe1da;
          color: #c4572f;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
        }
        .calc-field select, .calc-field input {
          border: 2px solid #ece9e4;
          border-radius: 8px;
          padding: 12px;
          font-size: 13px;
          font-family: inherit;
          transition: all 0.2s;
        }
        .calc-field select:focus, .calc-field input:focus {
          outline: 0;
          border-color: #ef4b31;
        }
        .calc-field input[type="range"] {
          cursor: pointer;
          accent-color: #ef4b31;
        }
        .range-value {
          font-size: 13px;
          font-weight: 700;
          color: #ef4b31;
        }
        .calc-result {
          background: linear-gradient(135deg, #17134c 0%, #2a245b 100%);
          color: white;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          grid-column: 1 / -1;
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .calc-result-label {
          font-size: 12px;
          color: #aaa5bf;
          margin-bottom: 8px;
        }
        .calc-result-price {
          font-size: 48px;
          font-weight: 700;
          margin: 0;
          font-variant-numeric: tabular-nums;
        }
        .calc-result-period {
          font-size: 14px;
          color: #aaa5bf;
          margin-top: 4px;
        }
        .calc-breakdown {
          background: #f9f7f3;
          border-radius: 12px;
          padding: 20px;
          grid-column: 1 / -1;
        }
        .breakdown-title {
          font-size: 13px;
          font-weight: 700;
          color: #5d5969;
          margin: 0 0 12px;
          text-transform: uppercase;
        }
        .breakdown-items {
          display: grid;
          gap: 10px;
        }
        .breakdown-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          padding: 10px;
          background: white;
          border-radius: 8px;
          font-size: 12px;
        }
        .breakdown-item .label {
          color: #5d5969;
        }
        .breakdown-item .value {
          color: #ef4b31;
          font-weight: 700;
        }
        .calc-cta {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
          grid-column: 1 / -1;
        }
        .calc-cta:hover {
          background: #d4381f;
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .calc-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="calculator-container">
        <div className="calc-title">
          <h2>💰 Calculadora de Preços</h2>
          <p>Estimativa personalizada baseada em seus parâmetros</p>
        </div>

        <div className="calc-grid">
          <div className="calc-section">
            <div className="calc-field">
              <label className="calc-label">
                {currentService.icon} Tipo de Serviço
              </label>
              <select value={service} onChange={(e) => setService(e.target.value)}>
                {Object.entries(services).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>

            <div className="calc-field">
              <label className="calc-label">
                Tamanho do Projeto
                <span>{size} {currentService.unit}</span>
              </label>
              <input 
                type="range"
                min="10"
                max="1000"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="calc-section">
            <div className="calc-field">
              <label className="calc-label">
                Complexidade
                <span>{complexity === 'simple' ? 'Simples' : complexity === 'medium' ? 'Média' : 'Alta'}</span>
              </label>
              <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
                <option value="simple">Simples (-30%)</option>
                <option value="medium">Média (padrão)</option>
                <option value="complex">Alta (+50%)</option>
              </select>
            </div>

            <div className="calc-field">
              <label className="calc-label">
                Urgência
                <span>{urgency === 'low' ? 'Baixa' : urgency === 'normal' ? 'Normal' : urgency === 'high' ? 'Alta' : 'Crítica'}</span>
              </label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                <option value="low">Baixa (-10%)</option>
                <option value="normal">Normal</option>
                <option value="high">Alta (+30%)</option>
                <option value="critical">Crítica (+60%)</option>
              </select>
            </div>
          </div>

          <div className="calc-result">
            <div className="calc-result-label">Preço Estimado</div>
            <div className="calc-result-price">
              R$ {displayedPrice.toLocaleString('pt-BR')}
            </div>
            <div className="calc-result-period">
              {service === 'consulting' ? 'por hora' : 'para o projeto'}
            </div>
          </div>

          <div className="calc-breakdown">
            <p className="breakdown-title">Detalhamento do Cálculo</p>
            <div className="breakdown-items">
              <div className="breakdown-item">
                <span className="label">Valor Base</span>
                <span className="value">R$ {Math.round(baseCalc).toLocaleString('pt-BR')}</span>
              </div>
              <div className="breakdown-item">
                <span className="label">+ Complexidade ({complexity})</span>
                <span className="value">{savings.complexity >= 0 ? '+' : ''}R$ {Math.round(savings.complexity).toLocaleString('pt-BR')}</span>
              </div>
              <div className="breakdown-item">
                <span className="label">+ Urgência ({urgency})</span>
                <span className="value">{savings.urgency >= 0 ? '+' : ''}R$ {Math.round(savings.urgency).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          <button className="calc-cta">🚀 Solicitar Cotação Completa</button>
        </div>
      </div>
    </>
  );
}
