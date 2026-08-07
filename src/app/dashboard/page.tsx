import { createServiceClient } from "@/lib/supabase/service";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferralDashboard } from "@/components/referral-dashboard";
import { PartnerMarketplace } from "@/components/partner-marketplace";
import { BenchmarkWidget } from "@/components/benchmark-widget";
import { BadgesSystem } from "@/components/badges-system";
import { ContractGenerator } from "@/components/contract-generator";
import { ProposalInsightsDashboard } from "@/components/proposal-insights-dashboard";

export const metadata = {
  title: "Dashboard | PrestaCerto",
  description: "Gerencie suas propostas, ganhos e indicações",
};

export default async function DashboardPage() {
  const supabase = createServiceClient();

  const userId = "temp-user-id";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Acompanhe seus ganhos, propostas e oportunidades
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="referral">💰 Indicações</TabsTrigger>
            <TabsTrigger value="partners">🤝 Parceiros</TabsTrigger>
            <TabsTrigger value="tools">🛠️ Ferramentas</TabsTrigger>
            <TabsTrigger value="insights">📊 Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BadgesSystem userId={userId} />
              <BenchmarkWidget />
            </div>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral">
            <ReferralDashboard userId={userId} />
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <PartnerMarketplace userId={userId} />
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <ContractGenerator />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <ProposalInsightsDashboard userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
