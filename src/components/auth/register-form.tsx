"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackRegistration } from "@/components/analytics";
import { safeDestination, authDestination, registrationRole } from "@/lib/auth/destination";
import { cn } from "@/lib/utils";
import { readLandingHandoff } from "@/lib/landing-handoff";
import { trackFunnelEvent } from "@/lib/funnel";

const registerSchema = z.object({
  fullName: z.string().min(2, "Informe seu nome").max(80, "Use até 80 caracteres"),
  email: z.string().email("Informe um e-mail válido").max(254, "Use até 254 caracteres"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = safeDestination(searchParams.get("next") || searchParams.get("redirect"));
  const referrerId = searchParams.get("ref");
  const requestedRole = searchParams.get("role");
  const [role, setRole] = useState<"freelancer" | "client">(
    registrationRole(destination, requestedRole),
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    getFieldState,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    const handoff = readLandingHandoff(role === 'client' ? 'client' : 'provider');
    if (!handoff) return;
    for (const [field, value] of [['fullName', handoff.lead.name.slice(0, 80)], ['email', handoff.lead.email]] as const) {
      if (!getValues(field) && !getFieldState(field).isDirty && !getFieldState(field).isTouched) setValue(field, value);
    }
  }, [role, getValues, getFieldState, setValue]);

  async function onSubmit(values: RegisterValues) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role,
          next: destination,
          ...(referrerId ? { referrerId } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = typeof data.error === "string" ? data.error : "Tente novamente em instantes.";
        const isExistingAccount = /already registered|já cadastrad/i.test(errorMessage);
        toast.error("Não foi possível criar sua conta", {
          description: isExistingAccount
            ? "Este e-mail já tem uma conta. Entre ou recupere sua senha."
            : errorMessage,
        });
        return;
      }

      trackFunnelEvent('presta_certo_registration_success', role === 'client' ? 'client' : 'provider');
      if (data.session) {
        trackRegistration(role);
        toast.success("Conta criada com sucesso!");
        router.push(destination);
        router.refresh();
      } else {
        trackRegistration(role);
        setConfirmationEmail(values.email);
        setSubmitted(true);
        toast.success("Confira seu e-mail para confirmar a conta.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Tente novamente em instantes.";
      toast.error("Não foi possível criar sua conta", { description: message });
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    if (!confirmationEmail) return;
    setResending(true);
    try {
      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: confirmationEmail, next: destination }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error("Não foi possível reenviar", { description: data.error || "Tente novamente em instantes." });
        return;
      }
      toast.success("Se houver uma conta pendente, enviamos um novo link.");
    } catch {
      toast.error("Não foi possível reenviar", { description: "Tente novamente em instantes." });
    } finally {
      setResending(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <div className="space-y-1">
          <p className="text-base font-semibold text-slate-900">Confirme seu e-mail</p>
          <p className="text-sm leading-6 text-slate-600">
            Enviamos um link para <span className="font-medium text-slate-800">{confirmationEmail}</span>. Abra-o para ativar a conta e entrar.
          </p>
        </div>
        <p className="text-xs leading-5 text-slate-500">Não encontrou? Veja Spam e Promoções. O link pode levar alguns minutos.</p>
        <Button type="button" variant="outline" className="w-full" onClick={resendConfirmation} disabled={resending}>
          {resending ? "Reenviando..." : "Reenviar e-mail de confirmação"}
        </Button>
        <Link href={authDestination("login", destination)} className="block text-sm font-medium text-blue-600 hover:underline">
          Já tem uma conta? Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRole("freelancer")}
          aria-pressed={role === "freelancer"}
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
          aria-pressed={role === "client"}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input id="fullName" placeholder="Seu nome" autoComplete="name" maxLength={80} {...register("fullName")} />
          {errors.fullName && (
            <p className="text-xs text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@exemplo.com" autoComplete="email" maxLength={254} {...register("email")} />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
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
