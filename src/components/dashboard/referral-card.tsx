"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Gift, Share2, Trophy } from "lucide-react";
import { toast } from "sonner";

interface ReferralCardProps {
  userId: string;
  monthCompleted: number;
  totalCompleted: number;
  remainingForBusiness: number;
}

const BUSINESS_TIER_THRESHOLD = 5;

export function ReferralCard({
  userId,
  monthCompleted,
  totalCompleted,
  remainingForBusiness,
}: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState(`https://prestacerto.com.br/register?ref=${userId}`);

  useEffect(() => {
    let active = true;

    fetch("/api/referral/generate-code", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (active && data.referral_link) setLink(data.referral_link);
        if (active && data.code && !data.referral_link) {
          setLink(`https://prestacerto.com.br/register?ref=${data.code}`);
        }
      })
      .catch(() => {
        // O UUID continua funcionando como fallback para links antigos.
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min(
    100,
    Math.round((monthCompleted / BUSINESS_TIER_THRESHOLD) * 100)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Gift className="size-4 text-blue-500" />
          Indique e cresça junto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500">
          Convide um cliente ou freelancer. Quando ele completa o perfil, vocês desbloqueiam benefícios; quando a assinatura é aprovada, você recebe crédito interno. Vale apenas pela sua indicação direta — sem cadeia de recrutamento.
        </p>

        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
            onFocus={(e) => e.currentTarget.select()}
          />
          <Button type="button" nativeButton variant="outline" size="sm" onClick={handleCopy} aria-label="Copiar link de indicação">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Conheça o PrestaCerto: encontre profissionais confiáveis ou publique seu projeto. ${link}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
            aria-label="Compartilhar no WhatsApp"
          >
            <Share2 className="size-4" />
          </a>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-5 text-blue-900 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-100">
          <strong>Benefício em duas etapas.</strong> O indicado ganha uma vantagem ao completar o perfil; você recebe créditos quando a assinatura dele for confirmada.
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {monthCompleted} de {BUSINESS_TIER_THRESHOLD} indicações este mês
            </span>
            <span className="text-slate-500">{totalCompleted} no total</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {remainingForBusiness > 0
              ? `Faltam ${remainingForBusiness} indicações pagantes pra desbloquear o plano Business este mês`
              : "Você já desbloqueou o Business este mês"}
          </p>
        </div>

        <a href="/indicacoes" className="text-sm font-medium text-blue-600 hover:underline">
          Ver ranking de indicações →
        </a>
      </CardContent>
    </Card>
  );
}
