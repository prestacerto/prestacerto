"use client";

import { Button } from "@/components/ui/button";
import { Linkedin } from "lucide-react";

export function LinkedInLoginButton() {
  const handleLinkedInLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`;
    const state = Math.random().toString(36).substring(7);
    
    // Guardar state na sessão pra validar depois
    sessionStorage.setItem("linkedin_state", state);

    const scope = encodeURIComponent("profile openid email");
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}`;

    window.location.href = authUrl;
  };

  return (
    <Button
      onClick={handleLinkedInLogin}
      variant="outline"
      className="w-full gap-2"
      size="lg"
    >
      <Linkedin className="size-4" />
      Entrar com LinkedIn
    </Button>
  );
}
