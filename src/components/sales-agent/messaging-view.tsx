'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_TEMPLATES } from '@/lib/messaging';

interface MessageTemplate {
  id: string;
  name: string;
  channel: 'email' | 'whatsapp' | 'linkedin';
  body: string;
  subject?: string;
}

interface Message {
  id: string;
  lead_id: string;
  channel: string;
  message_content: string;
  status: 'drafted' | 'sent' | 'failed' | 'opened' | 'clicked';
  sent_at?: string;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  score: number;
}

export function MessagingView({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [templates, setTemplates] = useState<MessageTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
    loadLeads();
  }, [userId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/sales-agent/send-message?userId=${userId}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    try {
      const response = await fetch(`/api/sales-agent/prospects?userId=${userId}`);
      const data = await response.json();
      if (data.prospects) {
        // Filter leads that haven't been contacted or need follow-up
        const filtered = data.prospects.filter((p: any) =>
          ['pending', 'contacted'].includes(p.status)
        );
        setLeads(filtered);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
    }
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setCustomMessage(template.body);
    setChannel(template.channel as any);
  };

  const handleSendMessage = async () => {
    if (!selectedLead || !customMessage) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/sales-agent/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          leadId: selectedLead.id,
          channel,
          message: customMessage,
          templateId: selectedTemplate?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCustomMessage('');
        setSelectedLead(null);
        setSelectedTemplate(null);
        await loadMessages();

        // Show success message
        alert(`Mensagem enviada com sucesso via ${channel}!`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Falha ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      drafted: 'bg-yellow-100 text-yellow-800',
      opened: 'bg-blue-100 text-blue-800',
      clicked: 'bg-purple-100 text-purple-800',
    };

    const labels: Record<string, string> = {
      sent: 'Enviado ✓',
      failed: 'Falha',
      drafted: 'Rascunho',
      opened: 'Aberto',
      clicked: 'Clicado',
    };

    return <Badge className={colors[status] || 'bg-slate-100'}>{labels[status] || status}</Badge>;
  };

  const recentMessages = messages.slice(0, 5);
  const totalSent = messages.filter((m) => m.status === 'sent').length;
  const totalOpened = messages.filter((m) => m.status === 'opened').length;

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-slate-600">Total Enviado</p>
            <p className="text-3xl font-bold">{totalSent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-slate-600">Abertos</p>
            <p className="text-3xl font-bold text-blue-600">{totalOpened}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-slate-600">Taxa de Abertura</p>
            <p className="text-3xl font-bold text-purple-600">
              {totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Message Composer */}
      <Card>
        <CardHeader>
          <CardTitle>Enviar Mensagem</CardTitle>
          <CardDescription>Escolha um prospect e template, ou crie uma mensagem personalizada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lead Selection */}
          <div>
            <label className="text-sm font-medium">Selecione um prospect</label>
            <select
              value={selectedLead?.id || ''}
              onChange={(e) => {
                const lead = leads.find((l) => l.id === e.target.value);
                setSelectedLead(lead || null);
              }}
              className="w-full mt-1 px-3 py-2 border rounded"
            >
              <option value="">-- Escolha um prospect --</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} ({lead.company}) - Score: {lead.score}
                </option>
              ))}
            </select>
          </div>

          {/* Template Selection */}
          <div>
            <label className="text-sm font-medium">Ou use um template</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 border rounded text-left transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 border-blue-400'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-slate-600">Canal: {template.channel}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Channel Selection */}
          <div>
            <label className="text-sm font-medium">Canal de comunicação</label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setChannel('email')}
                className={`px-4 py-2 rounded border transition-colors ${
                  channel === 'email'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setChannel('whatsapp')}
                className={`px-4 py-2 rounded border transition-colors ${
                  channel === 'whatsapp'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                WhatsApp
              </button>
            </div>
          </div>

          {/* Message Editor */}
          <div>
            <label className="text-sm font-medium">Mensagem</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui. Use {{name}}, {{company}} para variáveis..."
              className="w-full mt-1 px-3 py-2 border rounded h-32 font-mono text-sm"
            />
            <p className="text-xs text-slate-600 mt-1">
              Variáveis disponíveis: {'{{name}}, {{company}}, {{email}}, {{phone}}'}
            </p>
          </div>

          {/* Send Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleSendMessage}
              disabled={!selectedLead || !customMessage || isSending}
              className="flex-1"
            >
              {isSending ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
            <Button
              onClick={() => {
                setCustomMessage('');
                setSelectedLead(null);
                setSelectedTemplate(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Mensagens</CardTitle>
          <CardDescription>Últimas mensagens enviadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-slate-600 text-center py-4">Nenhuma mensagem ainda</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="border rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm">
                      <p className="font-semibold">
                        {msg.channel === 'email' ? '📧' : '💬'} {msg.channel}
                      </p>
                      <p className="text-slate-600">{new Date(msg.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    {getStatusBadge(msg.status)}
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{msg.message_content}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
