import Link from "next/link";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { AcceptInviteButton } from "@/components/team/accept-invite-button";
import { getInviteByToken } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const [invite, user] = await Promise.all([getInviteByToken(token), getAuthenticatedUser()]);

  const teamName = (invite as unknown as { team: { name: string } | null })?.team?.name;

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Card className="p-6 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Users className="size-6" />
        </span>

        {!invite ? (
          <>
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Convite inválido ou expirado
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Peça pra quem te convidou gerar um novo link.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Você foi convidado(a) pra equipe {teamName}
            </h1>
            <p className="mt-2 text-sm text-slate-500">na PrestaCerto.</p>

            <div className="mt-6">
              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Crie sua conta (ou entre, se já tiver uma) e depois volte a abrir
                    este link pra aceitar o convite.
                  </p>
                  <LinkButton href="/register" className="w-full">
                    Criar conta
                  </LinkButton>
                  <Link
                    href="/login"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Já tenho conta — entrar
                  </Link>
                </div>
              ) : (
                <AcceptInviteButton token={token} />
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
