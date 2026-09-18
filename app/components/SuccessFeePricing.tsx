'use client';
import { useState } from 'react';

export default function SuccessFeePricing() {
  const [projectValue, setProjectValue] = useState(10000);
  const [feeType, setFeeType] = useState('percentage');
  
  const percentageFee = projectValue * 0.15;
  const fixedFee = 500;
  const selectedFee = feeType === 'percentage' ? percentageFee : fixedFee;

  return (
    <>
      <style>{`
        .success-fee {
          max-width: 800px;
          margin: 40px auto;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .fee-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .fee-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #1d174f;
        }
        .fee-header p {
          margin: 8px 0 0;
          color: #5d5969;
          font-size: 13px;
        }
        .fee-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 30px;
        }
        .fee-option {
          padding: 16px;
          border: 2px solid #ece9e4;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .fee-option.active {
          border-color: #ef4b31;
          background: #ffe1da;
        }
        .fee-option h3 {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 700;
          color: #1d174f;
        }
        .fee-option p {
          margin: 0;
          font-size: 12px;
          color: #5d5969;
        }
        .fee-calculation {
          background: #f9f7f3;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .calc-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          margin-bottom: 10px;
          font-size: 13px;
        }
        .calc-row:last-child {
          margin: 0;
          padding-top: 10px;
          border-top: 2px solid #ece9e4;
          font-weight: 700;
          color: #1d174f;
          font-size: 16px;
        }
        .slider-group {
          margin-bottom: 20px;
        }
        .slider-label {
          font-size: 12px;
          font-weight: 700;
          color: #5d5969;
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .slider-input {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #ece9e4;
          outline: none;
          accent-color: #ef4b31;
          cursor: pointer;
        }
        .benefits-list {
          background: #e8f5f0;
          border-left: 4px solid #1f9b62;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .benefits-list h3 {
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 700;
          color: #1f9b62;
        }
        .benefits-list ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .benefits-list li {
          font-size: 12px;
          color: #1f9b62;
          margin-bottom: 6px;
        }
        .benefits-list li:before {
          content: '✓ ';
          font-weight: 700;
          margin-right: 4px;
        }
        .checkout-button {
          width: 100%;
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 10px;
          padding: 16px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .checkout-button:hover {
          background: #d4381f;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="success-fee">
        <div className="fee-header">
          <h1>💰 Taxa de Sucesso</h1>
          <p>Escolha a forma que funciona melhor para você</p>
        </div>

        <div className="fee-options">
          <div 
            className={`fee-option ${feeType === 'percentage' ? 'active' : ''}`}
            onClick={() => setFeeType('percentage')}
          >
            <h3>% do Projeto</h3>
            <p>15% sobre valor fechado</p>
          </div>
          <div 
            className={`fee-option ${feeType === 'fixed' ? 'active' : ''}`}
            onClick={() => setFeeType('fixed')}
          >
            <h3>Valor Fixo</h3>
            <p>R$ 500 por projeto</p>
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-label">
            <span>Valor do Projeto</span>
            <strong>R$ {projectValue.toLocaleString('pt-BR')}</strong>
          </div>
          <input 
            type="range"
            min="1000"
            max="100000"
            value={projectValue}
            onChange={(e) => setProjectValue(parseInt(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="fee-calculation">
          <div className="calc-row">
            <span>Valor do Projeto</span>
            <span>R$ {projectValue.toLocaleString('pt-BR')}</span>
          </div>
          <div className="calc-row">
            <span>{feeType === 'percentage' ? 'Taxa (15%)' : 'Taxa Fixa'}</span>
            <span style={{color: '#ef4b31'}}>-R$ {selectedFee.toLocaleString('pt-BR')}</span>
          </div>
          <div className="calc-row">
            <span>Você Recebe</span>
            <span style={{color: '#1f9b62'}}>R$ {(projectValue - selectedFee).toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div className="benefits-list">
          <h3>🎯 Por que usar Taxa de Sucesso?</h3>
          <ul>
            <li>Sem risco - só paga se o projeto fechar</li>
            <li>Alinhamento de incentivos</li>
            <li>Mais confiança para cliente</li>
            <li>Sem custo oculto</li>
          </ul>
        </div>

        <button className="checkout-button">
          💳 Prosseguir para Checkout
        </button>
      </div>
    </>
  );
}
