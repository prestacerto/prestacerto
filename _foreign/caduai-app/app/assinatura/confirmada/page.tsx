import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Assinatura confirmada | Cadu AI', robots: { index: false, follow: false } };

export default async function AssinaturaConfirmada({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  return <main className="payment-page"><section className="payment-card"><span className="payment-icon">✓</span><p className="eyebrow">PAGAMENTO CONFIRMADO</p><h1>Bem-vindo ao Cadu.</h1><p>Sua assinatura foi iniciada. Agora vamos organizar a ativação da sua imobiliária e os próximos passos.</p><div className="payment-actions"><Link className="button" href="/dashboard">Ir para o portal <span>↗</span></Link>{sessionId&&<form action="/api/stripe/portal" method="post"><input type="hidden" name="session_id" value={sessionId}/><button type="submit" className="text-button">Gerenciar assinatura</button></form>}</div><small>O comprovante também será enviado pelo Stripe para o e-mail informado no pagamento.</small></section></main>;
}
