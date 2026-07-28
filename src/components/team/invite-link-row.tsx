"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InviteLinkRow({
  inviteId,
  email,
  link,
}: {
  inviteId: string;
  email: string;
  link: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  }

  async function handleRevoke() {
    setLoading(true);
    const res = await fetch(`/api/team/invites/${inviteId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      toast.error("Não foi possível cancelar o convite.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">{email}</p>
        <p className="truncate text-xs text-slate-400">{link}</p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <Button type="button" nativeButton variant="ghost" size="icon-sm" onClick={handleCopy}>
          <Copy className="size-4" />
        </Button>
        <Button
          type="button"
          nativeButton
          variant="ghost"
          size="icon-sm"
          disabled={loading}
          onClick={handleRevoke}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
