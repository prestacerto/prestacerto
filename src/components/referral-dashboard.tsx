"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Copy,
  Share2,
  TrendingUp,
  Users,
  Gift,
  Trophy,
} from "lucide-react";

export function ReferralDashboard({ userId }: { userId: string }) {
  const [referralLink, setReferralLink] = useState<string>("");
  const [stats, setStats] = useState({
    totalReferrals: 0,
    monthlyReferrals: 0,
    creditBalance: 0,
    nextBonus: { required: 0, current: 0 },
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateReferralLink();
    loadStats();
  }, []);

  async function generateReferralLink() {
    try {
      const res = await fetch("/api/referral/generate-link", {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setReferralLink(data.referralLink);
    } catch (error) {
      console.error("Erro gerando link:", error);
    }
  }

  async function loadStats() {
    // TODO: Buscar stats do Supabase
    // Por enquanto usando dados mockados
    setStats({
      totalReferrals: 0,
      monthlyReferrals: 0,
      creditBalance: 0,
      nextBonus: { required: 5, current: 0 },
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Partner PrestaCerto</h2>
        <p className="opacity-90">
          Indique uma pessoa. Quando o primeiro pagamento dela for aprovado,
          você recebe via Pix: R$ 25 no plano Pro ou R$ 70 no Business.
        </p>
        <p className="mt-3 text-xs opacity-80">
          A recompensa é direta, sem cadeia de indicações, e fica disponível
          após a validação do pagamento e da elegibilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Referrals */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Users className="size-4" />
              Total de Indicações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              +{stats.monthlyReferrals} este mês
            </p>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Gift className="size-4" />
              Créditos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">R$ {stats.creditBalance}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Próximos pagamentos via Pix
            </p>
          </CardContent>
        </Card>

        {/* Next Bonus */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Trophy className="size-4" />
              Próximo Bônus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.nextBonus.current}/{stats.nextBonus.required}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${(stats.nextBonus.current / stats.nextBonus.required) * 100}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="size-4" />
            Compartilhe seu Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono border border-slate-300 dark:border-slate-600"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors"
            >
              <Copy className="size-4" />
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { icon: "📱", label: "WhatsApp" },
              { icon: "🐦", label: "Twitter" },
              { icon: "💬", label: "Telegram" },
              { icon: "📧", label: "Email" },
            ].map((social) => (
              <button
                key={social.label}
                className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => {
                  const text = `Tá ganhando bem em ${window.location.hostname}? Vem usar PrestaCerto! ${referralLink}`;
                  const urls: Record<string, string> = {
                    WhatsApp: `https://wa.me/?text=${encodeURIComponent(text)}`,
                    Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                    Telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}`,
                    Email: `mailto:?subject=PrestaCerto&body=${encodeURIComponent(text)}`,
                  };
                  window.open(urls[social.label], "_blank");
                }}
              >
                <div className="text-2xl mb-1">{social.icon}</div>
                <div className="text-xs font-medium">{social.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* No fabricated leaderboard or rewards: show the verified program rule. */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="size-4" />
            Regras do Partner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p>• Só conta a primeira indicação direta registrada para aquela pessoa.</p>
          <p>• O pagamento depende de aprovação e validação antifraude.</p>
          <p>• O Pix é solicitado após a conversão confirmada; não há promessa de prazo antes dessa validação.</p>
        </CardContent>
      </Card>
    </div>
  );
}
