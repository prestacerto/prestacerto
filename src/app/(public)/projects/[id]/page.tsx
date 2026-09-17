import { indexingRobots } from '@/lib/seo/discovery';
import { cache } from 'react';
import { getPageMetadata, getNoIndexMetadata, describePage } from '@/lib/seo/metadata';
import { notFound } from "next/navigation";
import Link from "next/link";
import { HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/link-button";
import { ProposalForm } from "@/components/proposal-form";
import { ProjectReviewSection } from "@/components/projects/project-review-section";
import {
  getProjectById,
  hasSubmittedProposal,
  getAcceptedProposal,
  getProjectSharedFolder,
} from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

const getItemForMetadata = cache(getProjectById);

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const item = await getItemForMetadata(id);
  if (!item) return getNoIndexMetadata("Projeto não encontrado");
  return {
    ...getPageMetadata(item.title, describePage(item.description, 'Veja os detalhes deste projeto no PrestaCerto.'), `/projects/${item.id}`),
    ...(item.status !== 'open' ? { robots: indexingRobots(false) } : {}),
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [project, user] = await Promise.all([
    getItemForMetadata(id),
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

  const projectFolder = isParticipant ? await getProjectSharedFolder(project.id) : null;

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
            <Link href={`/dashboard/projects/${project.id}`} className="text-blue-600 hover:underline">
              veja e responda às propostas recebidas
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
              <ProposalForm projectId={project.id} projectTitle={project.title} />
            </div>
          </>
        )}
      </div>

      {project.status !== "open" && isParticipant && (
        <Card className="mt-6 p-5">
          <h2 className="font-semibold text-slate-900">Pagamento combinado entre vocês</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Cliente e profissional combinam diretamente o valor, o prazo e a forma de pagamento.
            Confirme as entregas e as condições antes de iniciar o serviço. O PrestaCerto não recebe nem retém esse pagamento.
          </p>
        </Card>
      )}

      {isParticipant && projectFolder?.drive_folder_url && (
        <Card className="mt-6 p-5">
          <div className="flex items-center gap-2">
            <HardDrive className="size-4 text-blue-600" />
            <h2 className="font-semibold text-slate-900">Pasta do projeto</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Pasta compartilhada no Google Drive pra entrega e troca de arquivos.
          </p>
          <Link
            href={projectFolder.drive_folder_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <HardDrive className="size-3.5" />
            Abrir pasta no Drive
          </Link>
        </Card>
      )}

      <ProjectReviewSection projectId={project.id} clientId={project.client_id} status={project.status}
        acceptedFreelancerId={acceptedProposal?.freelancer_id} userId={user?.id} />
    </div>
  );
}
