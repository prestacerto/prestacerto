"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, TrendingUp } from "lucide-react";

interface AffiliateStats {
  referrals: number;
  commissions: number;
  earnings: number;
  conversionRate: number;
}

export default function AffiliatePage() {
  const [stats, setStats] = useState<AffiliateStats>({
    referrals: 0,
    commissions: 0,
    earnings: 0,
    conversionRate: 0,
  });
  const [copied, setCopied] = useState(false);

  const affiliateLink = `https://prestacerto.com.br?ref=${typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'user123' : 'user123'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Programa de Afiliados</h1>
        <p className="text-muted-foreground">
          Ganhe 10% de comissão em cada referência que se converter
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Referências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.referrals}</div>
            <p className="text-xs text-muted-foreground">cliques únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.commissions}</div>
            <p className="text-xs text-muted-foreground">planos ativados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ganhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {stats.earnings}</div>
            <p className="text-xs text-muted-foreground">a receber</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seu Link de Afiliado</CardTitle>
          <CardDescription>
            Compartilhe este link e ganhe 10% de comissão em cada novo usuário que se converter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={affiliateLink}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm"
            />
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <p className="font-semibold text-sm text-blue-900">💰 Como funciona:</p>
            <ul className="text-sm text-blue-900 space-y-1">
              <li>✓ Compartilhe seu link com amigos e colegas</li>
              <li>✓ Cada pessoa que se registrar ganha seu link será rastreada</li>
              <li>✓ Quando ativarem um plano premium, você ganha 10% de comissão</li>
              <li>✓ Ganhos acumulam mensalmente e podem ser sacados</li>
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Exemplo:</p>
                <p className="font-semibold">Destaque 30 dias = R$ 249</p>
                <p className="text-lg font-bold text-green-600">Você ganha: R$ 24.90</p>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Analytics Pro = R$ 49/mês</p>
                <p className="font-semibold">Cada referência recorrente</p>
                <p className="text-lg font-bold text-green-600">Você ganha: R$ 4.90/mês</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estratégias de Compartilhamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg space-y-2">
              <p className="font-semibold text-sm">🔗 Redes Sociais</p>
              <p className="text-sm text-muted-foreground">
                Compartilhe em LinkedIn, Twitter, Instagram com sua experiência no PrestaCerto
              </p>
              <Button variant="outline" className="w-full mt-2" size="sm">
                Gerar Post
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <p className="font-semibold text-sm">✉️ Email</p>
              <p className="text-sm text-muted-foreground">
                Envie seu link para contatos profissionais que possam se beneficiar
              </p>
              <Button variant="outline" className="w-full mt-2" size="sm">
                Template de Email
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <p className="font-semibold text-sm">💬 Comunidades</p>
              <p className="text-sm text-muted-foreground">
                Participe de grupos de freelancers e compartilhe valor genuíno
              </p>
              <Button variant="outline" className="w-full mt-2" size="sm">
                Dicas de Comunidade
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <p className="font-semibold text-sm">🎯 Marketing</p>
              <p className="text-sm text-muted-foreground">
                Use banners e materiais pré-prontos para promover o PrestaCerto
              </p>
              <Button variant="outline" className="w-full mt-2" size="sm">
                Baixar Materiais
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
