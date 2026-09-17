"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CreateTeamForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Dê um nome pra sua equipe.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível criar a equipe", { description: body?.error });
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="teamName">Nome da equipe</Label>
        <Input
          id="teamName"
          placeholder="Ex: Agência Nova Onda"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button type="button" nativeButton disabled={loading} onClick={handleCreate}>
        {loading ? "Criando..." : "Criar equipe"}
      </Button>
    </div>
  );
}
