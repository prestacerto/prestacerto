"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Gift, Share2, TrendingUp } from "lucide-react";

interface ReferralProInviteModalProps {
  userId: string;
  referralLink?: string;
  freeMonthsEarned?: number;
}

export function ReferralProInviteModal({
  userId,
  referralLink: initialLink,
  freeMonthsEarned = 0,
}: ReferralProInviteModalProps) {
  const referralLink =
    initialLink || `${process.env.NEXT_PUBLIC_APP_URL || "https://presta-certo.app"}/register?ref=${userId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Junte-se a mim no PrestaCerto! 🚀 Quando você assinar o Pro, ganhamos 1 mês grátis cada um.`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)} ${referralLink}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
    email: `mailto:?subject=Convite PrestaCerto&body=${encodeURIComponent(shareText)} ${referralLink}`,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Gift className="h-6 w-6 text-green-600" />
          Ganhe 1 Mês Pro Grátis
        </h2>
        <p className="text-slate-500 mt-1">
          Indique seus amigos e ganhe crédito de assinatura quando eles
          assinarem Pro
        </p>
      </div>

      {/* Earnings */}
      {freeMonthsEarned > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-900">
                  Meses Pro ganhos com referências
                </p>
                <p className="text-3xl font-bold text-green-700 mt-1">
                  {freeMonthsEarned}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 space-y-2 text-sm">
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              <strong>Você ganha:</strong> 1 mês Pro grátis quando seu indicado
              assinar
            </span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              <strong>Seu indicado ganha:</strong> 1 mês Pro grátis também!
            </span>
          </div>
          <div className="flex gap-2">
            <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-blue-900">
              <strong>Sem limite:</strong> Indique quantos quiser, ganha pra
              cada um
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seu Link de Referência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-mono"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-500">
            Compartilhe este link com seus amigos para ganhar 1 mês Pro grátis
            quando eles assinarem
          </p>
        </CardContent>
      </Card>

      {/* Share Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compartilhar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={() => window.open(shareLinks.whatsapp, "_blank")}
            className="w-full justify-center gap-2 bg-green-500 hover:bg-green-600"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar no WhatsApp
          </Button>
          <Button
            onClick={() => window.open(shareLinks.twitter, "_blank")}
            variant="outline"
            className="w-full justify-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar no Twitter/X
          </Button>
          <Button
            onClick={() => window.open(shareLinks.linkedin, "_blank")}
            variant="outline"
            className="w-full justify-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar no LinkedIn
          </Button>
          <Button
            onClick={() => window.open(shareLinks.email, "_blank")}
            variant="outline"
            className="w-full justify-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Enviar por E-mail
          </Button>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-base">Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Badge className="flex-shrink-0">1</Badge>
            <div>
              <p className="font-medium">Compartilhe seu link</p>
              <p className="text-slate-600">
                Mande para amigos, colegas, redes sociais
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge className="flex-shrink-0">2</Badge>
            <div>
              <p className="font-medium">Eles se registram</p>
              <p className="text-slate-600">
                Usam seu link para criar conta no PrestaCerto
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge className="flex-shrink-0">3</Badge>
            <div>
              <p className="font-medium">Eles assinam Pro</p>
              <p className="text-slate-600">
                Quando assinarem qualquer plano Pro, vocês ganham 1 mês grátis
                cada um
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge className="flex-shrink-0">4</Badge>
            <div>
              <p className="font-medium">Crédito é ativado</p>
              <p className="text-slate-600">
                Vira crédito automático na sua conta, instantaneamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-slate-900">
            Posso ganhar quantos meses quiser?
          </p>
          <p className="text-slate-500 mt-1">
            Sim! Não há limite. A cada indicação que vira pagante, você ganha 1
            mês.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Como o crédito é usado?</p>
          <p className="text-slate-500 mt-1">
            Aparece como R$ 49-99 de crédito (depende do plano) na sua conta.
            Cancela a renovação automática.
          </p>
        </div>
        <div>
          <p className="font-medium text-slate-900">
            Meu amigo ganha algo também?
          </p>
          <p className="text-slate-500 mt-1">
            Sim! Quando ele assina Pro pela primeira vez, ganha 1 mês grátis
            também.
          </p>
        </div>
      </div>
    </div>
  );
}
