import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Pagamento não concluído | Cadu AI', robots: { index: false, follow: false } };

export default function AssinaturaCancelada() {
  return <main className="payment-page"><section className="payment-card"><span className="payment-icon payment-icon-muted">←</span><p className="eyebrow">PAGAMENTO NÃO CONCLUÍDO</p><h1>Tudo bem.</h1><p>Nenhuma cobrança foi feita. Você pode voltar aos planos ou conversar com o Cadu antes de decidir.</p><div className="payment-actions"><Link className="button" href="/#modelo">Voltar aos planos <span>↗</span></Link><a className="text-button" href="https://wa.me/5513988251275?text=Ol%C3%A1%2C%20Cadu!%20Tenho%20uma%20d%C3%BAvida%20sobre%20a%20assinatura.">Tirar uma dúvida</a></div></section></main>;
}
