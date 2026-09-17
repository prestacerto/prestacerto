"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CompleteProjectButton({
  projectId,
}: {
  projectId: string;
  userId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
    const res = await fetch(`/api/projects/${projectId}/complete`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível encerrar o projeto", { description: body?.error });
      return;
    }

    toast.success("Projeto concluído.");

    router.refresh();
    } catch { toast.error("Falha de conexão. Tente novamente."); } finally { setLoading(false); }
  }

  return (
    <Button type="button" nativeButton disabled={loading} onClick={handleComplete}>
      {loading ? "Encerrando..." : "Marcar como concluído"}
    </Button>
  );
}
