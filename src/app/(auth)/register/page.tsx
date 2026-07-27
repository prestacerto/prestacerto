import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Leva menos de um minuto"
      footer={{
        text: "Já tem conta?",
        linkLabel: "Entrar",
        href: "/login",
      }}
    >
      <RegisterForm />
    </AuthCard>
  );
}
