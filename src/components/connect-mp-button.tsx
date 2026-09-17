import { LinkButton } from "@/components/link-button";

export function ConnectMpButton() {
  return (
    <LinkButton href="/api/mercadopago/oauth/start" variant="outline" size="sm">
      Conectar Mercado Pago para receber
    </LinkButton>
  );
}
