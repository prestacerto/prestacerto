"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CompleteProjectButton({
  projectId,
  userId,
}: {
  projectId: string;
  userId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    const res = await fetch(`/api/projects/${projectId}/complete`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error("Não foi possível encerrar o projeto", { description: body?.error });
      return;
    }

    toast.success("Projeto encerrado — agora vocês já podem se avaliar.");

    // Momento de maior satisfação — projeto acabou de dar certo. É quando a
    // taxa de indicação real é maior, por isso o convite aparece aqui.
    if (userId) {
      setTimeout(() => {
        toast("Curtiu a experiência? Indique a PrestaCerto", {
          description: "Copie seu link e ganhe recompensa quando seu indicado fizer o primeiro projeto.",
          action: {
            label: "Copiar link",
            onClick: () => {
              const link = `${window.location.origin}/register?ref=${userId}`;
              navigator.clipboard.writeText(link);
              toast.success("Link copiado!");
            },
          },
        });
      }, 1500);
    }

    router.refresh();
  }

  return (
    <Button type="button" nativeButton disabled={loading} onClick={handleComplete}>
      {loading ? "Encerrando..." : "Marcar como concluído"}
    </Button>
  );
}
