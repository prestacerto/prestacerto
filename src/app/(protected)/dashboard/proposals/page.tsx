import Link from "next/link";
import { Send, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getMyProposals } from "@/lib/firebase/queries";

export const metadata = { title: "Minhas propostas — Dashboard PrestaCerto" };

const statusLabel: Record<string, string> = {
  pending: "Pendente",
  accepted: "Aceita",
  rejected: "Recusada",
  withdrawn: "Retirada",
};

export default async function DashboardProposalsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const proposals = await getMyProposals(user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Minhas propostas</h1>
      <p className="mt-1 text-sm text-slate-500">
        Propostas que você enviou pra projetos publicados por clientes.
      </p>

      {proposals.length === 0 ? (
        <Card className="mt-6 flex flex-col items-center p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Send className="size-6" />
          </span>
          <p className="mt-4 font-medium text-slate-700">
            Você ainda não enviou nenhuma proposta.
          </p>
          <Link href="/projects" className="mt-2 text-sm text-blue-600 hover:underline">
            Ver projetos abertos
          </Link>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                href={proposal.project ? `/projects/${proposal.project.id}` : "#"}
                className="min-w-0 flex-1"
              >
                <Badge variant="secondary">
                  {statusLabel[proposal.status] ?? proposal.status}
                </Badge>
                <h3 className="mt-2 font-semibold text-slate-900 hover:underline">
                  {proposal.project?.title ?? "Projeto removido"}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                  {proposal.message}
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-4">
                {proposal.proposed_price != null && (
                  <span className="font-semibold text-slate-900">
                    R$ {proposal.proposed_price}
                  </span>
                )}
                <Link
                  href={`/dashboard/messages/${proposal.id}`}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <MessageCircle className="size-4" />
                  Conversar
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
