import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";
import { VerifiedBadgeCard } from "@/components/monetization/verified-badge-card";
import { PortfolioPremiumCard } from "@/components/monetization/portfolio-premium-card";
import { FeaturedProjectCard } from "@/components/monetization/featured-project-card";

export const metadata = {
  title: "Monetização | PrestaCerto",
  description: "Ative planos premium para aumentar sua visibilidade",
};

export default async function MonetizationPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (!profile) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Monetização</h1>
        <p className="text-muted-foreground">Aumente sua visibilidade com planos premium</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <VerifiedBadgeCard
          isVerified={profile.verified_badge_active}
          expiresAt={profile.verified_badge_expires}
        />

        <PortfolioPremiumCard
          isPremium={profile.has_premium_portfolio}
          expiresAt={profile.portfolio_premium_expires}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Destaque de Projetos</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Apareça no topo das buscas e receba muito mais propostas
        </p>
        {/* Aqui você adicionaria os cards de projeto destacado */}
      </div>

      <div className="rounded-lg border border-dashed p-6 bg-muted/50">
        <h3 className="font-bold">📊 Próximas features</h3>
        <ul className="mt-2 text-sm space-y-1 text-muted-foreground">
          <li>✨ Conectar/Propostas Limitadas (R$ 600k/ano)</li>
          <li>⚡ Priority Queue (R$ 150k/ano)</li>
          <li>🎓 Cursos & Certificações</li>
          <li>🏆 Contests & Desafios</li>
        </ul>
      </div>
    </div>
  );
}
