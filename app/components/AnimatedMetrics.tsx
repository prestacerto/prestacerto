'use client';
import { useEffect, useState } from 'react';

export default function AnimatedMetrics() {
  const [views, setViews] = useState(0);
  const [contacts, setContacts] = useState(0);
  const [conversions, setConversions] = useState(0);

  useEffect(() => {
    const animateNumber = (setter: Function, target: number, duration: number) => {
      let start = 0;
      const increment = target / (duration / 50);
      const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.floor(start));
        }
      }, 50);
    };

    animateNumber(setViews, 1248, 1000);
    animateNumber(setContacts, 342, 1200);
    animateNumber(setConversions, 87, 1400);
  }, []);

  return (
    <>
      <style>{`
        .metrics-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }
        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(29, 23, 79, 0.06);
          position: relative;
          overflow: hidden;
        }
        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ef4b31, #d4381f);
        }
        .metric-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .metric-label {
          font-size: 12px;
          color: #a8a3b5;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: #ef4b31;
          font-variant-numeric: tabular-nums;
        }
        .metric-change {
          font-size: 11px;
          color: #1f9b62;
          margin-top: 8px;
        }
        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(29, 23, 79, 0.06);
        }
        .chart-title {
          font-size: 16px;
          font-weight: 700;
          color: #1d174f;
          margin-bottom: 20px;
        }
        .chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
          gap: 12px;
        }
        .bar {
          flex: 1;
          background: linear-gradient(180deg, #ef4b31 0%, #d4381f 100%);
          border-radius: 8px 8px 0 0;
          position: relative;
          transition: all 0.3s ease-out;
          min-height: 20px;
        }
        .bar:hover {
          filter: brightness(1.1);
        }
        .bar-label {
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 11px;
          color: #a8a3b5;
          white-space: nowrap;
        }
        .bar-value {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: 700;
          color: #1d174f;
        }
        @media (max-width: 768px) {
          .metrics-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-icon">👁️</div>
          <div className="metric-label">Visualizações</div>
          <div className="metric-value">{views}</div>
          <div className="metric-change">↑ 12% vs. semana</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-label">Contatos</div>
          <div className="metric-value">{contacts}</div>
          <div className="metric-change">↑ 8% vs. semana</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-label">Conversões</div>
          <div className="metric-value">{conversions}</div>
          <div className="metric-change">↑ 15% vs. semana</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">📊 Desempenho por Dia (Últimos 7 dias)</div>
        <div className="chart">
          {[45, 52, 48, 78, 65, 88, 92].map((value, i) => (
            <div 
              key={i}
              className="bar"
              style={{ height: `${(value / 100) * 150}px`, animation: `slideUp 0.6s ease-out ${i * 0.1}s both` }}
            >
              <div className="bar-value">{value}</div>
              <div className="bar-label">Dia {i + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            height: 0 !important;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
