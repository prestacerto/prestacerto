'use client';
import { useState } from 'react';

export default function TeamManagement() {
  const [members, setMembers] = useState([
    { id: 1, name: 'João Silva', role: 'Admin', status: 'Ativo' },
    { id: 2, name: 'Maria Santos', role: 'Editor', status: 'Ativo' },
  ]);

  return (
    <>
      <style>{`
        .team-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); }
        .team-title { font-size: 16px; font-weight: 700; color: #1d174f; margin: 0 0 16px; }
        .team-list { display: grid; gap: 12px; }
        .team-item { display: grid; grid-template-columns: 1fr auto; gap: 12px; padding: 12px; background: #f9f7f3; border-radius: 8px; align-items: center; }
        .team-info { display: grid; gap: 4px; }
        .team-name { font-size: 13px; font-weight: 700; color: #1d174f; margin: 0; }
        .team-role { font-size: 11px; color: #a8a3b5; margin: 0; }
        .team-status { font-size: 11px; font-weight: 700; background: #d5f7c7; color: #1f9b62; padding: 4px 8px; border-radius: 4px; }
        .team-actions { display: flex; gap: 8px; }
        .team-btn { width: 32px; height: 32px; border: 1px solid #ece9e4; background: white; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .team-add { width: 100%; padding: 12px; background: #ef4b31; color: white; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 12px; }
      `}</style>
      <div className="team-card">
        <p className="team-title">👥 Equipe Pro (até 5 usuários)</p>
        <div className="team-list">
          {members.map(m => (
            <div key={m.id} className="team-item">
              <div className="team-info">
                <p className="team-name">{m.name}</p>
                <p className="team-role">{m.role}</p>
              </div>
              <span className="team-status">{m.status}</span>
              <div className="team-actions">
                <button className="team-btn">✏️</button>
                <button className="team-btn">🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <button className="team-add">+ Adicionar Membro</button>
      </div>
    </>
  );
}
