'use client';
import { useEffect, useState } from 'react';

type UserStage = 'new' | 'profile-incomplete' | 'profile-complete' | 'can-publish' | 'active';

export default function ContextualCTA() {
  const [stage, setStage] = useState<UserStage>('new');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Simula progresso do usuário
    const timer = setTimeout(() => setStage('profile-incomplete'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const ctas: Record<UserStage, { text: string; subtext: string; action: string; icon: string; color: string }> = {
    new: {
      text: 'Complete seu perfil',
      subtext: 'Adicione foto e bio para aparecer nos resultados',
      action: 'Começar agora',
      icon: '📸',
      color: '#ef4b31'
    },
    'profile-incomplete': {
      text: 'Você está quase pronto!',
      subtext: 'Faltam apenas seu portfólio e serviços',
      action: 'Adicionar portfólio',
      icon: '✨',
      color: '#1f9b62'
    },
    'profile-complete': {
      text: 'Pronto para receber projetos?',
      subtext: 'Ative sua disponibilidade e comece a receber propostas',
      action: 'Ativar agora',
      icon: '🎯',
      color: '#6366f1'
    },
    'can-publish': {
      text: 'Publique seu primeiro projeto',
      subtext: 'Ganhe visibilidade e atraia os melhores prestadores',
      action: 'Publicar projeto',
      icon: '🚀',
      color: '#f59e0b'
    },
    active: {
      text: 'Você está ativo!',
      subtext: 'Confira as novas propostas e oportunidades',
      action: 'Ver propostas',
      icon: '💼',
      color: '#1f9b62'
    }
  };

  const cta = ctas[stage];

  if (dismissed) return null;

  return (
    <>
      <style>{`
        .contextual-cta {
          position: fixed;
          bottom: 24px;
          left: 24px;
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 8px 24px rgba(29, 23, 79, 0.12);
          max-width: 280px;
          z-index: 35;
          animation: slideUp 0.4s ease-out;
          border-left: 4px solid ${cta.color};
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .contextual-cta-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .contextual-cta-title {
          font-size: 13px;
          font-weight: 700;
          color: #1d174f;
          margin: 0 0 4px;
        }
        .contextual-cta-subtitle {
          font-size: 11px;
          color: #a8a3b5;
          margin: 0 0 12px;
          line-height: 1.4;
        }
        .contextual-cta-button {
          width: 100%;
          background: ${cta.color};
          color: white;
          border: 0;
          border-radius: 6px;
          padding: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
        }
        .contextual-cta-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .contextual-cta-close {
          width: 100%;
          background: transparent;
          border: 1px solid #ece9e4;
          color: #a8a3b5;
          border-radius: 6px;
          padding: 8px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .contextual-cta-close:hover {
          border-color: #d7d2ca;
          background: #f9f7f3;
        }
        @media (max-width: 640px) {
          .contextual-cta {
            left: 12px;
            right: 12px;
            max-width: none;
          }
        }
      `}</style>

      <div className="contextual-cta">
        <div className="contextual-cta-icon">{cta.icon}</div>
        <p className="contextual-cta-title">{cta.text}</p>
        <p className="contextual-cta-subtitle">{cta.subtext}</p>
        <button className="contextual-cta-button">{cta.action}</button>
        <button className="contextual-cta-close" onClick={() => setDismissed(true)}>
          Depois
        </button>
      </div>
    </>
  );
}
