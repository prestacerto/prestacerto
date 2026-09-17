"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { safeDestination } from "@/lib/auth/destination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm({ destination = "/dashboard" }: { destination?: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setLoading(true);
    try {
      const supabase = createClient();
      const next = new URLSearchParams({ next: safeDestination(destination) });
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password?${next}`,
      });
      if (error) {
        toast.error("Não foi possível enviar o link", { description: error.message });
        return;
      }
      setSent(true);
    } catch {
      toast.error("Não foi possível enviar o link", { description: "Confira sua conexão e tente novamente." });
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-slate-600">
        Se existir uma conta com esse e-mail, enviamos um link pra você
        redefinir a senha.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="voce@exemplo.com" {...register("email")} />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" nativeButton className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </Button>
    </form>
  );
}
