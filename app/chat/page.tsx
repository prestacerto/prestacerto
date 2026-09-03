'use client';
import ProposalChatIntegrated from '../components/ProposalChatIntegrated';

export default function ChatPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: '#1d174f' }}>💬 Minhas Conversas</h1>
      <ProposalChatIntegrated projectId="proj_1" />
    </div>
  );
}
