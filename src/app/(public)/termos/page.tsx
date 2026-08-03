export const metadata = { title: "Termos de uso — PrestaCerto" };

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
por comissão sobre o valor dos projetos. O plano Grátis não tem cobrança. Os
planos pagos podem ser cancelados a qualquer momento, e o cancelamento vale a
partir do fim do ciclo já pago.`,
  },
  {
    title: "4. Pagamento entre cliente e freelancer",
    body: `O pagamento por um projeto é combinado diretamente entre cliente e
freelancer e processado pelo Mercado Pago através de split payment com
retenção: ao pagar, o valor fica reservado pelo Mercado Pago (não é
transferido de imediato) até o cliente confirmar que o serviço foi entregue.
Após a confirmação, o valor é liberado integralmente para a conta do
freelancer no Mercado Pago. Se o cliente não confirmar a entrega em até 5
dias corridos, a retenção expira automaticamente e o valor retorna para o
cliente. Em nenhum momento a PrestaCerto recebe, retém ou tem acesso ao
dinheiro — quem retém e libera é o próprio Mercado Pago, sob autorização. A
PrestaCerto não é responsável por disputas de pagamento, estornos ou
chargebacks — esses casos são tratados diretamente pelo Mercado Pago,
conforme os termos e as políticas de proteção ao comprador/vendedor da
própria plataforma de pagamento.`,
  },
  {
    title: "5. Avaliações",
    body: `Depois de um projeto concluído, cliente e freelancer podem se avaliar
mutuamente. As avaliações precisam refletir experiências reais — é proibido
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
    body: `A PrestaCerto é fornecida "como está". Não garantimos que a plataforma
funcionará sem interrupções ou erros, e não somos responsáveis por prejuízos
decorrentes da relação entre cliente e freelancer, incluindo qualidade do
trabalho entregue, cumprimento de prazos ou problemas no pagamento processado
pelo Mercado Pago.`,
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
        Dúvidas sobre estes termos? Fale com a gente em{" "}
        <a href="mailto:contato@prestacerto.com.br" className="text-blue-600 hover:underline">
          contato@prestacerto.com.br
        </a>
        .
      </p>
    </div>
  );
}
