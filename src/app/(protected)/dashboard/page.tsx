import Link from "next/link";
import { Briefcase, Send, Star, ArrowRight, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { getMyProjects, getMyProposals, getMyServices } from "@/lib/supabase/queries";
import { MonetizationOverview } from "@/components/dashboard/monetization-overview";
import { MonetizationCTAs } from "@/components/dashboard/monetization-ctas";
import { BenchmarkWidget } from "@/components/benchmark-widget";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { getReferralStats } from "@/lib/supabase/referrals";
import { PartnerMarketplace } from "@/components/partner-marketplace";
import { DailyChallenges } from "@/components/daily-challenges";

export const metadata = { title: "Dashboard — PrestaCerto" };

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const [profile, projects, proposals, services, referralStats] = await Promise.all([
    getProfile(),
    getMyProjects(user.id),
    getMyProposals(user.id),
    getMyServices(user.id),
    getReferralStats(user.id),
  ]);

  const openProjects = projects.filter((p) => p.status === "open").length;
  const pendingProposals = proposals.filter((p) => p.status === "pending").length;
  const activeServices = services.filter((s) => s.is_active).length;

  const isFreelancer = profile?.role === "freelancer" || profile?.role === "both";
  const checklistItems = [
    {
      label: "Adicione uma foto de perfil",
      done: Boolean(profile?.avatar_url),
      href: "/dashboard/profile",
      cta: "Adicionar foto",
    },
    {
      label: "Escreva uma bio curta",
      done: Boolean(profile?.bio),
      href: "/dashboard/profile",
      cta: "Escrever bio",
    },
    ...(isFreelancer
      ? [
          {
            label: "Cadastre seu primeiro serviço",
            done: services.length > 0,
            href: "/dashboard/services/new",
            cta: "Cadastrar serviço",
          },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Olá, {profile?.full_name?.split(" ")[0] ?? "tudo bem"}
      </h1>
      <p className="mt-1 text-slate-500">
        Aqui está um resumo da sua conta na PrestaCerto.
      </p>

      <div className="mt-6">
        <OnboardingChecklist items={checklistItems} />
      </div>

      <div className="mt-8 max-w-2xl">
        <DailyChallenges
          userProgress={[
            { type: "respond-proposals", progress: 1, completed: false, rewardClaimed: false },
            { type: "complete-profile", progress: 1, completed: true, rewardClaimed: false },
            { type: "send-message", progress: 0, completed: false, rewardClaimed: false },
            { type: "publish-service", progress: 0, completed: false, rewardClaimed: false },
            { type: "rate-experience", progress: 0, completed: false, rewardClaimed: false },
          ]}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Wrench className="size-4" />
              Meus serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{services.length}</p>
            <p className="text-sm text-slate-500">{activeServices} ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Briefcase className="size-4" />
              Meus projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
            <p className="text-sm text-slate-500">{openProjects} em aberto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Send className="size-4" />
              Minhas propostas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{proposals.length}</p>
            <p className="text-sm text-slate-500">{pendingProposals} pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Star className="size-4" />
              Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">
              {profile?.rating ? profile.rating.toFixed(1) : "—"}
            </p>
            <p className="text-sm text-slate-500">
              {profile?.rating_count ?? 0} avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/dashboard/projects/new">
          Publicar projeto
          <ArrowRight className="size-4" />
        </LinkButton>
        <LinkButton href="/services" variant="outline">
          Explorar freelancers
        </LinkButton>
      </div>

      {profile?.plan === "free" && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                Você está no plano Grátis
              </p>
              <p className="text-sm text-slate-500">
                Assine o Pro pra ter propostas ilimitadas e badge de verificado.
              </p>
            </div>
            <Link
              href="/plans"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Ver planos
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="mt-12 space-y-12">
        <div className="max-w-md">
          <BenchmarkWidget />
        </div>
        <div>
          <MonetizationCTAs />
        </div>
        <div className="max-w-md">
          <ReferralCard
            userId={user.id}
            monthCompleted={referralStats.monthCompleted}
            totalCompleted={referralStats.totalCompleted}
            remainingForBusiness={referralStats.remainingForBusiness}
          />
        </div>
        <div>
          <h2 className="mb-6 text-xl font-bold text-slate-900">Meus investimentos</h2>
          <MonetizationOverview />
        </div>
        <div>
          <PartnerMarketplace userId={user.id} />
        </div>
      </div>
    </div>
  );
}
