'use client';

import { useEffect, useState, useRef } from 'react';
import { useRealtimeSubscription } from '@/lib/hooks/useRealtimeSubscription';

interface Message {
  id: string;
  proposal_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

interface RealtimeChatProps {
  proposalId: string;
  currentUserId: string;
  otherPartyName: string;
  initialMessages: Message[];
}

export function RealtimeChat({
  proposalId,
  currentUserId,
  otherPartyName,
  initialMessages,
}: RealtimeChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to realtime messages
  useRealtimeSubscription(
    'messages',
    `proposal_id=eq.${proposalId}`,
    (payload) => {
      if (payload.eventType === 'INSERT') {
        setMessages((prev) => [...prev, payload.new as Message]);
        // Send notification
        if (payload.new.sender_id !== currentUserId) {
          sendNotification(`Mensagem de ${otherPartyName}`, payload.new.content);
        }
      }
    }
  );

  // Subscribe to typing status
  useRealtimeSubscription(
    'typing_status',
    `proposal_id=eq.${proposalId}`,
    (payload) => {
      if (payload.new.user_id !== currentUserId) {
        setOtherIsTyping(payload.new.is_typing);
      }
    }
  );

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal_id: proposalId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);

    // Update typing status
    if (!isTyping) {
      setIsTyping(true);
      fetch(`/api/typing-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId, is_typing: true }),
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to mark as not typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      fetch(`/api/typing-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposal_id: proposalId, is_typing: false }),
      });
    }, 1000);
  };

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-800">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 ${
                msg.sender_id === currentUserId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`mt-1 text-xs ${
                  msg.sender_id === currentUserId
                    ? 'text-blue-100'
                    : 'text-gray-500'
                }`}
              >
                {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {otherIsTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={handleTyping}
            placeholder="Digite sua mensagem..."
            className="flex-1 resize-none rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
}
