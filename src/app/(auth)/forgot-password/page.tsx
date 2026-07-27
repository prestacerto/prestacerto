import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Esqueceu sua senha?"
      subtitle="Enviamos um link pra você criar uma nova"
      footer={{
        text: "Lembrou a senha?",
        linkLabel: "Voltar pro login",
        href: "/login",
      }}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
