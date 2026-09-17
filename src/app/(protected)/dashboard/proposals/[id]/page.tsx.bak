"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender_name: string;
  body: string;
  created_at: string;
}

interface Proposal {
  id: string;
  status: string;
  proposed_price: number;
  message: string;
  project_title: string;
  client_name: string;
  created_at: string;
}

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await fetch(`/api/proposals/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProposal(data.proposal);
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [params.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`/api/proposals/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleAccept = async () => {
    try {
      const response = await fetch(`/api/proposals/${params.id}/accept`, {
        method: "POST",
      });

      if (response.ok) {
        setProposal({ ...proposal!, status: "accepted" });
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  if (!proposal) {
    return <div className="text-center py-10">Proposta não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{proposal.project_title}</h1>
        <p className="text-muted-foreground">Proposta de {proposal.client_name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={
                proposal.status === "accepted" ? "bg-green-100 text-green-800" :
                proposal.status === "rejected" ? "bg-red-100 text-red-800" :
                "bg-yellow-100 text-yellow-800"
              }>
                {proposal.status === "accepted" ? "Aceita" :
                 proposal.status === "rejected" ? "Rejeitada" :
                 "Pendente"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor proposto</p>
              <p className="text-2xl font-bold">R$ {proposal.proposed_price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="text-sm">{new Date(proposal.created_at).toLocaleDateString("pt-BR")}</p>
            </div>

            {proposal.status === "pending" && (
              <Button onClick={handleAccept} className="w-full">
                Aceitar Proposta
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">Sua mensagem</p>
            <p className="text-sm leading-relaxed">{proposal.message}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversa</CardTitle>
          <CardDescription>Comunique-se com o cliente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto pb-4">
            {messages.length === 0 ? (
              <p className="text-sm text-center text-muted-foreground py-6">
                Nenhuma mensagem ainda
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-semibold">{msg.sender_name}</p>
                  <p className="text-sm mt-1">{msg.body}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(msg.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="space-y-2">
            <Textarea
              placeholder="Escreva sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()} className="w-full">
              {sending ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
