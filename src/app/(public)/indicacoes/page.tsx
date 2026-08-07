import { Trophy, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { getReferralLeaderboard } from "@/lib/supabase/referrals";

export const metadata = { title: "Ranking de indicações — PrestaCerto" };

const MEDAL_COLOR = ["text-amber-500", "text-slate-400", "text-amber-700"];

export default async function IndicacoesPage() {
  const leaderboard = await getReferralLeaderboard();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
          <Trophy className="size-4" />
          Ranking do mês
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Quem mais indicou esse mês
        </h1>
        <p className="mt-2 text-slate-500">
          Cada indicação vale quando a pessoa indicada faz o primeiro pagamento aprovado na
          plataforma. Só conta a sua indicação direta — sem ganho em cadeia por quem a pessoa
          indicada indicar depois.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Ninguém no ranking ainda esse mês — seja o primeiro a indicar.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {leaderboard.map((entry, index) => (
                <li
                  key={entry.referrer_id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                        index < 3 ? "bg-slate-100" : "text-slate-400"
                      }`}
                    >
                      {index < 3 ? (
                        <Medal className={`size-4 ${MEDAL_COLOR[index]}`} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="font-medium text-slate-900">{entry.full_name}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {entry.completed_referrals}{" "}
                    {entry.completed_referrals === 1 ? "indicação" : "indicações"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          5 indicações completas no mês desbloqueiam o plano Business automaticamente.
        </p>
        <LinkButton href="/register" className="mt-4">
          Criar minha conta e começar a indicar
        </LinkButton>
      </div>
    </div>
  );
}
