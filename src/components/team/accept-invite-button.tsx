"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    const res = await fetch(`/api/team/invites/${token}/accept`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível aceitar o convite", { description: body?.error });
      return;
    }

    toast.success("Bem-vindo(a) à equipe!");
    router.push("/dashboard/team");
    router.refresh();
  }

  return (
    <Button type="button" nativeButton className="w-full" disabled={loading} onClick={handleAccept}>
      {loading ? "Aceitando..." : "Aceitar convite"}
    </Button>
  );
}
