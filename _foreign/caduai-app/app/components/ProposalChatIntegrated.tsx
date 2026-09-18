'use client';
import { useState, useEffect } from 'react';

export default function ProposalChatIntegrated({ projectId }: { projectId?: string }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetch(`/api/chat?projectId=${projectId}`)
        .then(r => r.json())
        .then(d => setMessages(d.messages));
    }
  }, [projectId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, message: input })
      });
      setInput('');
      setMessages([...messages, { id: `msg_${Date.now()}`, from: 'Você', message: input, timestamp: 'agora' }]);
    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', background: 'white', borderRadius: '12px', border: '1px solid #e5e0eb', overflow: 'hidden' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e0eb', fontWeight: 700, fontSize: '14px', color: '#1d174f' }}>💬 Chat com Prestador</div>

      <div style={{ height: '300px', padding: '16px', overflowY: 'auto', background: '#f9f8f7' }}>
        {messages.map((msg: any) => (
          <div key={msg.id} style={{ marginBottom: '12px', textAlign: msg.from === 'Você' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: msg.from === 'Você' ? '#ef4b31' : '#e5e0eb',
              color: msg.from === 'Você' ? 'white' : '#1d174f',
              fontSize: '13px'
            }}>
              {msg.message}
            </div>
            <div style={{ fontSize: '11px', color: '#a8a3b5', marginTop: '4px' }}>{msg.timestamp}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ padding: '16px', borderTop: '1px solid #e5e0eb', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Escreva sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ece9e4', fontSize: '13px' }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 16px', background: '#ef4b31', color: 'white', border: 0, borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
        >
          {loading ? '...' : '📤'}
        </button>
      </form>
    </div>
  );
}
