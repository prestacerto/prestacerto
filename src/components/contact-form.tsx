"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("Informe um e-mail válido"),
  subject: z.string().min(3, "Dê um assunto pra sua mensagem"),
  message: z.string().min(10, "Escreva uma mensagem um pouco mais completa"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactValues) {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Não foi possível enviar sua mensagem. Tente novamente.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
        Mensagem enviada! A gente responde no e-mail que você informou.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" nativeButton className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
