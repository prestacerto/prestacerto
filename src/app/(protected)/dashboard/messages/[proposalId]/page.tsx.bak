'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RealtimeChat } from '@/components/chat/RealtimeChat';

interface Message {
  id: string;
  proposal_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ProposalMessagesPageProps {
  params: Promise<{ proposalId: string }>;
}

export default function ProposalMessagesPage({ params }: ProposalMessagesPageProps) {
  const [proposalId, setProposalId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [otherPartyName, setOtherPartyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { proposalId: id } = await params;
      setProposalId(id);

      // Fetch initial messages
      const res = await fetch(`/api/messages?proposal_id=${id}`);
      const data = await res.json();
      setMessages(data.messages || []);

      // Get current user
      const userRes = await fetch('/api/auth/user');
      const userData = await userRes.json();
      setCurrentUserId(userData.user?.id || '');
      setOtherPartyName('outro usuário');

      setLoading(false);
    })();
  }, [params]);

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="flex flex-col h-screen">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 p-4"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <RealtimeChat
        proposalId={proposalId}
        currentUserId={currentUserId}
        otherPartyName={otherPartyName}
        initialMessages={messages}
      />
    </div>
  );
}
