"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { cn } from "@/lib/utils";

const DEFAULT_PASSWORD = "PrestaCerto@123";

const registerSchema = z.object({
  fullName: z.string().min(2, "Informe seu nome"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().optional().default(DEFAULT_PASSWORD),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"freelancer" | "client">("freelancer");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { role, full_name: values.fullName },
      },
    });
    setLoading(false);

    if (error) {
      toast.error("Não foi possível criar sua conta", {
        description: error.message,
      });
      return;
    }

    // Se a confirmação de e-mail estiver habilitada no projeto Supabase,
    // `session` vem nulo aqui — o usuário precisa confirmar antes de logar.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <p className="text-center text-sm text-slate-600">
        Quase lá! Enviamos um link de confirmação para o seu e-mail — clique
        nele para ativar sua conta.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRole("freelancer")}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
            role === "freelancer"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          <Briefcase className="size-4" />
          Quero oferecer serviços
        </button>
        <button
          type="button"
          onClick={() => setRole("client")}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
            role === "client"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          <User className="size-4" />
          Quero contratar
        </button>
      </div>

      <GoogleAuthButton />

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        OU
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input id="fullName" placeholder="Seu nome" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@exemplo.com" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha (opcional)</Label>
          <Input
            id="password"
            type="password"
            placeholder="Deixe em branco para usar a padrão"
            {...register("password")}
          />
          <p className="text-xs text-slate-500">
            💡 Padrão: <code className="bg-slate-100 px-1 rounded">PrestaCerto@123</code>
          </p>
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" nativeButton className="w-full" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </div>
  );
}
