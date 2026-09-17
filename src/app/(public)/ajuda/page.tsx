import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { StructuredData, getFAQSchema } from "@/components/structured-data";
import { getPageMetadata } from "@/lib/seo/metadata";
export const metadata: Metadata = getPageMetadata(
  "Central de ajuda do PrestaCerto",
  "Veja respostas sobre cadastro, propostas, pagamentos, freelancers, clientes e funcionamento da plataforma PrestaCerto.",
  "/ajuda",
);

const categories = [
  {
    title: "Começando",
    faqs: [
      {
        q: "Como crio uma conta na PrestaCerto?",
        a: "Clique em \"Criar conta\" no topo do site, preencha nome, e-mail e senha. Você pode usar a plataforma como cliente, freelancer, ou os dois.",
      },
      {
        q: "A PrestaCerto cobra alguma coisa pra eu me cadastrar?",
        a: "Não. O plano Grátis não tem cobrança nenhuma — você pode publicar projetos e enviar até 3 propostas por mês sem pagar nada.",
      },
      {
        q: "Preciso pagar comissão sobre os projetos?",
        a: "Nunca. A PrestaCerto não cobra comissão sobre nenhum valor combinado entre cliente e freelancer, em nenhum plano. Cobramos só a assinatura mensal do plano escolhido.",
      },
    ],
  },
  {
    title: "Projetos e propostas",
    faqs: [
      {
        q: "Como publico um projeto?",
        a: "No dashboard, clique em \"Publicar projeto\", descreva o que você precisa, o orçamento e o prazo. Freelancers interessados podem enviar propostas.",
      },
      {
        q: "Quantas propostas posso enviar?",
        a: "No plano Grátis, até 3 por mês. Os planos Pro e Business têm propostas ilimitadas.",
      },
      {
        q: "Como aceito uma proposta?",
        a: "No dashboard do seu projeto, revise as propostas recebidas e clique em \"Aceitar proposta\" na que você escolher. As outras são recusadas automaticamente.",
      },
      {
        q: "Dá pra conversar com o freelancer/cliente antes de fechar?",
        a: "Sim — cada proposta tem um chat próprio na plataforma, acessível pelo link \"Abrir conversa\" no dashboard.",
      },
    ],
  },
  {
    title: "Pagamento",
    faqs: [
      {
        q: "Como funciona o pagamento entre cliente e freelancer?",
        a: "Cliente e profissional combinam e realizam o pagamento do serviço diretamente entre si. Registre o valor, as etapas, os prazos e a forma de pagamento antes de começar. A assinatura da plataforma é separada do pagamento pelo serviço.",
      },
      {
        q: "A plataforma reserva ou libera o pagamento do serviço?",
        a: "Não. Nesta versão, o PrestaCerto não oferece reserva de valores nem liberação por entrega. Marcar um projeto como concluído no painel não movimenta dinheiro.",
      },
      {
        q: "E se o freelancer não entregar o trabalho?",
        a: "Preserve a proposta, as mensagens e os comprovantes. Procure a outra parte e o suporte do PrestaCerto. O suporte pode receber relatos e verificar violações de uso, mas isso não equivale a uma promessa de devolução de valores.",
      },
    ],
  },
  {
    title: "Avaliações e confiança",
    faqs: [
      {
        q: "Quando posso avaliar alguém?",
        a: "Quando as avaliações estiverem disponíveis, o cliente pode avaliar uma vez o profissional cuja proposta foi aceita, depois de marcar o projeto como concluído. A nota e o comentário são públicos no perfil do profissional. Se aparecer uma mensagem de indisponibilidade, tente novamente mais tarde.",
      },
      {
        q: "O que significa o selo de plano pago?",
        a: "O selo indica que o profissional possui um plano pago. Ele não representa verificação de identidade ou garantia sobre o serviço.",
      },
    ],
  },
  {
    title: "Plano Business",
    faqs: [
      {
        q: "Como funciona uma equipe no plano Business?",
        a: "O gerenciamento de equipes está em preparação. A criação de equipes e o envio de convites pelo painel ainda não estão disponíveis.",
      },
      {
        q: "Onde confiro os recursos disponíveis dos planos?",
        a: "Consulte a página de planos e confira os recursos e limites antes de escolher. Recursos marcados como em preparação ainda não estão disponíveis para uso.",
      },
    ],
  },
];

export default function AjudaPage() {
  const faqItems = categories.flatMap((category) =>
    category.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <StructuredData type="FAQPage" data={getFAQSchema(faqItems)} />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Central de ajuda</h1>
        <p className="mt-2 text-slate-500">
          Respostas rápidas pras dúvidas mais comuns. Não achou o que procurava?{" "}
          <a href="/contato" className="text-blue-600 hover:underline">
            Fale com a gente
          </a>
          .
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {categories.map((category) => (
          <div key={category.title}>
            <h2 className="text-lg font-bold text-slate-900">{category.title}</h2>
            <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {category.faqs.map((faq) => (
                <details key={faq.q} className="group p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-slate-900">
                    {faq.q}
                    <ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-slate-500">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
