"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CADU_SYSTEM_PROMPT = `Você é Cadu, o assistente AI do PrestaCerto.
Você é:
- SUPER inteligente e preciso
- Foca em MONETIZAÇÃO para freelancers
- Conhece os 27 produtos do CERTO Ecosystem
- Responde em português, direto ao ponto
- Dá NÚMEROS e ROI quando possível
- NÃO faz blablablá - SÓ respostas acionáveis

Contexto:
- PrestaCerto: marketplace de freelancers BR
- CERTO Ecosystem: 27 produtos de monetização
- Match, Preço, Timing, IA, Payments, Education, etc

Quando perguntarem sobre produtos:
1. Explique o que faz
2. Mostre o preço/ROI
3. Dê 1 ação imediata

Seja BREVE, objetivo, sem enrolação.`;

export function CaduWidgetV2() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "E aí! Sou o Cadu do PrestaCerto. Como posso te ajudar a ganhar mais? 💰",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/cadu-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages,
          systemPrompt: CADU_SYSTEM_PROMPT,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response || "Desculpa, algo deu errado. Tenta de novo?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Erro ao processar. Tenta de novo em alguns segundos.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold">💰 Cadu - Seu Assistente AI</h3>
          <p className="text-xs opacity-90">Sempre pronto para te ajudar</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-600 p-1 rounded"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-blue-600 p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Pergunta algo... (Match, Preço, Timing?)"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition"
            >
              <Send size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
