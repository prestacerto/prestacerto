import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { ProposalForm } from "@/components/proposal-form";
import { ReviewForm } from "@/components/review-form";
import { ConnectMpButton } from "@/components/connect-mp-button";
import { HeldPaymentForm } from "@/components/held-payment-form";
import {
  getProjectById,
  hasSubmittedProposal,
  getAcceptedProposal,
  getMyReviewForProject,
  getPaymentForProject,
  hasMpConnection,
} from "@/lib/firebase/queries";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const paymentStatusLabel: Record<string, string> = {
  pending: "Pagamento pendente",
  authorized: "Pagamento retido — aguardando você confirmar a entrega",
  approved: "Pagamento liberado pro freelancer",
  rejected: "Pagamento recusado",
  expired: "Retenção expirou — dinheiro devolvido pro cliente",
  refunded: "Pagamento reembolsado",
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [project, user] = await Promise.all([
    getProjectById(id),
    getAuthenticatedUser(),
  ]);

  if (!project) {
    notFound();
  }

  const client = project.client;
  const isOwner = user?.id === project.client_id;

  const [alreadyProposed, acceptedProposal] = await Promise.all([
    user && !isOwner ? hasSubmittedProposal(project.id, user.id) : Promise.resolve(false),
    project.status !== "open" ? getAcceptedProposal(project.id) : Promise.resolve(null),
  ]);

  const isAcceptedFreelancer = Boolean(
    user && acceptedProposal && user.id === acceptedProposal.freelancer_id
  );
  const isParticipant = isOwner || isAcceptedFreelancer;
  const alreadyReviewed =
    project.status === "closed" && user && isParticipant
      ? await getMyReviewForProject(project.id, user.id)
      : false;

  const [payment, freelancerHasMpConnection] = await Promise.all([
    project.status !== "open" ? getPaymentForProject(project.id) : Promise.resolve(null),
    acceptedProposal ? hasMpConnection(acceptedProposal.freelancer_id) : Promise.resolve(false),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
          {client?.full_name?.charAt(0) ?? "?"}
        </span>
        <div>
          <p className="font-semibold text-slate-900">{client?.full_name}</p>
        </div>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-slate-900">{project.title}</h1>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.skills.map((skill: string) => (
          <Badge key={skill} variant="secondary" className="font-normal">
            {skill}
          </Badge>
        ))}
      </div>

      <p className="mt-6 whitespace-pre-line text-slate-700">{project.description}</p>

      <div className="mt-8 space-y-4 rounded-xl border border-slate-200 p-4">
        {project.budget_min || project.budget_max ? (
          <div>
            <p className="text-sm font-semibold text-slate-900">Orçamento</p>
            <p className="mt-1 text-lg text-slate-600">
              {project.budget_min && project.budget_max
                ? `R$ ${project.budget_min} - R$ ${project.budget_max}`
                : project.budget_min
                  ? `A partir de R$ ${project.budget_min}`
                  : `Até R$ ${project.budget_max}`}
            </p>
          </div>
        ) : null}

        {project.deadline_days && (
          <div>
            <p className="text-sm font-semibold text-slate-900">Prazo</p>
            <p className="mt-1 text-slate-600">{project.deadline_days} dias</p>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 p-5">
        {project.status !== "open" ? (
          <p className="text-sm text-slate-500">
            Este projeto não está mais recebendo propostas.
          </p>
        ) : isOwner ? (
          <p className="text-sm text-slate-500">
            Este é o seu projeto —{" "}
            <Link href="/dashboard/projects" className="text-blue-600 hover:underline">
              veja as propostas recebidas no dashboard
            </Link>
            .
          </p>
        ) : !user ? (
          <div>
            <p className="text-sm text-slate-500">
              Você precisa entrar na sua conta pra enviar uma proposta.
            </p>
            <LinkButton href="/login" className="mt-4 w-full">
              Entrar
            </LinkButton>
          </div>
        ) : alreadyProposed ? (
          <p className="text-sm text-slate-500">
            Você já enviou uma proposta pra esse projeto. Acompanhe pelo seu{" "}
            <Link href="/dashboard/proposals" className="text-blue-600 hover:underline">
              dashboard
            </Link>
            .
          </p>
        ) : (
          <>
            <h2 className="font-semibold text-slate-900">Enviar proposta</h2>
            <div className="mt-4">
              <ProposalForm projectId={project.id} />
            </div>
          </>
        )}
      </div>

      {project.status !== "open" && isParticipant && (
        <Card className="mt-6 p-5">
          <h2 className="font-semibold text-slate-900">Pagamento</h2>
          <p className="mt-1 text-sm text-slate-500">
            O pagamento é processado pelo Mercado Pago e fica retido até você
            confirmar que o serviço foi entregue — só então cai na conta do
            freelancer. A PrestaCerto nunca chega a receber ou guardar o
            dinheiro.
          </p>

          {payment && (
            <div className="mt-3 space-y-1">
              <Badge variant="secondary">
                {paymentStatusLabel[payment.status] ?? payment.status} · R$ {payment.amount}
              </Badge>
              {payment.status === "authorized" && payment.capture_deadline && (
                <p className="text-xs text-amber-600">
                  Confirme a entrega até{" "}
                  {new Date(payment.capture_deadline).toLocaleDateString("pt-BR")} — depois
                  disso o Mercado Pago cancela a retenção e devolve o valor.
                </p>
              )}
            </div>
          )}

          {isAcceptedFreelancer && !freelancerHasMpConnection && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-600">
                Conecte sua conta Mercado Pago pra poder receber este pagamento.
              </p>
              <ConnectMpButton />
            </div>
          )}

          {isOwner &&
            user &&
            (!payment ||
              payment.status === "pending" ||
              payment.status === "rejected" ||
              payment.status === "expired") &&
            acceptedProposal?.proposed_price && (
              <div className="mt-4">
                {!freelancerHasMpConnection ? (
                  <p className="text-sm text-slate-500">
                    Aguardando o freelancer conectar a conta Mercado Pago para receber.
                  </p>
                ) : (
                  <HeldPaymentForm
                    projectId={project.id}
                    amount={acceptedProposal.proposed_price}
                    payerEmail={user.email ?? ""}
                  />
                )}
              </div>
            )}

          {isOwner && payment?.status === "authorized" && (
            <p className="mt-4 text-sm text-slate-600">
              Confirme a entrega no{" "}
              <Link href="/dashboard/projects" className="text-blue-600 hover:underline">
                seu dashboard
              </Link>{" "}
              pra liberar o pagamento retido pro freelancer.
            </p>
          )}
        </Card>
      )}

      {project.status === "closed" && isParticipant && (
        <Card className="mt-6 p-5">
          <h2 className="font-semibold text-slate-900">Avaliar</h2>
          {alreadyReviewed ? (
            <p className="mt-2 text-sm text-slate-500">
              Você já avaliou este projeto. Obrigado pelo feedback!
            </p>
          ) : (
            <div className="mt-4">
              <ReviewForm projectId={project.id} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
