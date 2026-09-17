"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100, "Use até 100 caracteres no nome"),
  email: z.string().trim().email("Informe um e-mail válido").max(254),
  subject: z.string().trim().min(3, "Dê um assunto pra sua mensagem").max(200, "Use até 200 caracteres no assunto"),
  message: z.string().trim().min(10, "Escreva uma mensagem um pouco mais completa").max(10000, "Use até 10.000 caracteres na mensagem"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => { request.current?.abort(); request.current = null; }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactValues) {
    if (request.current) return;
    const controller = new AbortController(); request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30_000);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => null);
      if (request.current !== controller) return;
      if (!res.ok) throw new Error(typeof body?.error === "string" ? body.error : "Não foi possível enviar sua mensagem. Tente novamente.");
      if (body?.success !== true) throw new Error("Não foi possível confirmar o recebimento. Seus dados foram preservados.");
      setSent(true);
    } catch (caught) {
      if (request.current !== controller) return;
      setError(controller.signal.aborted ? "O envio demorou a responder. Não foi possível confirmar o recebimento; seus dados foram preservados."
        : caught instanceof Error && caught.name !== "TypeError" ? caught.message : "Não foi possível conectar. Seus dados foram preservados; tente novamente.");
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) { request.current = null; setLoading(false); }
    }
  }

  if (sent) {
    return (
      <p role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
        Mensagem recebida! A equipe pode responder pelo e-mail que você informou.
      </p>
    );
  }

  return (
    <form onSubmit={(event) => { void handleSubmit(onSubmit)(event); }} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Seu nome" {...register("name")} />
          {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@exemplo.com" {...register("email")} />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Assunto</Label>
        <Input id="subject" placeholder="Como podemos ajudar?" {...register("subject")} />
        {errors.subject && <p className="text-xs text-red-600">{errors.subject.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea id="message" rows={5} placeholder="Conte mais detalhes..." {...register("message")} />
        {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <Button type="submit" nativeButton className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
