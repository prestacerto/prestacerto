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
  ArrowRight,
} from "lucide-react";
import { LinkButton } from "@/components/link-button";

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
        <h2 className="text-2xl font-bold mb-2">Ganhe com Indicações</h2>
        <p className="opacity-90">
          Indique freelancers e ganhe R$ 50 em créditos por cada um que se
          cadastrar
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
              Use em qualquer premium
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

      {/* Leaderboard Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="size-4" />
            Top Indicadores Este Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "João Silva", referrals: 12, bonus: "3 meses grátis" },
              { name: "Maria Costa", referrals: 8, bonus: "1 mês grátis" },
              { name: "Pedro Oliveira", referrals: 5, bonus: "R$ 250" },
            ].map((top, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold w-6 text-center">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {top.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {top.referrals} indicações
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  {top.bonus}
                </div>
              </div>
            ))}
          </div>

          <LinkButton href="/dashboard/referral-leaderboard" className="mt-4 w-full">
            Ver Ranking Completo
            <ArrowRight className="size-4" />
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
