import { getPageMetadata } from '@/lib/seo/metadata';
export const metadata = getPageMetadata('Termos de uso', 'Conheça as condições de uso do PrestaCerto, as responsabilidades de clientes e profissionais e as regras da plataforma.', "/termos");

const sections = [
  {
    title: "1. O que é a PrestaCerto",
    body: `A PrestaCerto é uma plataforma que conecta freelancers e clientes.
Nosso papel é intermediar o encontro entre as partes — não somos empregadores
de nenhum freelancer, não somos parte do contrato de prestação de serviço
firmado entre cliente e freelancer, e não garantimos a qualidade, prazo ou
resultado de nenhum trabalho realizado através da plataforma.`,
  },
  {
    title: "2. Cadastro e conta",
    body: `Para usar a maior parte dos recursos você precisa criar uma conta com
e-mail e senha (ou login com Google). Você é responsável por manter suas
credenciais em sigilo e por tudo que acontecer usando sua conta. As
informações fornecidas no cadastro precisam ser verdadeiras.`,
  },
  {
    title: "3. Planos e assinatura",
    body: `Cobramos por assinatura mensal (planos Grátis, Pro e Business), nunca
por comissão sobre o valor dos projetos. O plano Grátis não tem cobrança. As assinaturas dos planos pagos são
processadas pelo Assiny. Recursos marcados como em preparação não estão
disponíveis para compra. Os planos pagos podem ser cancelados a qualquer momento, e o cancelamento vale a
partir do fim do ciclo já pago.`,
  },
  {
    title: "4. Pagamento entre cliente e freelancer",
    body: `Nesta versão, cliente e profissional combinam e realizam o pagamento
do serviço diretamente entre si. O PrestaCerto não oferece, nesta etapa,
reserva de valores, liberação por entrega ou garantia automática de reembolso.
Marcar um projeto como concluído no painel não movimenta dinheiro.
Antes de contratar, registre escopo, valor, etapas, prazos, critérios de aceite
e condições de cancelamento. Mensagens de usuários e comprovantes enviados
no chat não representam confirmação de saldo protegido pela plataforma.

Está planejada a integração com o Assiny para reservar e liberar valores
conforme a entrega. Essa funcionalidade ainda não está ativa no PrestaCerto.
Quando disponível, suas regras específicas serão apresentadas antes do
pagamento: aceite, contestação, devolução, tarifas e responsabilidades.
A assinatura da plataforma é separada do pagamento pelo serviço profissional.

Em caso de serviço não entregue ou divergência, preserve a proposta, mensagens
e comprovantes. Procure a outra parte e o suporte do PrestaCerto. O suporte
pode receber relatos e verificar violações de uso; isso não equivale a uma
promessa de devolução de valores. Permanecem disponíveis os canais do
provedor de pagamento e os meios legais aplicáveis.`,
  },
  {
    title: "5. Avaliações",
    body: `Quando o recurso estiver disponível, o cliente pode avaliar o profissional
com proposta aceita após concluir o projeto, uma vez por projeto. A nota e o
comentário são públicos. As avaliações precisam refletir experiências reais — é proibido
criar avaliações falsas, manipular avaliações (inclusive contratando ou
pedindo avaliações de quem não participou do projeto), ou usar avaliações
para assediar ou difamar outro usuário. Avaliações que violarem isso podem
ser removidas e a conta responsável, suspensa.`,
  },
  {
    title: "6. Conduta do usuário",
    body: `Ao usar a PrestaCerto você concorda em não: publicar conteúdo ilegal,
enganoso ou que viole direitos de terceiros; tentar contornar o modelo de
assinatura criando múltiplas contas; usar a plataforma para fins fraudulentos;
ou tentar acessar dados de outros usuários sem autorização.`,
  },
  {
    title: "7. Propriedade intelectual",
    body: `A marca PrestaCerto, o layout e o código da plataforma são de nossa
propriedade. O conteúdo que você publica (descrições de projetos, portfólio,
avaliações) continua seu — ao publicar, você nos dá permissão para exibir esse
conteúdo dentro da plataforma.`,
  },
  {
    title: "8. Limitação de responsabilidade",
    body: `O PrestaCerto não promete contratação, renda ou seleção para vagas.
Ferramentas de apoio à escrita exigem revisão do usuário e podem apresentar
erros. A disponibilidade dos recursos é informada na interface. Clientes,
profissionais e a plataforma respondem por suas condutas e obrigações conforme
a legislação aplicável. Estes termos não afastam direitos ou responsabilidades
que não possam ser excluídos por contrato.`,
  },
  {
    title: "9. Suspensão e encerramento de conta",
    body: `Podemos suspender ou encerrar contas que violem estes termos,
mediante aviso sempre que possível. Você pode encerrar sua conta a qualquer
momento entrando em contato conosco.`,
  },
  {
    title: "10. Alterações nestes termos",
    body: `Podemos atualizar estes termos de tempos em tempos. Mudanças
relevantes serão comunicadas na plataforma. O uso continuado depois de uma
alteração significa que você concorda com os novos termos.`,
  },
  {
    title: "11. Legislação aplicável",
    body: `Estes termos são regidos pelas leis brasileiras. Qualquer disputa
será resolvida no foro da comarca do domicílio do usuário, conforme o Código
de Defesa do Consumidor, quando aplicável.`,
  },
];

export default function TermosPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Termos de uso</h1>
      <p className="mt-2 text-sm text-slate-500">
        Última atualização: 10 de setembro de 2026
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
        Dúvidas sobre estes termos? Fale com a gente em{" "}
        <a href="mailto:contato@prestacerto.com.br" className="text-blue-600 hover:underline">
          contato@prestacerto.com.br
        </a>
        .
      </p>
    </div>
  );
}
