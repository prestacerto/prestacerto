'use client';
import { useState } from 'react';

export default function SearchWithRecommendations() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([
    { id: 1, name: 'João Silva', category: 'Arquitetura', distance: '2 km', responseTime: '30 min', reason: '⭐ Perto de você' },
    { id: 2, name: 'Maria Santos', category: 'Design', distance: '5 km', responseTime: '15 min', reason: '⚡ Responde rápido' },
    { id: 3, name: 'Carlos Oliveira', category: 'Reforma', distance: '8 km', responseTime: '2 horas', reason: '✅ Bom pra projetos deste tipo' },
  ]);

  return (
    <>
      <style>{`
        .search-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .search-input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .search-input-group input {
          flex: 1;
          border: 2px solid #ece9e4;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: inherit;
        }
        .search-input-group input:focus {
          outline: 0;
          border-color: #ef4b31;
        }
        .search-input-group button {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 8px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .search-input-group button:hover {
          background: #d4381f;
        }
        .search-results {
          display: grid;
          gap: 12px;
        }
        .result-card {
          background: #f9f7f3;
          border-radius: 10px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
        }
        .result-card:hover {
          border-color: #ef4b31;
          background: white;
        }
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 8px;
        }
        .result-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #1d174f;
        }
        .result-reason {
          background: #ffe1da;
          color: #c4572f;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }
        .result-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 12px;
          color: #5d5969;
        }
        .result-info-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>

      <div className="search-container">
        <div className="search-input-group">
          <input 
            type="text"
            placeholder="Busque por profissão, serviço ou localização..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>🔍 Buscar</button>
        </div>

        <div className="search-results">
          {results.map(result => (
            <div key={result.id} className="result-card">
              <div className="result-header">
                <h3>{result.name}</h3>
                <span className="result-reason">{result.reason}</span>
              </div>
              <div className="result-info">
                <div className="result-info-item">
                  <span>📍</span>
                  <span>{result.category} • {result.distance}</span>
                </div>
                <div className="result-info-item">
                  <span>⏱️</span>
                  <span>Responde em {result.responseTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
