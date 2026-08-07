"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Trophy } from "lucide-react";
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

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${userId}`
      : `/register?ref=${userId}`;

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
          <Trophy className="size-4 text-amber-500" />
          Indique e ganhe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500">
          Cada pessoa que você indicar e fizer o primeiro pagamento aprovado te dá um upgrade de
          plano. Vale só pela sua indicação direta — não tem ganho por quem a pessoa indicada
          indicar depois.
        </p>

        <div className="flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
            onFocus={(e) => e.currentTarget.select()}
          />
          <Button type="button" nativeButton variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
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
              ? `Faltam ${remainingForBusiness} pra desbloquear o plano Business esse mês`
              : "Você já desbloqueou o Business esse mês 🎉"}
          </p>
        </div>

        <a href="/indicacoes" className="text-sm font-medium text-blue-600 hover:underline">
          Ver ranking de indicações →
        </a>
      </CardContent>
    </Card>
  );
}
