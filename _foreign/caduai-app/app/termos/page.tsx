import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Condições gerais de uso do site, demonstração, diagnóstico e materiais comerciais do Cadu AI.',
  alternates: { canonical: '/termos' },
};

const updatedAt = '29 de agosto de 2026';

export default function TermsPage() {
  return <main className="legal-page">
    <header className="legal-hero shell">
      <Link className="brand" href="/" aria-label="Voltar ao início"><span className="brand-mark">C</span><span>Cadu.</span></Link>
      <p className="eyebrow">TERMOS E TRANSPARÊNCIA</p>
      <h1>Termos de Uso</h1>
      <p>Estes termos organizam o uso do site, da demonstração e dos canais de contato do Cadu AI.</p>
      <small>Última atualização: {updatedAt}</small>
    </header>

    <section className="legal-content shell">
      <article>
        <h2>1. Sobre o Cadu AI</h2>
        <p>O Cadu AI é uma solução de inteligência de atendimento e receita para imobiliárias, criada para apoiar primeira resposta, qualificação, acompanhamento de leads, handoff para corretores e organização de próximos passos.</p>
      </article>

      <article>
        <h2>2. Uso do site e da demonstração</h2>
        <p>O site apresenta informações comerciais, simulações e uma demonstração de conversa. A demonstração não representa disponibilidade real de imóveis, valores finais, proposta contratual ou compromisso automático de atendimento.</p>
      </article>

      <article>
        <h2>3. Diagnósticos, pilotos e propostas</h2>
        <p>Diagnósticos e propostas são avaliados caso a caso, conforme volume de leads, canais usados, CRM, maturidade da operação, integrações necessárias e critérios de resultado definidos entre as partes.</p>
      </article>

      <article>
        <h2>4. Informações e responsabilidade do usuário</h2>
        <p>Ao enviar dados pelo site ou WhatsApp, você declara que as informações são verdadeiras e que possui autorização para representar a empresa ou conversar sobre a operação comercial informada.</p>
      </article>

      <article>
        <h2>5. Limites da IA</h2>
        <p>Inteligência artificial pode apoiar respostas, triagem e organização de contexto, mas não deve ser usada como fonte única para decisões sensíveis. Em operações reais, o Cadu AI deve operar com base em fontes autorizadas e encaminhar situações ambíguas para acompanhamento humano.</p>
      </article>

      <article>
        <h2>6. Planos, preços e pagamentos</h2>
        <p>Valores exibidos no site podem representar modelos de referência, faixas comerciais ou exemplos de contratação. Assinaturas, recorrência, success fee, integrações e condições finais dependem de proposta, aceite e configuração de pagamento quando aplicável.</p>
      </article>

      <article>
        <h2>7. Propriedade intelectual</h2>
        <p>Marca, textos, identidade visual, demonstrações, layouts e materiais do Cadu AI pertencem aos seus responsáveis ou licenciadores. O uso do site não concede direito de copiar, revender ou explorar comercialmente esses materiais sem autorização.</p>
      </article>

      <article>
        <h2>8. Alterações</h2>
        <p>Podemos atualizar estes termos para refletir mudanças no produto, na operação, em integrações, em modelos comerciais ou em exigências legais. A versão mais recente será publicada nesta página.</p>
      </article>

      <article>
        <h2>9. Contato</h2>
        <p>Para dúvidas sobre estes termos, propostas ou uso do Cadu AI, fale com o time pelo WhatsApp ou canal comercial indicado no site.</p>
      </article>
    </section>
  </main>;
}
