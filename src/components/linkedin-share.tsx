"use client";

import { Linkedin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LinkedInShareProps {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
}

export function LinkedInShareButton({
  title,
  description,
  url = process.env.NEXT_PUBLIC_APP_URL,
  imageUrl,
}: LinkedInShareProps) {
  const handleShare = async () => {
    const linkedInUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
    linkedInUrl.searchParams.set("url", url || "");

    if (navigator.share) {
      // Web Share API
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: abrir em popup
      window.open(linkedInUrl.toString(), "linkedin-share", "width=550,height=680");
      toast.success("Compartilhado no LinkedIn! 🎉");
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className="gap-2 text-blue-600 hover:text-blue-700 border-blue-200"
    >
      <Linkedin className="size-4" />
      Compartilhar
    </Button>
  );
}

// Hook helper pra compartilhar quando algo acontece
export function useLinkedInShare() {
  const shareProjectAccepted = (projectTitle: string, amount: number) => {
    const title = "Novo projeto aceito! 🎉";
    const description = `Acabei de ser contratado para "${projectTitle}" na @PrestaCerto por R$ ${amount}. Sem comissões, pagamento direto! 💰`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

    return { title, description, url };
  };

  const shareProfileCreated = (fullName: string, skills: string[]) => {
    const title = "Sou freelancer na PrestaCerto 🚀";
    const description = `Criei meu perfil como ${skills.join(", ")} na @PrestaCerto. Plataforma sem comissões, 100% pra mim. Vem cá! 👋`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/`;

    return { title, description, url };
  };

  const shareEarnings = (amount: number, projectCount: number) => {
    const title = "Faturei na PrestaCerto! 💰";
    const description = `Já ganhei R$ ${amount} em ${projectCount} projetos na @PrestaCerto, sem pagar comissão pra ninguém. Totalmente independente! 🎯`;
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

    return { title, description, url };
  };

  return { shareProjectAccepted, shareProfileCreated, shareEarnings };
}
