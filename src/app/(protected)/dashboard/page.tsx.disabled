import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { getReferralStats } from "@/lib/supabase/referrals";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Clock, TrendingUp, Zap, Trophy } from "lucide-react";

const ReferralCard = dynamic(() => import("@/components/dashboard/referral-card").then(m => ({ default: m.ReferralCard })), { loading: () => null });
const RevenueWidget = dynamic(() => import("@/components/dashboard/revenue-widget").then(m => ({ default: m.RevenueWidget })), { loading: () => <div className="bg-gray-100 rounded animate-pulse h-40" /> });
const ActivityFeed = dynamic(() => import("@/components/dashboard/activity-feed").then(m => ({ default: m.ActivityFeed })), { loading: () => null });
const PushNotificationBell = dynamic(() => import("@/components/push-notification-bell").then(m => ({ default: m.PushNotificationBell })), { loading: () => null });
const RevenueDashboard = dynamic(() => import("@/components/analytics/revenue-dashboard").then(m => ({ default: m.RevenueDashboard })), { loading: () => <div className="bg-gray-100 rounded animate-pulse h-96" /> });

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

      {/* Urgency Banner */}
      <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-red-600" />
          <div>
            <p className="font-semibold text-red-900">⏰ 3 projetos acabam em 2 horas!</p>
            <p className="text-sm text-red-700">Não perca essas oportunidades</p>
          </div>
        </div>
      </div>

      {/* Revenue Widget */}
      <RevenueWidget />

      {/* Revenue Analytics Dashboard */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Análise de Receita em Tempo Real</h2>
        <RevenueDashboard />
      </div>

      {/* Daily Challenges */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-purple-600" />
            <h3 className="font-bold">Desafios de Hoje</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded">
              <div>
                <p className="font-semibold text-sm">Publicar um projeto</p>
                <p className="text-xs text-slate-500">+50 XP + R$ 10</p>
              </div>
              <div className="text-right">
                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-green-500"></div>
                </div>
                <p className="text-xs text-slate-600 mt-1">0/1</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded">
              <div>
                <p className="font-semibold text-sm">Responder 2 mensagens</p>
                <p className="text-xs text-slate-500">+30 XP + R$ 5</p>
              </div>
              <div className="text-right">
                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-yellow-500"></div>
                </div>
                <p className="text-xs text-slate-600 mt-1">1/2</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-slate-600">Esta semana</p>
                <p className="text-3xl font-bold text-green-600">3 contratos</p>
                <p className="text-xs text-slate-500 mt-1">+50% vs semana passada</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-slate-600">Visualizações</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-xs text-slate-500 mt-1">Seu perfil está em alta!</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
