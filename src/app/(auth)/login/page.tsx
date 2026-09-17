import { safeDestination, authDestination, selectedPlanFromDestination } from "@/lib/auth/destination";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; redirect?: string }> }) {
  const params = await searchParams;
  const destination = safeDestination(params.next || params.redirect);
  if (await getAuthenticatedUser()) redirect(['/login', '/register'].includes(new URL(destination, 'https://prestacerto.com.br').pathname) ? '/dashboard' : destination);
  const selectedPlan = selectedPlanFromDestination(destination);
  return (
    <AuthCard
      title={selectedPlan ? `Continue com o ${selectedPlan === 'pro' ? 'Pro' : 'Business'}` : "Bem-vindo de volta"}
      subtitle={selectedPlan ? "Entre ou crie uma conta para receber os recursos do plano. Você confirma o pagamento na próxima etapa." : "Entre na sua conta"}
      footer={{
        text: "Ainda não tem conta?",
        linkLabel: "Criar uma conta",
        href: authDestination("register", destination),
      }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
