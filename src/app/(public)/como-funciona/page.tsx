import { LinkButton } from "@/components/link-button";
import { getPageMetadata } from "@/lib/seo/metadata";
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

export const metadata = getPageMetadata(
  "Como funciona o PrestaCerto para clientes e freelancers",
  "Entenda como publicar um projeto, receber propostas, contratar com clareza e usar o PrestaCerto para trabalhar sem comissão por projeto.",
  "/como-funciona",
);

const clientSteps = [
  {
    icon: FileText,
    title: "Publique um projeto",
    body: "Descreva o que você precisa, o orçamento e o prazo. A publicação é gratuita.",
  },
  {
    icon: MessagesSquare,
    title: "Receba propostas e converse",
    body: "Freelancers interessados enviam propostas com preço e prazo. Use o chat da plataforma pra tirar dúvidas antes de decidir.",
  },
  {
    icon: UserCheck,
    title: "Escolha e aceite uma proposta",
    body: "Compare a apresentação dos profissionais e as propostas recebidas. Ao aceitar, as outras propostas são recusadas automaticamente e o projeto entra em andamento.",
  },
  {
    icon: ShieldCheck,
    title: "Combine o pagamento",
    body: "Cliente e profissional combinam e realizam o pagamento diretamente entre si. Registre valor, etapas, prazo e forma de pagamento antes de começar.",
  },
  {
    icon: PackageCheck,
    title: "Acompanhe a entrega",
    body: "Continue a conversa pelo chat da plataforma até o trabalho ser concluído.",
  },
  {
    icon: Star,
    title: "Confira a entrega",
    body: "Confira se as entregas correspondem ao combinado e registre a conclusão do projeto no painel. Isso não movimenta dinheiro.",
  },
];

const freelancerSteps = [
  {
    icon: UserPlus,
    title: "Crie seu perfil",
    body: "Preencha seu perfil com uma apresentação profissional e sua localização.",
  },
  {
    icon: Search,
    title: "Encontre projetos",
    body: "Explore projetos abertos e escolha trabalhos compatíveis com sua experiência.",
  },
  {
    icon: MessagesSquare,
    title: "Envie propostas e converse",
    body: "Mande uma proposta com preço e prazo, e use o chat pra alinhar detalhes com o cliente.",
  },
  {
    icon: Wallet,
    title: "Combine como receber",
    body: "Alinhe com o cliente a forma de pagamento, as etapas e os prazos antes de iniciar o serviço.",
  },
  {
    icon: PackageCheck,
    title: "Entregue o trabalho",
    body: "Combine os detalhes pelo chat e entregue dentro do prazo combinado.",
  },
  {
    icon: Star,
    title: "Conclua o combinado",
    body: "Confirme com o cliente a entrega e o pagamento combinado. O PrestaCerto não cobra comissão sobre o valor do serviço.",
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
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="rounded-[2rem] border border-blue-100 bg-[#f4f7ff] px-6 py-10 text-center sm:px-10 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Transparência do começo ao fim</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">Como funciona o PrestaCerto</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Para quem contrata e para quem trabalha: menos ruído, mais clareza para conversar, combinar e seguir com segurança.
        </p>
      </section>

      <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">1. Comece</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">Publique um projeto ou crie seu perfil.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">2. Compare</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">Converse, alinhe escopo, prazo e valor.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">3. Feche</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">Siga com um acordo mais claro para os dois lados.</p>
        </div>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pra quem contrata</h2>
          <StepList steps={clientSteps} />
          <LinkButton href="/publicar-projeto" className="mt-8">
            Publicar um projeto
          </LinkButton>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">Pra quem trabalha</h2>
          <StepList steps={freelancerSteps} />
          <LinkButton href="/register?role=freelancer" variant="outline" className="mt-8">
            Criar meu perfil
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
