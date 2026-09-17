import { safeDestination, authDestination, selectedPlanFromDestination } from "@/lib/auth/destination";
export const dynamic = "force-dynamic";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string; redirect?: string }> }) {
  const params = await searchParams;
  const destination = safeDestination(params.next || params.redirect);
  if (await getAuthenticatedUser()) redirect(['/login', '/register'].includes(new URL(destination, 'https://prestacerto.com.br').pathname) ? '/dashboard' : destination);
  const selectedPlan = selectedPlanFromDestination(destination);
  return (
    <AuthCard
      title="Crie sua conta"
      subtitle={selectedPlan ? `Crie sua conta grátis para continuar com o ${selectedPlan === 'pro' ? 'Pro' : 'Business'}. O pagamento só acontece no checkout.` : "Cadastro gratuito para contratar ou oferecer serviços"}
      footer={{
        text: "Já tem conta?",
        linkLabel: "Entrar",
        href: authDestination("login", destination),
      }}
    >
      <RegisterForm />
    </AuthCard>
  );
}
