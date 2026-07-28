import { LinkButton } from "@/components/link-button";
import {
  FileText,
  MessagesSquare,
  UserCheck,
  ShieldCheck,
  PackageCheck,
  Star,
  UserPlus,
  Search,
  Wallet,
} from "lucide-react";

export const metadata = { title: "Como funciona — PrestaCerto" };

const clientSteps = [
  {
    icon: FileText,
    title: "Publique um projeto",
    body: "Descreva o que você precisa, o orçamento e o prazo. É grátis e leva menos de 5 minutos.",
  },
  {
    icon: MessagesSquare,
    title: "Receba propostas e converse",
    body: "Freelancers interessados enviam propostas com preço e prazo. Use o chat da plataforma pra tirar dúvidas antes de decidir.",
  },
  {
    icon: UserCheck,
    title: "Escolha e aceite uma proposta",
    body: "Compare perfis, portfólio e avaliações. Ao aceitar, as outras propostas são recusadas automaticamente e o projeto entra em andamento.",
  },
  {
    icon: ShieldCheck,
    title: "Pague com segurança",
    body: "O pagamento é feito pelo checkout do Mercado Pago e vai direto pra conta do freelancer — a PrestaCerto nunca recebe nem retém o valor, e não cobra nenhuma taxa sobre ele.",
  },
  {
    icon: PackageCheck,
    title: "Acompanhe a entrega",
    body: "Continue a conversa pelo chat da plataforma até o trabalho ser concluído.",
  },
  {
    icon: Star,
    title: "Avalie o freelancer",
    body: "Depois de encerrar o projeto, avalie a experiência — isso ajuda outros clientes a escolherem bem.",
  },
];

const freelancerSteps = [
  {
    icon: UserPlus,
    title: "Crie seu perfil",
    body: "Cadastre seus serviços, habilidades, preço por hora e portfólio.",
  },
  {
    icon: Search,
    title: "Encontre projetos",
    body: "Navegue por projetos abertos ou seja encontrado por clientes através dos seus serviços listados.",
  },
  {
    icon: MessagesSquare,
    title: "Envie propostas e converse",
    body: "Mande uma proposta com preço e prazo, e use o chat pra alinhar detalhes com o cliente.",
  },
  {
    icon: Wallet,
    title: "Conecte sua conta Mercado Pago",
    body: "Assim que uma proposta sua for aceita, conecte sua conta pra poder receber o pagamento diretamente.",
  },
  {
    icon: PackageCheck,
    title: "Entregue o trabalho",
    body: "Combine os detalhes pelo chat e entregue dentro do prazo combinado.",
  },
  {
    icon: Star,
    title: "Receba 100% e seja avaliado",
    body: "O valor cai direto na sua conta, sem desconto. Depois do projeto encerrado, cliente e freelancer se avaliam.",
  },
];

function StepList({ steps }: { steps: typeof clientSteps }) {
  return (
    <ol className="mt-8 space-y-6">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <step.icon className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600">
              PASSO {i + 1}
            </p>
            <h3 className="font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Como funciona</h1>
        <p className="mt-2 text-slate-500">
          Simples, direto e sem comissão — de um lado ou do outro.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pra quem contrata</h2>
          <StepList steps={clientSteps} />
          <LinkButton href="/dashboard/projects/new" className="mt-8">
            Publicar um projeto
          </LinkButton>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Pra quem trabalha</h2>
          <StepList steps={freelancerSteps} />
          <LinkButton href="/register" variant="outline" className="mt-8">
            Criar meu perfil
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
