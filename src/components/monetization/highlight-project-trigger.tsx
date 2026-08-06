"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { HighlightProjectModal } from "@/components/monetization/highlight-project-modal";

interface HighlightProjectTriggerProps {
  projectId: string;
  isFeatured: boolean;
  featuredUntil: string | null;
}

export function HighlightProjectTrigger({
  projectId,
  isFeatured,
  featuredUntil,
}: HighlightProjectTriggerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (isFeatured) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Sparkles className="size-3.5 text-amber-500" />
        Destacado
        {featuredUntil &&
          ` até ${new Date(featuredUntil).toLocaleDateString("pt-BR")}`}
      </Badge>
    );
  }

  return (
    <>
      <Button type="button" nativeButton variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Sparkles className="size-4" />
        Destacar projeto
      </Button>
      <HighlightProjectModal
        projectId={projectId}
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
