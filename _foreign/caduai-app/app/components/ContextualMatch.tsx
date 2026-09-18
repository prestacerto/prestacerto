'use client';
import { useState } from 'react';

export default function ContextualMatch() {
  const [filters, setFilters] = useState({ category: '', city: '', budget: '', deadline: '' });
  const [matches] = useState([
    { id: 1, name: 'João Silva', category: 'Arquitetura', city: 'SP', rating: 4.9, match: '98%' },
    { id: 2, name: 'Maria Santos', category: 'Design', city: 'RJ', rating: 4.8, match: '95%' },
    { id: 3, name: 'Carlos Oliveira', category: 'Reforma', city: 'MG', rating: 4.7, match: '92%' },
  ]);

  return (
    <>
      <style>{`
        .match-container { max-width: 900px; margin: 40px auto; padding: 0 40px; }
        .match-filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .match-filter { border: 2px solid #ece9e4; border-radius: 8px; padding: 10px; font-size: 12px; font-family: inherit; }
        .match-results { display: grid; gap: 12px; }
        .match-card { background: white; border-radius: 12px; padding: 16px; display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .match-info { display: grid; gap: 4px; }
        .match-name { font-size: 13px; font-weight: 700; color: #1d174f; margin: 0; }
        .match-meta { font-size: 11px; color: #a8a3b5; }
        .match-score { background: #ffe1da; color: #ef4b31; padding: 8px 12px; border-radius: 8px; text-align: center; font-weight: 700; min-width: 60px; }
      `}</style>

      <div className="match-container">
        <h2 style={{margin: '0 0 20px', fontSize: 24, fontWeight: 700, color: '#1d174f'}}>🎯 Match Contextual</h2>
        
        <div className="match-filters">
          <select className="match-filter" onChange={(e) => setFilters({...filters, category: e.target.value})}>
            <option>Categoria</option>
            <option>Arquitetura</option>
            <option>Design</option>
            <option>Reforma</option>
          </select>
          <select className="match-filter" onChange={(e) => setFilters({...filters, city: e.target.value})}>
            <option>Cidade</option>
            <option>São Paulo</option>
            <option>Rio de Janeiro</option>
            <option>Minas Gerais</option>
          </select>
          <select className="match-filter" onChange={(e) => setFilters({...filters, budget: e.target.value})}>
            <option>Orçamento</option>
            <option>Até R$ 5k</option>
            <option>R$ 5k - R$ 20k</option>
            <option>Acima de R$ 20k</option>
          </select>
          <select className="match-filter" onChange={(e) => setFilters({...filters, deadline: e.target.value})}>
            <option>Prazo</option>
            <option>Urgente (até 1 semana)</option>
            <option>Normal (2-4 semanas)</option>
            <option>Sem pressa</option>
          </select>
        </div>

        <div className="match-results">
          {matches.map(m => (
            <div key={m.id} className="match-card">
              <div className="match-info">
                <p className="match-name">{m.name}</p>
                <p className="match-meta">⭐ {m.rating} • {m.category} • {m.city}</p>
              </div>
              <div className="match-score">{m.match}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
