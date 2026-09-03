'use client';
import { useState } from 'react';

const BLOCKED_KEYWORDS = ['pix', 'transferência', 'boleto', 'pagamento', 'deposito', 'cartão', 'débito', 'crédito', 'valor', 'preço', 'transferir', 'pagar'];

export default function ProposalChat() {
  const [proposals, setProposals] = useState([
    { id: 1, client: 'João Silva', project: 'Reforma Cozinha', status: 'pending', messages: 2 },
    { id: 2, client: 'Maria Santos', project: 'Pintura Casa', status: 'accepted', messages: 5 },
  ]);
  
  const [activeProposal, setActiveProposal] = useState(proposals[0].id);
  const [messages, setMessages] = useState([
    { id: 1, from: 'client', text: 'Olá! Tudo bem? Gostaria de saber mais sobre seus serviços.' },
    { id: 2, from: 'me', text: 'Oi! Tudo bem! Claro, como posso ajudar?' },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [blocked, setBlocked] = useState(false);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const lowerMsg = messageInput.toLowerCase();
    const hasBlockedWord = BLOCKED_KEYWORDS.some(word => lowerMsg.includes(word));

    if (hasBlockedWord) {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 3000);
      return;
    }

    setMessages([
      ...messages,
      { id: Date.now(), from: 'me', text: messageInput }
    ]);
    setMessageInput('');
  };

  const currentProposal = proposals.find(p => p.id === activeProposal);

  return (
    <>
      <style>{`
        .proposal-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 16px;
          height: 600px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08);
        }
        .proposal-list {
          background: #f9f7f3;
          border-right: 1px solid #ece9e4;
          overflow-y: auto;
          padding: 0;
        }
        .proposal-item {
          padding: 14px;
          border-bottom: 1px solid #ece9e4;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          border: 0;
          width: 100%;
          text-align: left;
        }
        .proposal-item:hover {
          background: #f0ebe5;
        }
        .proposal-item.active {
          background: #ef4b31;
          color: white;
        }
        .proposal-item strong {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
        }
        .proposal-item small {
          display: block;
          font-size: 11px;
          opacity: 0.7;
          margin-bottom: 6px;
        }
        .proposal-badge {
          display: inline-block;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.2);
        }
        .chat-area {
          display: flex;
          flex-direction: column;
          background: white;
        }
        .chat-header {
          padding: 16px;
          border-bottom: 1px solid #ece9e4;
          background: white;
        }
        .chat-header h3 {
          margin: 0;
          font-size: 14px;
          color: #1d174f;
        }
        .chat-header p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #a8a3b5;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .message {
          display: flex;
          gap: 8px;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .message.from-me {
          justify-content: flex-end;
        }
        .message-bubble {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 12px;
          line-height: 1.4;
        }
        .message.from-client .message-bubble {
          background: #f0ebe5;
          color: #333;
        }
        .message.from-me .message-bubble {
          background: #ef4b31;
          color: white;
        }
        .chat-input-area {
          padding: 14px;
          border-top: 1px solid #ece9e4;
          display: flex;
          gap: 8px;
        }
        .chat-input {
          flex: 1;
          border: 1px solid #d7d2ca;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12px;
          font-family: inherit;
        }
        .chat-input:focus {
          outline: 0;
          border-color: #ef4b31;
        }
        .chat-send {
          background: #ef4b31;
          color: white;
          border: 0;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }
        .chat-send:hover {
          background: #d4381f;
        }
        .blocked-warning {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff6b6b;
          color: white;
          padding: 14px 20px;
          border-radius: 8px;
          animation: slideDown 0.3s ease-out;
          z-index: 50;
        }
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .proposal-container {
            grid-template-columns: 1fr;
            height: auto;
            max-height: 500px;
          }
          .proposal-list {
            border-right: 0;
            border-bottom: 1px solid #ece9e4;
            max-height: 120px;
          }
        }
      `}</style>

      {blocked && (
        <div className="blocked-warning">
          ⚠️ Negociação de pagamento deve ser feita apenas dentro da plataforma!
        </div>
      )}

      <div className="proposal-container">
        <div className="proposal-list">
          {proposals.map(proposal => (
            <button
              key={proposal.id}
              className={`proposal-item ${proposal.id === activeProposal ? 'active' : ''}`}
              onClick={() => setActiveProposal(proposal.id)}
            >
              <strong>{proposal.client}</strong>
              <small>{proposal.project}</small>
              <span className="proposal-badge">
                {proposal.status === 'pending' ? '🔄 Pendente' : '✅ Aceita'}
              </span>
            </button>
          ))}
        </div>

        <div className="chat-area">
          <div className="chat-header">
            <h3>{currentProposal?.client}</h3>
            <p>Projeto: {currentProposal?.project}</p>
          </div>

          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message from-${msg.from}`}>
                <div className="message-bubble">{msg.text}</div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Digite sua mensagem..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="chat-send" onClick={handleSendMessage}>
              ✈️
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
