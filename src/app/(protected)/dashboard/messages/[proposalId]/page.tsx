import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MessageThread } from "@/components/message-thread";
import { AgreementPanel } from "@/components/agreements/agreement-panel";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { getMessagesForProposal, getProposalThreadInfo } from "@/lib/supabase/queries";

export default async function ProposalMessagesPage({ params }: { params: Promise<{ proposalId: string }> }) {
  const [{ proposalId }, user] = await Promise.all([params, getAuthenticatedUser()]);
  if (!user) notFound();
  const [proposal, messages] = await Promise.all([getProposalThreadInfo(proposalId), getMessagesForProposal(proposalId)]);
  if (!proposal) notFound();
  if (proposal.freelancer_id !== user.id && proposal.project?.client_id !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/messages" className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-950"><ArrowLeft className="mr-2 size-4" />Todas as conversas</Link>
      <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">{proposal.project?.title ?? "Conversa do projeto"}</h1>
      <p className="mt-2 text-sm text-slate-500">Converse sobre escopo, entregas e próximos passos dentro do PrestaCerto.</p>
      {proposal.status === "accepted" && <div className="mt-6"><AgreementPanel proposalId={proposalId} currentUserId={user.id} /></div>}
      <div className="mt-6"><MessageThread proposalId={proposalId} messages={messages} currentUserId={user.id} /></div>
    </div>
  );
}
