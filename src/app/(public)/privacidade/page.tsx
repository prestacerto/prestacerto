export const metadata = { title: "Política de Privacidade — PrestaCerto" };

const sections = [
  {
    title: "1. Quem trata os seus dados",
    body: `A PrestaCerto é a controladora dos dados pessoais tratados nesta
plataforma, nos termos da Lei Geral de Proteção de Dados (LGPD, Lei nº
13.709/2018). Dúvidas sobre seus dados podem ser enviadas para
contato@prestacerto.com.br.`,
  },
  {
    title: "2. Quais dados coletamos",
    body: `Dados de cadastro: nome, e-mail e senha (ou identificação do login
com Google). Dados de perfil: cidade, estado, bio, foto, habilidades, preço e
prazo de entrega — o que você optar por preencher. Dados de uso: projetos
publicados, propostas enviadas, mensagens, avaliações. Dados de pagamento: a
PrestaCerto NÃO tem acesso a dados de cartão ou conta bancária — quem
processa isso é o Mercado Pago. O que armazenamos é o token de conexão OAuth
do freelancer com o Mercado Pago (necessário pra criar a cobrança em nome
dele) e o status de cada pagamento (pendente, aprovado etc.).`,
  },
  {
    title: "3. Como usamos os dados",
    body: `Usamos seus dados para: criar e manter sua conta; conectar clientes
e freelancers; processar pagamentos via Mercado Pago; calcular sua nota de
avaliação; enviar e-mails operacionais (confirmações, convites de equipe,
notificações); e cumprir obrigações legais.`,
  },
  {
    title: "4. Com quem compartilhamos dados",
    body: `Compartilhamos dados com prestadores que nos ajudam a operar a
plataforma: Supabase (banco de dados e autenticação), Mercado Pago
(processamento de pagamento — só o freelancer conectado recebe o valor, a
PrestaCerto não tem acesso a esse dinheiro) e Resend (envio de e-mails).
Não vendemos dados pessoais a terceiros.`,
  },
  {
    title: "5. Base legal do tratamento",
    body: `Tratamos seus dados com base na execução do contrato (pra você usar
a plataforma), no seu consentimento (quando aplicável, como no cadastro) e no
nosso legítimo interesse em manter a plataforma segura e funcionando
corretamente.`,
  },
  {
    title: "6. Seus direitos",
    body: `Conforme o art. 18 da LGPD, você pode solicitar a qualquer momento:
confirmação de que tratamos seus dados, acesso aos dados, correção de dados
incompletos ou desatualizados, exclusão dos dados (respeitando obrigações
legais de guarda), portabilidade e informação sobre com quem compartilhamos
seus dados. Pra exercer qualquer um desses direitos, escreva pra
contato@prestacerto.com.br.`,
  },
  {
    title: "7. Segurança",
    body: `Seus dados ficam protegidos por Row Level Security no banco de
dados (cada usuário só acessa o que é seu ou o que é público por natureza,
como projetos abertos) e por conexão criptografada (HTTPS). Credenciais
sensíveis, como o token do Mercado Pago, nunca são expostas ao navegador.`,
  },
  {
    title: "8. Retenção de dados",
    body: `Mantemos seus dados enquanto sua conta estiver ativa. Se você pedir
a exclusão da conta, removemos os dados pessoais, exceto o que precisarmos
manter por obrigação legal (por exemplo, registros de transações).`,
  },
  {
    title: "9. Cookies",
    body: `Usamos cookies essenciais para manter sua sessão logada (geridos
pelo Supabase Auth). Não usamos cookies de rastreamento publicitário.`,
  },
  {
    title: "10. Alterações nesta política",
    body: `Podemos atualizar esta política de tempos em tempos. Mudanças
relevantes serão comunicadas na plataforma.`,
  },
];

export default function PrivacidadePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: {new Date().toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-500">
        Dúvidas sobre seus dados? Fale com a gente em{" "}
        <a href="mailto:contato@prestacerto.com.br" className="text-blue-600 hover:underline">
          contato@prestacerto.com.br
        </a>
        .
      </p>
    </div>
  );
}
