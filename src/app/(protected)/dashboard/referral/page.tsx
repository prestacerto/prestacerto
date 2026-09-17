import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { ReferralDashboard } from "@/components/referral-dashboard";

export default async function ReferralPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <ReferralDashboard userId={user.id} />
      <div className="text-center text-sm text-slate-500">
        <Link href="/parceiros" className="font-semibold text-blue-700 hover:underline">Conheça o programa Partner PrestaCerto</Link>
        <span className="mx-2">·</span>
        <Link href="/termos-indicacoes" className="font-semibold text-blue-700 hover:underline">Ver regras completas</Link>
      </div>
    </div>
  );
}
