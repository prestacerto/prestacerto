import { Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityQueueCard } from "@/components/priority-queue/priority-queue-card";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Priority Queue | PrestaCerto",
  description: "Apareça no topo das buscas",
};

export default async function PriorityQueuePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const profile = await getProfile();
  if (!profile) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="size-8 text-amber-500" />
          Priority Queue
        </h1>
        <p className="text-muted-foreground">Apareça no topo das buscas e receba mais propostas</p>
      </div>

      {profile.priority_queue_active && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">✅ Premium Ativo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">
              Seu perfil está no topo das buscas até{" "}
              {new Date(profile.priority_queue_expires!).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4">Escolha seu plano</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <PriorityQueueCard
            tier="gold"
            days={3}
            price={15.9}
            features={[
              "Topo das buscas por 3 dias",
              "Badge no perfil",
              "+50% mais visualizações",
            ]}
            isActive={profile.priority_queue_active && profile.priority_queue_tier === "gold"}
            expiresAt={profile.priority_queue_expires || undefined}
          />

          <PriorityQueueCard
            tier="platinum"
            days={7}
            price={25.9}
            features={[
              "Topo das buscas por 7 dias",
              "Badge especial",
              "+80% mais visualizações",
              "Destaque em feeds",
            ]}
            isActive={profile.priority_queue_active && profile.priority_queue_tier === "platinum"}
            expiresAt={profile.priority_queue_expires || undefined}
          />

          <PriorityQueueCard
            tier="diamond"
            days={14}
            price={40.9}
            features={[
              "Topo das buscas por 14 dias",
              "Badge diamante",
              "+120% mais visualizações",
              "Destaque em feeds",
              "Email com clientes premium",
            ]}
            isActive={profile.priority_queue_active && profile.priority_queue_tier === "diamond"}
            expiresAt={profile.priority_queue_expires || undefined}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Impacto Estimado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Sem Priority Queue</p>
              <p className="text-2xl font-bold">~5 propostas/semana</p>
            </div>
            <div className="bg-blue-50 rounded p-4">
              <p className="text-sm text-blue-700">Com Priority Queue</p>
              <p className="text-2xl font-bold text-blue-700">~10-15 propostas/semana</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
