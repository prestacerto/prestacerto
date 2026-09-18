import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como o Cadu AI trata dados recebidos pelo site, WhatsApp, demonstrações, diagnósticos e contatos comerciais.',
  alternates: { canonical: '/privacidade' },
};

const updatedAt = '29 de agosto de 2026';

export default function PrivacyPage() {
  return <main className="legal-page">
    <header className="legal-hero shell">
      <Link className="brand" href="/" aria-label="Voltar ao início"><span className="brand-mark">C</span><span>Cadu.</span></Link>
      <p className="eyebrow">PRIVACIDADE E CONFIANÇA</p>
      <h1>Política de Privacidade</h1>
      <p>Esta página explica, em linguagem simples, como tratamos informações enviadas por visitantes, leads e empresas interessadas no Cadu AI.</p>
      <small>Última atualização: {updatedAt}</small>
    </header>

    <section className="legal-content shell">
      <article>
        <h2>1. Quais dados podemos receber</h2>
        <p>Quando você preenche um formulário, conversa pelo WhatsApp, acessa uma demonstração ou solicita um diagnóstico, podemos receber dados como nome, empresa, telefone, e-mail corporativo, volume de leads, mensagem enviada, origem do contato e informações necessárias para entender o atendimento comercial da imobiliária.</p>
      </article>

      <article>
        <h2>2. Como usamos essas informações</h2>
        <p>Usamos os dados para responder solicitações, organizar diagnósticos, entender necessidades da imobiliária, demonstrar o funcionamento do Cadu AI, acompanhar oportunidades comerciais, melhorar a experiência do site e preparar propostas ou pilotos quando houver interesse.</p>
      </article>

      <article>
        <h2>3. Demonstração e uso de IA</h2>
        <p>A demonstração do site serve para mostrar a experiência de conversa. Em operações reais, o Cadu AI pode usar inteligência artificial para apoiar atendimento, qualificação e follow-up, sempre com regras de segurança, limites de resposta e encaminhamento para humanos quando necessário.</p>
      </article>

      <article>
        <h2>4. Compartilhamento de dados</h2>
        <p>Não vendemos dados pessoais. Podemos compartilhar informações apenas com prestadores necessários para operar atendimento, hospedagem, análise, comunicação, CRM, automação, pagamento ou suporte — sempre na medida necessária para prestar o serviço.</p>
      </article>

      <article>
        <h2>5. Cookies, métricas e campanhas</h2>
        <p>Podemos usar cookies, identificadores técnicos e ferramentas de analytics para entender visitas, origem de campanhas, cliques em botões e conversões. Se ferramentas como Google Analytics, Meta Pixel ou similares forem ativadas, elas serão usadas para medir desempenho e melhorar campanhas.</p>
      </article>

      <article>
        <h2>6. Segurança e retenção</h2>
        <p>Adotamos medidas razoáveis para proteger os dados contra acesso indevido, perda, alteração ou uso não autorizado. Mantemos informações pelo tempo necessário para atendimento, obrigações legais, histórico comercial e melhoria do serviço.</p>
      </article>

      <article>
        <h2>7. Seus direitos</h2>
        <p>Você pode solicitar acesso, correção, atualização ou exclusão de dados, quando aplicável. Também pode pedir informações sobre o tratamento de dados ou retirar consentimentos concedidos, respeitadas obrigações legais e contratuais.</p>
      </article>

      <article>
        <h2>8. Contato</h2>
        <p>Para falar sobre privacidade, dados ou solicitações relacionadas a esta política, entre em contato pelo WhatsApp oficial disponível no site ou pelo canal comercial informado pelo Cadu AI.</p>
      </article>
    </section>
  </main>;
}
