import { authDestination, safeDestination } from "@/lib/auth/destination";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ next?: string; redirect?: string }> }) {
  const params = await searchParams;
  const destination = safeDestination(params.next || params.redirect);
  return (
    <AuthCard
      title="Esqueceu sua senha?"
      subtitle="Enviamos um link pra você criar uma nova"
      footer={{
        text: "Lembrou a senha?",
        linkLabel: "Voltar pro login",
        href: authDestination("login", destination),
      }}
    >
      <ForgotPasswordForm destination={destination} />
    </AuthCard>
  );
}
