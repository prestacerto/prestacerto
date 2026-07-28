"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AcceptProposalButton({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    const res = await fetch(`/api/proposals/${proposalId}/accept`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível aceitar a proposta", {
        description: body?.error,
      });
      return;
    }

    toast.success("Proposta aceita! As outras foram recusadas automaticamente.");
    router.refresh();
  }

  return (
    <Button
      type="button"
      nativeButton
      variant="secondary"
      size="sm"
      disabled={loading}
      onClick={handleAccept}
    >
      {loading ? "Aceitando..." : "Aceitar proposta"}
    </Button>
  );
}
