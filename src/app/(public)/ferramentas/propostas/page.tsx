import { CommercialProposalBuilder } from '@/components/tools/commercial-proposal-builder';
import { getAuthenticatedUser, getProfile } from '@/lib/auth/getUser';
import { getPageMetadata } from '@/lib/seo/metadata';
import { canUseBrandedProposal } from '@/lib/tools/commercial-proposal';
import { isAssinyCheckoutReady } from '@/lib/payments/assiny-readiness';

export const metadata = getPageMetadata('Gerador de proposta comercial grátis em PDF', 'Crie uma proposta comercial com escopo, entregas, preço e prazo. Baixe o PDF grátis, salve propostas no navegador e organize retornos aos clientes com o Certo Propostas.', '/ferramentas/propostas');
export default async function ProposalToolPage() {
  const [user, profile] = await Promise.all([getAuthenticatedUser(), getProfile()]);
  return <div className="bg-gradient-to-b from-blue-50/50 via-white to-white"><CommercialProposalBuilder key={user?.id || 'guest'} userId={user?.id ?? null} paid={canUseBrandedProposal(profile?.plan)} checkoutReady={isAssinyCheckoutReady()}/>
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6" aria-labelledby="proposal-help"><h2 id="proposal-help" className="text-2xl font-bold text-slate-900">O que uma proposta comercial precisa ter?</h2><div className="mt-6 grid gap-6 sm:grid-cols-3">{[
      ['Escopo claro', 'Explique o problema que será resolvido e liste as entregas. Registre também revisões, materiais necessários e o que fica fora do trabalho.'],
      ['Preço e condições', 'Detalhe os valores, a quantidade de cada entrega e as condições de pagamento. Use seus custos e o tempo de trabalho para definir o orçamento.'],
      ['Um próximo passo', 'Informe prazo de entrega e validade da proposta. Depois de enviar, marque uma data de retorno para acompanhar a decisão do cliente.'],
    ].map(([title, description]) => <div key={title}><h3 className="font-bold text-slate-800">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{description}</p></div>)}</div><p className="mt-8 border-t border-slate-200 pt-6 text-sm leading-7 text-slate-500">O Certo Propostas cria documentos comerciais a partir das informações que você preenche. Não envia propostas ao marketplace nem aos seus clientes automaticamente. A biblioteca fica apenas neste navegador; limpar os dados do site remove os documentos salvos aqui.</p></section>
  </div>;
}
