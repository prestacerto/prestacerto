'use client';

import { useState, useEffect, useRef } from 'react';

export const dynamic = 'force-dynamic';
import { Send, Search } from 'lucide-react';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'Cliente: Tech Startup',
      content: 'Olá! Seu portfólio é impressionante, qual sua disponibilidade?',
      timestamp: '10:30',
      isOwn: false,
    },
    {
      id: '2',
      author: 'Você',
      content: 'Muito obrigado! Estou disponível a partir de segunda. Podemos conversar sobre os requisitos?',
      timestamp: '10:32',
      isOwn: true,
    },
    {
      id: '3',
      author: 'Cliente: Tech Startup',
      content: 'Perfeito! Preciso de um app React com integração Stripe. Orçamento é R$ 15k. Interessado?',
      timestamp: '10:35',
      isOwn: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        author: 'Você',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen flex gap-4 p-8 bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white rounded-lg border flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg mb-4">💬 Mensagens</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar conversa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {['Tech Startup', 'Agência Design', 'Freelancer Pedro', 'E-commerce XYZ'].map((name, i) => (
            <div
              key={i}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${i === 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
            >
              <p className="font-bold text-sm">{name}</p>
              <p className="text-xs text-gray-600 mt-1">Última mensagem há 10 min</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-lg border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Tech Startup</h3>
          <p className="text-sm text-gray-600">Online agora</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  msg.isOwn
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.isOwn ? 'text-blue-100' : 'text-gray-600'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Send size={20} /> Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
