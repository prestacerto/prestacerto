import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta"
      footer={{
        text: "Ainda não tem conta?",
        linkLabel: "Criar uma conta",
        href: "/register",
      }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
