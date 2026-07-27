import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Defina uma nova senha" subtitle="Quase lá">
      <ResetPasswordForm />
    </AuthCard>
  );
}
