import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MessageThread } from "@/components/message-thread";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getProposalThreadInfo, getMessagesForProposal } from "@/lib/supabase/queries";

interface MessagesPageProps {
  params: Promise<{ proposalId: string }>;
}

export default async function ProposalMessagesPage({ params }: MessagesPageProps) {
  const { proposalId } = await params;
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const thread = await getProposalThreadInfo(proposalId);
  if (!thread || !thread.project) notFound();

  const isFreelancer = thread.freelancer_id === user.id;
  const isClient = thread.project.client_id === user.id;
  if (!isFreelancer && !isClient) redirect("/dashboard");

  const messages = await getMessagesForProposal(proposalId);
  const otherPartyName = isFreelancer
    ? "o cliente"
    : (thread.freelancer?.full_name ?? "o freelancer");

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Link
        href={isClient ? `/dashboard/projects/${thread.project.id}` : "/dashboard/proposals"}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <h1 className="mt-3 text-2xl font-bold text-slate-900">{thread.project.title}</h1>
      <p className="mt-1 text-sm text-slate-500">Conversa com {otherPartyName}</p>

      <Card className="mt-6 p-4">
        <MessageThread
          proposalId={proposalId}
          messages={messages}
          currentUserId={user.id}
        />
      </Card>
    </div>
  );
}
