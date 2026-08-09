import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { getReferralStats } from "@/lib/supabase/referrals";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Clock, TrendingUp, Zap, Trophy } from "lucide-react";

const ReferralCard = dynamic(() => import("@/components/dashboard/referral-card").then(m => ({ default: m.ReferralCard })), { loading: () => null });
const RevenueWidget = dynamic(() => import("@/components/dashboard/revenue-widget").then(m => ({ default: m.RevenueWidget })), { loading: () => <div className="bg-gray-100 rounded animate-pulse h-40" /> });

export const metadata = { title: "Dashboard — PrestaCerto" };

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const [profileResult, referralResult] = await Promise.allSettled([
    getProfile(),
    getReferralStats(user.id),
  ]);

  const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
  const referralStats = referralResult.status === "fulfilled" ? referralResult.value : {
    monthCompleted: 0,
    totalCompleted: 0,
    remainingForBusiness: 3,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Olá, {profile?.full_name?.split(" ")[0] ?? "bem-vindo"}</h1>
        <p className="text-slate-500 mt-1">Seu dashboard está pronto.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Rating</p>
            <p className="text-3xl font-bold mt-2">{profile?.rating ? profile.rating.toFixed(1) : "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Avaliações</p>
            <p className="text-3xl font-bold mt-2">{profile?.rating_count ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Plano</p>
            <p className="text-lg font-bold mt-2 capitalize">{profile?.plan ?? "free"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">Status</p>
            <p className="text-lg font-bold text-green-600 mt-2">Ativo</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 flex-wrap">
        <LinkButton href="/dashboard/projects/new">Novo Projeto</LinkButton>
        <LinkButton href="/dashboard/profile" variant="outline">Perfil</LinkButton>
        <LinkButton href="/services" variant="outline">Explorar</LinkButton>
        <LinkButton href="/checkout" variant="outline">Pro/Business</LinkButton>
      </div>

      {profile?.plan === "free" && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Upgrade para Pro</p>
                <p className="text-sm text-slate-600 mt-1">Propostas ilimitadas + Badge</p>
              </div>
              <Link href="/checkout" className="text-sm font-bold text-blue-600">Ver →</Link>
            </div>
          </CardContent>
        </Card>
      )}

      <ReferralCard
        userId={user.id}
        monthCompleted={referralStats.monthCompleted}
        totalCompleted={referralStats.totalCompleted}
        remainingForBusiness={referralStats.remainingForBusiness}
      />
    </div>
  );
}
