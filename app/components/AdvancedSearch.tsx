'use client';
import { useState } from 'react';

export default function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    distance: 10,
    responseTime: 'any',
    minRating: 4,
    priceRange: [1000, 50000],
  });
  const [showFilters, setShowFilters] = useState(false);

  const results = [
    { id: 1, name: 'João Silva', rating: 4.9, responseTime: '30 min', price: 5000, distance: 2 },
    { id: 2, name: 'Maria Santos', rating: 4.8, responseTime: '15 min', price: 4500, distance: 5 },
    { id: 3, name: 'Carlos Oliveira', rating: 4.7, responseTime: '2h', price: 6000, distance: 8 },
  ];

  return (
    <>
      <style>{`
        .search-advanced {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px;
        }
        .search-bar-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
          padding: 0;
          overflow: hidden;
        }
        .search-input-wrapper {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 0;
          padding: 12px;
          align-items: center;
        }
        .search-input-wrapper input {
          border: 0;
          padding: 14px 16px;
          font-size: 14px;
          font-family: inherit;
        }
        .search-input-wrapper input:focus {
          outline: 0;
        }
        .search-actions {
          display: flex;
          gap: 8px;
          padding: 12px;
        }
        .search-actions button {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .search-actions button:hover {
          background: #f5f3f0;
        }
        .filter-button {
          background: #ef4b31;
          color: white;
        }
        .filter-button:hover {
          background: #d4381f;
        }
        .filters-panel {
          background: #f9f7f3;
          border-top: 1px solid #ece9e4;
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .filter-group {
          display: grid;
          gap: 8px;
        }
        .filter-group label {
          font-size: 12px;
          font-weight: 700;
          color: #5d5969;
          text-transform: uppercase;
        }
        .filter-group select, .filter-group input {
          border: 1px solid #d7d2ca;
          border-radius: 6px;
          padding: 8px;
          font-size: 12px;
          font-family: inherit;
        }
        .filter-group input[type="range"] {
          cursor: pointer;
        }
        .sort-results {
          display: flex;
          gap: 8px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        .sort-btn {
          background: #f5f3f0;
          border: 1px solid #ece9e4;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .sort-btn.active {
          background: #ef4b31;
          color: white;
          border-color: #ef4b31;
        }
        .results-grid {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }
        .result-item {
          background: white;
          border-radius: 10px;
          padding: 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          border: 2px solid transparent;
          transition: all 0.2s;
          cursor: pointer;
        }
        .result-item:hover {
          border-color: #ef4b31;
          box-shadow: 0 4px 12px rgba(239, 75, 49, 0.15);
        }
        .result-info {
          display: grid;
          gap: 6px;
        }
        .result-name {
          font-size: 14px;
          font-weight: 700;
          color: #1d174f;
          margin: 0;
        }
        .result-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #a8a3b5;
        }
        .result-actions {
          display: flex;
          gap: 8px;
        }
        .result-btn {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .result-btn:hover {
          background: #d4381f;
        }
      `}</style>

      <div className="search-advanced">
        <div className="search-bar-section">
          <div className="search-input-wrapper">
            <input 
              type="text"
              placeholder="🔍 Busque por profissão, serviço ou localização..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-actions">
              <button>📍</button>
              <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
                ⚙️ Filtros
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Distância (km)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={filters.distance}
                  onChange={(e) => setFilters({...filters, distance: parseInt(e.target.value)})}
                />
                <small>{filters.distance} km</small>
              </div>

              <div className="filter-group">
                <label>Tempo de Resposta</label>
                <select value={filters.responseTime} onChange={(e) => setFilters({...filters, responseTime: e.target.value})}>
                  <option value="any">Qualquer um</option>
                  <option value="1hour">Até 1 hora</option>
                  <option value="4hours">Até 4 horas</option>
                  <option value="24hours">Até 24 horas</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Avaliação Mínima</label>
                <select value={filters.minRating} onChange={(e) => setFilters({...filters, minRating: parseInt(e.target.value)})}>
                  <option value={3}>⭐ 3+</option>
                  <option value={4}>⭐ 4+</option>
                  <option value={4.5}>⭐ 4.5+</option>
                  <option value={5}>⭐ 5</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Faixa de Preço</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100000" 
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                />
                <small>Até R$ {filters.priceRange[1].toLocaleString('pt-BR')}</small>
              </div>
            </div>
          )}
        </div>

        <div className="sort-results">
          <span style={{color: '#a8a3b5', fontSize: 12, fontWeight: 600}}>Ordenar por:</span>
          <button className={`sort-btn ${sortBy === 'relevance' ? 'active' : ''}`} onClick={() => setSortBy('relevance')}>
            🎯 Relevância
          </button>
          <button className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`} onClick={() => setSortBy('price')}>
            💰 Menor Preço
          </button>
          <button className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => setSortBy('rating')}>
            ⭐ Melhor Avaliação
          </button>
          <button className={`sort-btn ${sortBy === 'distance' ? 'active' : ''}`} onClick={() => setSortBy('distance')}>
            📍 Mais Perto
          </button>
        </div>

        <div className="results-grid">
          {results.map(result => (
            <div key={result.id} className="result-item">
              <div className="result-info">
                <p className="result-name">{result.name}</p>
                <div className="result-meta">
                  <span>⭐ {result.rating} (127 avaliações)</span>
                  <span>⏱️ {result.responseTime}</span>
                  <span>📍 {result.distance} km</span>
                  <span>💰 R$ {result.price.toLocaleString('pt-BR')}</span>
                </div>
              </div>
              <div className="result-actions">
                <button className="result-btn">Ver Perfil</button>
                <button className="result-btn" style={{background: '#1f9b62'}}>Enviar Proposta</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
