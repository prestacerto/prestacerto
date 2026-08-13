import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTeamForm } from "@/components/team/create-team-form";
import { InviteMemberForm } from "@/components/team/invite-member-form";
import { InviteLinkRow } from "@/components/team/invite-link-row";
import { getAuthenticatedUser, getProfile } from "@/lib/auth/getUser";
import {
  getTeamForOwner,
  getTeamMembers,
  getTeamInvites,
  TEAM_SEAT_LIMIT,
} from "@/lib/supabase/queries";

export const metadata = { title: "Minha equipe — Dashboard PrestaCerto" };

export default async function DashboardTeamPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const profile = await getProfile();

  if (profile?.plan !== "business") {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Minha equipe</h1>
        <Card className="mt-6 flex flex-col items-center p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Users className="size-6" />
          </span>
          <p className="mt-4 font-medium text-slate-700">
            Gerenciar uma equipe é um recurso do plano Business.
          </p>
          <Link href="/plans" className="mt-2 text-sm text-blue-600 hover:underline">
            Ver planos
          </Link>
        </Card>
      </div>
    );
  }

  const team = await getTeamForOwner(user.id);

  if (!team) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Minha equipe</h1>
        <p className="mt-1 text-sm text-slate-500">
          Crie sua equipe pra convidar até {TEAM_SEAT_LIMIT - 1} pessoas.
        </p>
        <Card className="mt-6 p-6">
          <CreateTeamForm />
        </Card>
      </div>
    );
  }

  const [members, invites] = await Promise.all([
    getTeamMembers(team.id),
    getTeamInvites(team.id),
  ]);

  const pendingInvites = invites.filter((i) => i.status === "pending");
  const seatsUsed = 1 + members.length + pendingInvites.length;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{team.name}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {seatsUsed} de {TEAM_SEAT_LIMIT} vagas usadas.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Membros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <p className="text-sm font-medium text-slate-900">
              {profile?.full_name} <span className="text-slate-400">(você, dono)</span>
            </p>
          </div>
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
            >
              <p className="text-sm font-medium text-slate-900">{member.full_name}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Convidar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InviteMemberForm disabled={seatsUsed >= TEAM_SEAT_LIMIT} />
          {seatsUsed >= TEAM_SEAT_LIMIT && (
            <p className="text-xs text-amber-600">
              Sua equipe atingiu o limite de {TEAM_SEAT_LIMIT} pessoas.
            </p>
          )}
          <p className="text-xs text-slate-400">
            Enviamos um convite por e-mail automaticamente. Se preferir mandar por
            WhatsApp ou outro canal, o link também fica disponível abaixo.
          </p>

          {pendingInvites.length > 0 && (
            <div className="space-y-2 pt-2">
              {pendingInvites.map((invite) => (
                <InviteLinkRow
                  key={invite.id}
                  inviteId={invite.id}
                  email={invite.email}
                  link={`${siteUrl}/invite/${invite.token}`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
