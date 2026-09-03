'use client';
import { useState } from 'react';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'proposal', text: 'Nova proposta de João Silva para "Reforma Cozinha"', time: 'há 2 min', read: false },
    { id: 2, type: 'search', text: 'Sua busca por "arquitetura residencial" recebeu 5 novos resultados', time: 'há 15 min', read: false },
    { id: 3, type: 'message', text: 'Maria Santos enviou uma mensagem', time: 'há 1 hora', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleClear = () => {
    setNotifications([]);
  };

  return (
    <>
      <style>{`
        .notification-bell {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 45;
        }
        .bell-button {
          width: 48px;
          height: 48px;
          background: white;
          border: 2px solid #ece9e4;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .bell-button:hover {
          border-color: #ef4b31;
          transform: scale(1.05);
        }
        .bell-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4b31;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 11px;
          font-weight: 700;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .notification-panel {
          position: absolute;
          top: 60px;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(29, 23, 79, 0.15);
          width: 340px;
          max-height: 420px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .notification-header {
          padding: 16px;
          border-bottom: 1px solid #ece9e4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9f7f3;
        }
        .notification-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #1d174f;
        }
        .notification-header button {
          background: transparent;
          border: 0;
          color: #ef4b31;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .notification-list {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }
        .notification-item {
          padding: 14px 16px;
          border-bottom: 1px solid #ece9e4;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          border: 0;
          width: 100%;
          text-align: left;
        }
        .notification-item:hover {
          background: #f9f7f3;
        }
        .notification-item.unread {
          background: #ffe1da;
        }
        .notification-item.unread::before {
          content: '';
          width: 8px;
          height: 8px;
          background: #ef4b31;
          border-radius: 50%;
          margin-right: 8px;
          display: inline-block;
        }
        .notification-icon {
          font-size: 16px;
          margin-right: 8px;
        }
        .notification-item p {
          margin: 0;
          font-size: 12px;
          color: #333;
          font-weight: 500;
        }
        .notification-item small {
          display: block;
          color: #a8a3b5;
          font-size: 10px;
          margin-top: 4px;
        }
        .notification-empty {
          padding: 40px 16px;
          text-align: center;
          color: #a8a3b5;
          font-size: 12px;
        }
        @media (max-width: 640px) {
          .notification-panel {
            width: 90vw;
            left: 5vw;
            right: auto;
          }
        }
      `}</style>

      <div className="notification-bell">
        <button 
          className="bell-button"
          onClick={() => setOpen(!open)}
        >
          🔔
          {unreadCount > 0 && <div className="bell-badge">{unreadCount}</div>}
        </button>

        {open && (
          <div className="notification-panel" onClick={e => e.stopPropagation()}>
            <div className="notification-header">
              <h3>Notificações</h3>
              {notifications.length > 0 && (
                <button onClick={handleClear}>Limpar Tudo</button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">
                  ✨ Nenhuma notificação no momento
                </div>
              ) : (
                notifications.map(notif => (
                  <button
                    key={notif.id}
                    className={`notification-item ${!notif.read ? 'unread' : ''}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <span className="notification-icon">
                      {notif.type === 'proposal' && '📋'}
                      {notif.type === 'search' && '🔍'}
                      {notif.type === 'message' && '💬'}
                    </span>
                    <p>{notif.text}</p>
                    <small>{notif.time}</small>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {open && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 44
          }}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
