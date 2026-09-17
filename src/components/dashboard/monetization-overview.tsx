"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { Star, Award, Zap, TrendingUp } from "lucide-react";

interface HighlightData {
  id: string;
  project_title: string;
  days_purchased: number;
  days_remaining: number;
  valid_until: string;
}

interface PremiumData {
  id: string;
  months_purchased: number;
  days_remaining: number;
  premium_until: string;
}

interface BadgeData {
  id: string;
  badge_type: string;
  days_remaining: number;
  valid_until: string;
}

interface PaymentData {
  id: string;
  payment_type: string;
  amount: number;
  status: string;
  created_at: string;
}

export function MonetizationOverview() {
  const supabase = createClient();
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [premium, setPremium] = useState<PremiumData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeHighlights: 0,
    activeBadges: 0,
    isPremium: false,
  });

  async function loadData() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Carregar destaques ativos — a RLS de project_highlights já restringe
      // isso aos projetos do usuário logado, não precisa filtrar aqui
      // (project_id é o projeto, não teria como comparar com user.id mesmo).
      const { data: highlightsData } = await supabase
        .from("active_highlights")
        .select("*");
      setHighlights(highlightsData || []);

      // Carregar premium
      const { data: premiumData } = await supabase
        .from("active_premium")
        .select("*")
        .eq("freelancer_id", user.id)
        .maybeSingle();
      setPremium(premiumData);

      // Carregar badges
      const { data: badgesData } = await supabase
        .from("active_badges")
        .select("*")
        .eq("freelancer_id", user.id);
      setBadges(badgesData || []);

      // Carregar histórico de pagamentos
      const { data: paymentsData } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setPayments(paymentsData || []);

      // Calcular stats
      const totalSpent = paymentsData?.reduce((sum, p) =>
        p.status === 'approved' ? sum + p.amount : sum, 0
      ) || 0;

      setStats({
        totalSpent,
        activeHighlights: highlightsData?.length || 0,
        activeBadges: badgesData?.length || 0,
        isPremium: !!premiumData,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca de dados ao montar, padrão sem lib de data-fetching
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- roda 1x ao montar, loadData não depende de props
  }, []);

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">Em investimentos de visibilidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destaques Ativos</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeHighlights}</div>
            <p className="text-xs text-slate-500 mt-1">Projetos destacados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verificação</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBadges}</div>
            <p className="text-xs text-slate-500 mt-1">Badges de verificação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.isPremium ? "Ativo" : "Inativo"}</div>
            <p className="text-xs text-slate-500 mt-1">Portfólio Premium</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="highlights" className="w-full">
        <TabsList>
          <TabsTrigger value="highlights">Destaques ({stats.activeHighlights})</TabsTrigger>
          <TabsTrigger value="premium">Premium {stats.isPremium && "✓"}</TabsTrigger>
          <TabsTrigger value="badges">Badges ({stats.activeBadges})</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        </TabsList>

        {/* Destaques */}
        <TabsContent value="highlights" className="space-y-4">
          {highlights.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-500">
                Nenhum destaque ativo. Publique um projeto e destaque-o para aparecer no topo!
              </CardContent>
            </Card>
          ) : (
            highlights.map((h) => (
              <Card key={h.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{h.project_title}</CardTitle>
                      <CardDescription>{h.days_purchased} dias</CardDescription>
                    </div>
                    <Badge variant={h.days_remaining > 7 ? "default" : "destructive"}>
                      {h.days_remaining} dias restantes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600">
                    Válido até: {new Date(h.valid_until).toLocaleDateString("pt-BR")}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Premium */}
        <TabsContent value="premium">
          {premium ? (
            <Card>
              <CardHeader>
                <CardTitle>Portfólio Premium Ativo ✓</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Válido até:</span>
                  <span className="font-medium">
                    {new Date(premium.premium_until).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Dias restantes:</span>
                  <span className="font-medium text-green-600">{premium.days_remaining} dias</span>
                </div>
                <div className="bg-green-50 p-3 rounded text-sm text-green-700 mt-4">
                  ✓ Seu portfólio está destacado! Você aparece no topo das buscas.
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-slate-500">
                Premium inativo. Ative seu Portfólio Premium para aparecer no topo!
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Badges */}
        <TabsContent value="badges" className="space-y-4">
          {badges.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-500">
                Nenhuma badge ativa. Adquira uma badge de verificação para aumentar sua credibilidade!
              </CardContent>
            </Card>
          ) : (
            badges.map((b) => (
              <Card key={b.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">Badge {b.badge_type}</CardTitle>
                      <CardDescription>Verificado pela PrestaCerto</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {b.days_remaining} dias
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Pagamentos */}
        <TabsContent value="pagamentos" className="space-y-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-500">
                Nenhum pagamento realizado ainda.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <Card key={p.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium capitalize">{p.payment_type}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {p.amount.toFixed(2)}</p>
                        <Badge
                          variant={p.status === 'approved' ? 'default' : 'secondary'}
                          className="text-xs mt-1"
                        >
                          {p.status === 'approved' ? 'Aprovado' : p.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
