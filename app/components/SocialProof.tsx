'use client';
import { useEffect, useState } from 'react';

export default function SocialProof() {
  const [stats, setStats] = useState({ leads: 2458, users: 342, projects: 1856 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(s => ({
        leads: s.leads + Math.floor(Math.random() * 3),
        users: s.users + (Math.random() > 0.7 ? 1 : 0),
        projects: s.projects + Math.floor(Math.random() * 2),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        .social-proof {
          position: fixed;
          bottom: 24px;
          left: 24px;
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.12);
          font-size: 12px;
          max-width: 220px;
          z-index: 30;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .social-proof-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color: #333;
        }
        .social-proof-item:last-child {
          margin: 0;
        }
        .social-proof-item strong {
          color: #ef4b31;
          font-weight: 700;
        }
        .social-proof-icon {
          font-size: 16px;
        }
        @media (max-width: 640px) {
          .social-proof {
            left: 12px;
            right: 12px;
            bottom: 100px;
            max-width: none;
          }
        }
      `}</style>

      <div className="social-proof">
        <div className="social-proof-item">
          <span className="social-proof-icon">📊</span>
          <span><strong>{stats.leads.toLocaleString('pt-BR')}</strong> leads enviados</span>
        </div>
        <div className="social-proof-item">
          <span className="social-proof-icon">👥</span>
          <span><strong>{stats.users}</strong> usuários ativos</span>
        </div>
        <div className="social-proof-item">
          <span className="social-proof-icon">🎯</span>
          <span><strong>{stats.projects.toLocaleString('pt-BR')}</strong> projetos</span>
        </div>
      </div>
    </>
  );
}
