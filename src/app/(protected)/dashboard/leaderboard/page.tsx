"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, Zap, Clock } from "lucide-react";

const leaderboardData = [
  {
    rank: 1,
    name: "João Dev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    score: 4850,
    badges: ["top-freelancer", "resposta-rapida", "premium-member"],
    proposals: 48,
    conversionRate: 95,
    avgResponseTime: "15min",
  },
  {
    rank: 2,
    name: "Maria Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
    score: 4320,
    badges: ["top-freelancer", "premium-member"],
    proposals: 42,
    conversionRate: 88,
    avgResponseTime: "22min",
  },
  {
    rank: 3,
    name: "Carlos Marketer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    score: 3890,
    badges: ["resposta-rapida", "premium-member"],
    proposals: 38,
    conversionRate: 82,
    avgResponseTime: "18min",
  },
  {
    rank: 4,
    name: "Ana Copywriter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    score: 3450,
    badges: ["top-freelancer"],
    proposals: 35,
    conversionRate: 79,
    avgResponseTime: "25min",
  },
  {
    rank: 5,
    name: "Pedro Backend",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
    score: 3120,
    badges: ["premium-member"],
    proposals: 32,
    conversionRate: 75,
    avgResponseTime: "30min",
  },
  {
    rank: 6,
    name: "Lucia UX",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucia",
    score: 2890,
    badges: [],
    proposals: 28,
    conversionRate: 71,
    avgResponseTime: "35min",
  },
];

const BADGE_INFO = {
  "top-freelancer": {
    label: "Top Freelancer",
    icon: "👑",
    description: "Top 5% em taxa de conversão",
    color: "bg-yellow-100 text-yellow-800",
  },
  "resposta-rapida": {
    label: "Resposta Rápida",
    icon: "⚡",
    description: "Responde em menos de 1h",
    color: "bg-blue-100 text-blue-800",
  },
  "premium-member": {
    label: "Premium Member",
    icon: "⭐",
    description: "Membro premium ativo",
    color: "bg-purple-100 text-purple-800",
  },
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">🏆 Leaderboard Mensal</h1>
        <p className="text-muted-foreground">
          Top 10 freelancers ganham destaque grátis! Suba no ranking respondendo rápido e convertendo projetos.
        </p>
      </div>

      {/* Prêmio */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Prêmio do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-800">
            <strong>Top 10 freelancers ganham 30 dias de Destaque GRÁTIS!</strong>
          </p>
          <p className="text-sm text-yellow-700 mt-2">
            Próxima atualização: 1º de setembro. Comece a subir agora! 🚀
          </p>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Setembro</CardTitle>
          <CardDescription>Baseado em taxa de conversão, tempo de resposta e atividade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((freelancer) => (
              <div
                key={freelancer.rank}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank Badge */}
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg shrink-0">
                    {freelancer.rank}
                  </div>

                  {/* Avatar + Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={freelancer.avatar} />
                      <AvatarFallback>{freelancer.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm">{freelancer.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {freelancer.badges.map((badge) => (
                          <Badge
                            key={badge}
                            className={`text-xs ${BADGE_INFO[badge as keyof typeof BADGE_INFO]?.color || "bg-gray-100"}`}
                            variant="outline"
                          >
                            {BADGE_INFO[badge as keyof typeof BADGE_INFO]?.icon}{" "}
                            {BADGE_INFO[badge as keyof typeof BADGE_INFO]?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Conversão</p>
                    <p className="font-bold text-green-600">{freelancer.conversionRate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Resposta</p>
                    <p className="font-bold text-blue-600">{freelancer.avgResponseTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Score</p>
                    <p className="font-bold text-lg">{freelancer.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Como subir no ranking */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">⚡ Responda Rápido</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Responda propostas em menos de 1 hora para ganhar badge "Resposta Rápida" e +500 pontos/mês
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">🎯 Converta Mais</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Mantenha taxa de conversão acima de 85% para se manter no Top 5 e ganhar badge "Top Freelancer"
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">⭐ Seja Premium</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Membros premium com planos ativos ganham +1000 pontos bônus/mês automaticamente
          </CardContent>
        </Card>
      </div>

      {/* Badges Info */}
      <Card>
        <CardHeader>
          <CardTitle>🏅 Badges Disponíveis</CardTitle>
          <CardDescription>Conquiste badges e mostre sua expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(BADGE_INFO).map(([key, badge]) => (
              <div key={key} className={`p-4 rounded-lg ${badge.color}`}>
                <p className="text-2xl mb-2">{badge.icon}</p>
                <p className="font-semibold text-sm">{badge.label}</p>
                <p className="text-xs mt-2">{badge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
