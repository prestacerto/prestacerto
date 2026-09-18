'use client';
import { useState } from 'react';

export default function SearchIntegrated() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();
      setResults(data.results);
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: '#1d174f' }}>🔍 Buscar Projetos</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Ex: Redesign, App, SEO..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #ece9e4', fontSize: '14px' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px 24px', background: '#ef4b31', color: 'white', border: 0, borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            {loading ? '⏳' : '🔍 Buscar'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#1d174f' }}>Resultados ({results.length})</h3>
          {results.map((result: any) => (
            <div key={result.id} style={{ background: 'white', border: '1px solid #e5e0eb', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1d174f', marginBottom: '8px' }}>{result.title}</div>
              <div style={{ fontSize: '13px', color: '#5d5969', marginBottom: '12px' }}>
                {result.budget} • {result.category} • {result.matches}% match
              </div>
              <button style={{ padding: '8px 16px', background: '#0066ff', color: 'white', border: 0, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: '#a8a3b5', padding: '40px 20px' }}>
          Nenhum resultado encontrado para "{query}"
        </div>
      )}
    </div>
  );
}
