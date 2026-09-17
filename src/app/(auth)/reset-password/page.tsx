import { safeDestination } from "@/lib/auth/destination";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ next?: string; redirect?: string }> }) {
  const params = await searchParams;
  const destination = safeDestination(params.next || params.redirect);
  return (
    <AuthCard title="Defina uma nova senha" subtitle="Quase lá">
      <ResetPasswordForm destination={destination} />
    </AuthCard>
  );
}
