'use client';
import { useState } from 'react';

export default function IntegratedChat() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Fernanda', text: 'Olá! Gostei do seu portfolio.', time: '14:32', side: 'left' },
    { id: 2, from: 'Você', text: 'Obrigado! Posso ajudar com quê?', time: '14:35', side: 'right' },
    { id: 3, from: 'Fernanda', text: 'Preciso de um redesign do meu site. Você já fez algo parecido?', time: '14:36', side: 'left' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const sendMessage = () => {
    if (newMsg.trim()) {
      setMessages([...messages, { id: messages.length + 1, from: 'Você', text: newMsg, time: new Date().toLocaleTimeString().slice(0, 5), side: 'right' }]);
      setNewMsg('');
    }
  };

  return (
    <>
      <style>{`
        .chat-container { max-width: 900px; margin: 40px auto; padding: 0 40px; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(29, 23, 79, 0.08); overflow: hidden; }
        .chat-header { background: #1d174f; color: white; padding: 16px; font-weight: 700; }
        .chat-messages { height: 300px; overflow-y: auto; padding: 20px; display: grid; gap: 12px; background: #f9f7f3; }
        .chat-message { display: grid; gap: 4px; max-width: 70%; }
        .chat-message.left { justify-self: start; }
        .chat-message.right { justify-self: end; }
        .msg-text { background: #ef4b31; color: white; padding: 12px; border-radius: 12px; font-size: 12px; line-height: 1.4; }
        .chat-message.left .msg-text { background: #ece9e4; color: #1d174f; }
        .msg-time { font-size: 10px; color: #a8a3b5; padding: 0 12px; }
        .chat-footer { padding: 16px; display: grid; grid-template-columns: 1fr auto; gap: 8px; }
        .chat-input { border: 2px solid #ece9e4; border-radius: 10px; padding: 12px; font-size: 12px; font-family: inherit; }
        .chat-input:focus { outline: 0; border-color: #ef4b31; }
        .chat-send { background: #ef4b31; color: white; border: 0; padding: 12px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
      `}</style>

      <div className="chat-container">
        <div className="chat-header">💬 Conversa com Fernanda Costa</div>
        <div className="chat-messages">
          {messages.map(m => (
            <div key={m.id} className={`chat-message ${m.side}`}>
              <div className="msg-text">{m.text}</div>
              <div className="msg-time">{m.time}</div>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Digite sua mensagem..." 
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="chat-send" onClick={sendMessage}>Enviar</button>
        </div>
      </div>
    </>
  );
}
