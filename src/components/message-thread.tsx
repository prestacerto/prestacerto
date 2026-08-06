"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MessageWithSender } from "@/lib/firebase/queries";

export function MessageThread({
  proposalId,
  messages,
  currentUserId,
}: {
  proposalId: string;
  messages: MessageWithSender[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!body.trim()) return;
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, body }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      toast.error("Não foi possível enviar a mensagem", { description: data?.error });
      return;
    }

    setBody("");
    router.refresh();
  }

  return (
    <div className="flex flex-col">
      <div className="flex max-h-[50vh] min-h-[240px] flex-col gap-3 overflow-y-auto rounded-lg border border-slate-200 p-4">
        {messages.length === 0 ? (
          <p className="m-auto text-sm text-slate-400">
            Nenhuma mensagem ainda — comece a conversa.
          </p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={cn("flex flex-col", isMine ? "items-end" : "items-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    isMine
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  )}
                >
                  {message.body}
                </div>
                <span className="mt-1 text-xs text-slate-400">
                  {isMine ? "Você" : message.sender?.full_name?.split(" ")[0] ?? "Outro"} ·{" "}
                  {new Date(message.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <Textarea
          rows={2}
          placeholder="Escreva uma mensagem..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1"
        />
        <Button type="button" nativeButton disabled={loading} onClick={handleSend}>
          Enviar
        </Button>
      </div>
    </div>
  );
}
