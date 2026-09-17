"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Zap, Target, TrendingUp } from "lucide-react";

const matchedJobs = [
  {
    id: "1",
    title: "Website Redesign - E-commerce",
    client: "Tech Store Brasil",
    budget: "R$ 5.000 - R$ 8.000",
    skills: ["React", "Node.js", "PostgreSQL"],
    matchPercentage: 98,
    description: "Redesenhar website de e-commerce com checkout integrado",
    timeline: "45 dias",
    type: "Projeto Fixo",
  },
  {
    id: "2",
    title: "App Mobile - SaaS Dashboard",
    client: "StartUp XYZ",
    budget: "R$ 8.000 - R$ 15.000",
    skills: ["React Native", "TypeScript", "Firebase"],
    matchPercentage: 94,
    description: "Aplicativo mobile para gerenciar dados em tempo real",
    timeline: "60 dias",
    type: "Projeto Fixo",
  },
  {
    id: "3",
    title: "Consultoria de Arquitetura - Cloud",
    client: "Empresa Fortune 500",
    budget: "R$ 12.000 - R$ 20.000",
    skills: ["AWS", "Kubernetes", "Microservices"],
    matchPercentage: 89,
    description: "Design de infraestrutura cloud escalável",
    timeline: "30 dias",
    type: "Consultoria",
  },
  {
    id: "4",
    title: "Manutenção de Sistema - 3 meses",
    client: "Corp Systems",
    budget: "R$ 4.000/mês",
    skills: ["Python", "Django", "MySQL"],
    matchPercentage: 85,
    description: "Suporte e manutenção de sistema legado",
    timeline: "Contínuo",
    type: "Contrato",
  },
];

const getMatchColor = (percentage: number) => {
  if (percentage >= 95) return "bg-green-100 text-green-800";
  if (percentage >= 85) return "bg-blue-100 text-blue-800";
  return "bg-yellow-100 text-yellow-800";
};

const getMatchLabel = (percentage: number) => {
  if (percentage >= 95) return "Perfeito Match";
  if (percentage >= 85) return "Excelente Match";
  return "Bom Match";
};

export default function JobMatchingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          Job Matching - Projetos Recomendados
        </h1>
        <p className="text-muted-foreground">
          Projetos curados especialmente para você baseado em suas skills e histórico
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projetos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-green-600">+2 desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Match Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">Relevância média</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ 29M+</div>
            <p className="text-xs text-muted-foreground">Oportunidade disponível</p>
          </CardContent>
        </Card>
      </div>

      {/* Notificações */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Bell className="h-5 w-5" />
            Sistema de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p>
            <strong>✅ Ativo:</strong> Você receberá notificações push em tempo real quando novos projetos aparecerem
          </p>
          <p className="mt-2 text-sm">Próxima atualização: 10:00 AM</p>
          <Button variant="outline" className="mt-3">
            Ajustar Preferências
          </Button>
        </CardContent>
      </Card>

      {/* Matched Jobs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Projetos Recomendados</h2>
        {matchedJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.client}</p>

                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline">{job.type}</Badge>
                        <Badge variant="outline">{job.timeline}</Badge>
                        <Badge className={getMatchColor(job.matchPercentage)}>
                          {getMatchLabel(job.matchPercentage)} {job.matchPercentage}%
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{job.budget}</div>
                      <p className="text-xs text-muted-foreground">Orçamento</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Suas skills que combinam:</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      ✓ {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Enviar Proposta</Button>
                <Button variant="outline">Ver Detalhes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Como Funciona */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Como Funciona o Job Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-bold text-lg mb-2">1️⃣ Análise</p>
              <p className="text-sm">Sistema analisa suas skills, histórico e preferências</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="font-bold text-lg mb-2">2️⃣ Curação</p>
              <p className="text-sm">Encontra projetos que combinam com seu perfil</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="font-bold text-lg mb-2">3️⃣ Notificação</p>
              <p className="text-sm">Você recebe push notification em tempo real</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Feature */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-purple-900">⭐ Feature Premium</CardTitle>
          <CardDescription className="text-purple-800">
            Upgrade para Premium e desbloqueie funcionalidades avançadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span className="text-purple-900">Job Matching prioritário (1º a receber)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span className="text-purple-900">Filtros avançados (orçamento, timeline, localização)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span className="text-purple-900">Análise preditiva de sucesso (+accuracy 30%)</span>
          </div>
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Upgrade para Premium</Button>
        </CardContent>
      </Card>
    </div>
  );
}
