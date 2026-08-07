"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function GoogleDisconnectButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDisconnect() {
    setLoading(true);
    try {
      const res = await fetch("/api/integrations/google/disconnect", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Google desconectado");
      router.refresh();
    } catch {
      toast.error("Falha ao desconectar o Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={handleDisconnect}
      nativeButton
    >
      {loading ? "Desconectando..." : "Desconectar"}
    </Button>
  );
}
