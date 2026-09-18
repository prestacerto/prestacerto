'use client';
import { useState } from 'react';

export default function SavedCollections() {
  const [collections] = useState([
    { name: 'Designers Premium', count: 12, color: '#ffe1da' },
    { name: 'Dev Fullstack', count: 8, color: '#d5f7c7' },
    { name: 'Consultores', count: 5, color: '#fef3c7' },
  ]);

  return (
    <>
      <style>{`
        .collections-container { max-width: 900px; margin: 40px auto; padding: 0 40px; }
        .collections-title { font-size: 24px; font-weight: 700; color: #1d174f; margin: 0 0 20px; }
        .collections-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .collection-card { padding: 20px; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .collection-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
        .collection-name { font-size: 14px; font-weight: 700; color: #1d174f; margin: 0; }
        .collection-count { font-size: 12px; color: #5d5969; margin: 6px 0 0; }
      `}</style>

      <div className="collections-container">
        <h2 className="collections-title">⭐ Coleções & Favoritos</h2>
        
        <div className="collections-grid">
          {collections.map((c, i) => (
            <div key={i} className="collection-card" style={{background: c.color}}>
              <p className="collection-name">{c.name}</p>
              <p className="collection-count">{c.count} prestadores</p>
            </div>
          ))}
          <div className="collection-card" style={{background: '#f5f3f0', display: 'grid', placeItems: 'center'}}>
            <p style={{fontSize: 24, margin: 0}}>➕</p>
            <p className="collection-name">Nova Coleção</p>
          </div>
        </div>
      </div>
    </>
  );
}
