"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("🔐 FORM SUBMIT TRIGGERED!");

    if (!email || !password) {
      console.warn("❌ Email ou password vazio");
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      console.log("📧 Login attempt:", { email, password: "***" });

      const supabase = createClient();
      console.log("✅ Supabase client criado");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("📡 Response:", { data, error });

      if (error) {
        console.error("❌ Auth error:", error);
        toast.error("Erro ao entrar", { description: error.message });
        return;
      }

      if (!data.user) {
        console.error("❌ No user returned");
        toast.error("Erro ao entrar", { description: "Nenhum usuário retornado" });
        return;
      }

      console.log("✅ LOGIN SUCCESS:", data.user.id);
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      console.log("🚀 Redirecting to:", redirect);
      router.push(redirect);
    } catch (err) {
      console.error("❌ Exception:", err);
      toast.error("Erro ao entrar", { description: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <GoogleAuthButton />

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        OU
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="/forgot-password" className="text-xs text-slate-500 hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
