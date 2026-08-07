"use client";

import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SURPRISE_REWARDS = [
  { bonus: 50, icon: "🎁", text: "R$ 50 em créditos!" },
  { bonus: 100, icon: "🌟", text: "R$ 100 em créditos!" },
  { bonus: 150, icon: "💎", text: "R$ 150 em créditos!" },
  { bonus: 30, icon: "⚡", text: "R$ 30 em créditos!" },
  { bonus: 75, icon: "🎉", text: "R$ 75 em créditos!" },
];

export function SurpriseRewards({ userId }: { userId: string }) {
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState<typeof SURPRISE_REWARDS[0] | null>(null);
  const [claimed, setClaimed] = useState(false);

  const handleOpen = () => {
    if (claimed) {
      toast.info("Você já abriu sua surpresa hoje! Volta amanhã 🎁");
      return;
    }

    const randomReward = SURPRISE_REWARDS[Math.floor(Math.random() * SURPRISE_REWARDS.length)];
    setReward(randomReward);
    setOpened(true);

    toast.success(`${randomReward.icon} ${randomReward.text}`);
  };

  const handleClaim = async () => {
    if (!reward) return;

    setClaimed(true);
    toast.success(`Créditos adicionados à sua conta!`);

    // TODO: chamar API pra adicionar crédito na conta do usuário
    // await fetch(`/api/users/${userId}/rewards`, {
    //   method: 'POST',
    //   body: JSON.stringify({ bonus: reward.bonus })
    // });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="size-5 text-purple-600" />
          Surpresa do Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Você tem uma surpresa esperando! Clique pra descobrir 🎁
        </p>

        {!opened ? (
          <Button
            onClick={handleOpen}
            className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            <Sparkles className="size-4" />
            Abrir Surpresa
          </Button>
        ) : reward ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-white dark:bg-slate-900 p-6 text-center">
              <p className="text-5xl mb-2">{reward.icon}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {reward.text}
              </p>
            </div>

            {!claimed ? (
              <Button
                onClick={handleClaim}
                className="w-full gap-2 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <Gift className="size-4" />
                Reclamar Créditos
              </Button>
            ) : (
              <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 text-center">
                <p className="text-sm font-bold text-green-700 dark:text-green-200">
                  ✅ Créditos adicionados!
                </p>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
