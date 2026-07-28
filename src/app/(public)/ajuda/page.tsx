import { ChevronDown } from "lucide-react";

export const metadata = { title: "Central de ajuda — PrestaCerto" };

const categories = [
  {
    title: "Começando",
    faqs: [
      {
        q: "Como crio uma conta na PrestaCerto?",
        a: "Clique em \"Criar conta\" no topo do site, preencha e-mail e senha (ou entre com sua conta Google). Você pode usar a plataforma como cliente, freelancer, ou os dois.",
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
        a: "No dashboard, clique em \"Publicar projeto\", descreva o que você precisa, o orçamento e o prazo. Freelancers interessados vão enviar propostas.",
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
        a: "Sim — cada proposta tem um chat próprio na plataforma, acessível pelo link \"Conversar\" no dashboard.",
      },
    ],
  },
  {
    title: "Pagamento",
    faqs: [
      {
        q: "Como funciona o pagamento entre cliente e freelancer?",
        a: "Depois da proposta aceita, o cliente paga pelo checkout do Mercado Pago e o valor vai direto pra conta do freelancer. A PrestaCerto não recebe, não retém e não tem acesso a esse dinheiro em nenhum momento.",
      },
      {
        q: "Por que o freelancer precisa conectar uma conta Mercado Pago?",
        a: "Porque o pagamento é feito por split payment: o dinheiro do cliente vai direto pra conta do Mercado Pago do freelancer, então ele precisa ter (ou criar) uma conta lá e conectá-la à PrestaCerto.",
      },
      {
        q: "E se o freelancer não entregar o trabalho?",
        a: "Como o pagamento não fica retido pela PrestaCerto, recomendamos combinar entregas parciais pra projetos maiores. Disputas sobre o pagamento em si são tratadas diretamente pelo Mercado Pago, seguindo as políticas de proteção da própria plataforma de pagamento.",
      },
    ],
  },
  {
    title: "Avaliações e confiança",
    faqs: [
      {
        q: "Quando posso avaliar alguém?",
        a: "Depois que o projeto for marcado como concluído — o cliente encerra o projeto, e as duas partes ficam liberadas pra se avaliar mutuamente.",
      },
      {
        q: "O que é o badge de verificado?",
        a: "Perfis nos planos Pro e Business recebem um selo de verificado, visível na página de serviços e projetos.",
      },
    ],
  },
  {
    title: "Plano Business",
    faqs: [
      {
        q: "Como funciona uma equipe no plano Business?",
        a: "Você cria uma equipe em \"Minha equipe\" no dashboard e convida até 5 pessoas por e-mail. Elas recebem um link de convite pra entrar.",
      },
      {
        q: "Preciso de plano Business pra ter equipe?",
        a: "Sim, criar e gerenciar equipe é um recurso exclusivo do plano Business.",
      },
    ],
  },
];

export default function AjudaPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
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
