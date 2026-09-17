"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function InviteMemberForm({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleInvite() {
    if (!email.trim()) {
      toast.error("Informe o e-mail da pessoa que você quer convidar.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/team/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível criar o convite", { description: body?.error });
      return;
    }

    const { emailSent } = await res.json();
    setEmail("");
    toast.success(
      emailSent
        ? "Convite enviado por e-mail!"
        : "Convite criado — copie o link abaixo e envie pra pessoa."
    );
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="inviteEmail">E-mail de quem você quer convidar</Label>
        <Input
          id="inviteEmail"
          type="email"
          placeholder="pessoa@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
        />
      </div>
      <Button type="button" nativeButton disabled={disabled || loading} onClick={handleInvite}>
        {loading ? "Gerando..." : "Gerar convite"}
      </Button>
    </div>
  );
}
