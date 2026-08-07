export type AprendaCard = {
  id: string;
  categoria: "precificacao" | "proposta" | "posicionamento" | "cliente" | "carreira";
  titulo: string;
  conteudo: string;
  tempoLeitura: number; // segundos
  fonte?: string;
};

export const APRENDA_CARDS: AprendaCard[] = [
  // PRECIFICAÇÃO
  {
    id: "preco-hora-real",
    categoria: "precificacao",
    titulo: "Seu preço/hora real não é o que você acha",
    conteudo: "Divida seu faturamento mensal pelas horas FATURÁVEIS — não pelo total trabalhado. Reuniões, revisões, orçamentos e prospecção não entram na conta do cliente, mas entram no seu custo. Um freelancer que trabalha 160h/mês mas fatura em apenas 80h cobra efetivamente o dobro do que imagina.",
    tempoLeitura: 45,
  },
  {
    id: "desconto-perigoso",
    categoria: "precificacao",
    titulo: "Dar desconto é mais caro do que parece",
    conteudo: "Um desconto de 20% não reduz seu lucro em 20% — reduz muito mais. Se sua margem é 40%, um desconto de 20% elimina metade do seu lucro. Antes de ceder, ofereça reduzir o escopo: menos páginas, menos revisões, prazo mais longo. O preço fica, o escopo encolhe.",
    tempoLeitura: 40,
  },
  {
    id: "preco-valor",
    categoria: "precificacao",
    titulo: "Cobrar por hora te torna commoditie",
    conteudo: "Quando você cobra por hora, o cliente compara você com qualquer outro que cobra menos. Quando você cobra por resultado ('identidade visual completa entregue em 15 dias'), você é avaliado pelo valor gerado, não pelo tempo. Freelancers sêniores cobram por pacote — não por hora.",
    tempoLeitura: 35,
  },
  {
    id: "reajuste-anual",
    categoria: "precificacao",
    titulo: "Reajuste anual não é opcional",
    conteudo: "Inflação, custo de vida, sua senioridade crescendo — tudo isso aumenta. Se você não reajusta, na prática está dando desconto todo ano. Avise clientes recorrentes com 30 dias de antecedência e enquadre como 'atualização' — nunca como 'aumento'. Clientes bons entendem.",
    tempoLeitura: 30,
  },

  // PROPOSTA
  {
    id: "proposta-problema",
    categoria: "proposta",
    titulo: "Comece a proposta pelo problema, não pela solução",
    conteudo: "A maioria começa com 'Olá, sou [nome], tenho X anos de experiência...'. O cliente não liga pra você ainda — liga para o problema dele. Comece assim: 'Entendi que você precisa de X porque Y está acontecendo. Minha abordagem para resolver isso é...' Você já se diferenciou de 90% dos concorrentes.",
    tempoLeitura: 40,
  },
  {
    id: "proposta-curta",
    categoria: "proposta",
    titulo: "Proposta longa = proposta lida pela metade",
    conteudo: "Clientes recebem dezenas de propostas. A que tem 3 parágrafos claros ganha da que tem 10 parágrafos genéricos. Estrutura que funciona: (1) problema que você entendeu, (2) o que você vai entregar, (3) prazo e preço. Ponto. Detalhes técnicos ficam para a reunião.",
    tempoLeitura: 35,
  },
  {
    id: "proposta-pergunta",
    categoria: "proposta",
    titulo: "Termine a proposta com uma pergunta",
    conteudo: "Em vez de 'Aguardo seu retorno', termine com uma pergunta que force um 'sim' ou 'não': 'Essa abordagem faz sentido para o que você precisa, ou prefere ajustar algum ponto?' Isso transforma o silêncio (ignorar) em uma decisão consciente. A taxa de resposta dobra.",
    tempoLeitura: 30,
  },
  {
    id: "portfolio-proposta",
    categoria: "proposta",
    titulo: "Um exemplo certo vale mais que dez aleatórios",
    conteudo: "Não jogue todo seu portfólio na proposta. Selecione 1 ou 2 trabalhos parecidos com o projeto do cliente e explique brevemente o resultado obtido. 'Fiz um e-commerce similar pra uma marca de roupas, o cliente teve 3x mais conversões' é infinitamente mais poderoso que um link para seu site.",
    tempoLeitura: 35,
  },

  // POSICIONAMENTO
  {
    id: "nicho-vs-generalista",
    categoria: "posicionamento",
    titulo: "Nicho específico = preço mais alto",
    conteudo: "Um 'desenvolvedor web' compete com todos. Um 'desenvolvedor de e-commerce para marcas de moda' compete com poucos e cobra mais. Quanto mais específico o nicho, menos concorrentes diretos e mais o cliente percebe você como especialista — o que justifica preço premium.",
    tempoLeitura: 35,
  },
  {
    id: "headline-perfil",
    categoria: "posicionamento",
    titulo: "Sua headline é o anúncio do seu serviço",
    conteudo: "Evite: 'Desenvolvedor Full Stack'. Prefira: 'Crio sistemas web para clínicas e consultórios' ou 'Designer que aumenta conversão de e-commerces'. A headline responde: pra quem você trabalha e qual resultado entrega. Se o cliente certo ler, ele vai querer falar com você imediatamente.",
    tempoLeitura: 35,
  },
  {
    id: "presenca-consistente",
    categoria: "posicionamento",
    titulo: "Consistência bate talento no médio prazo",
    conteudo: "O freelancer que posta portfólio toda semana, responde rápido e mantém o perfil atualizado ganha mais projetos do que o mais talentoso que some por meses. Clientes escolhem por disponibilidade e confiabilidade tanto quanto por habilidade. Aparecer regularmente é metade do trabalho.",
    tempoLeitura: 30,
  },

  // CLIENTE
  {
    id: "cliente-ruim",
    categoria: "cliente",
    titulo: "Cliente que barganha preço no começo piora no fim",
    conteudo: "Se na primeira mensagem o cliente já pede desconto, isso revela como ele vai tratar cada entrega. O padrão não muda: vai questionar seu trabalho, pedir revisões infinitas e pagar atrasado. Não é regra universal, mas é sinal de alerta sério. Freelancers experientes aprendem a dizer não antes de começar.",
    tempoLeitura: 40,
  },
  {
    id: "escopo-fechado",
    categoria: "cliente",
    titulo: "Escopo aberto é convite para trabalho de graça",
    conteudo: "'Vai precisar de mais ajustes conforme formos desenvolvendo' é a frase mais cara do freelancing. Defina por escrito o que está incluso e o que é cobrado à parte antes de começar. Mudanças de escopo têm preço. Documentar não é desconfiança — é profissionalismo.",
    tempoLeitura: 40,
  },
  {
    id: "pagamento-antecipado",
    categoria: "cliente",
    titulo: "50% adiantado não é arrogância, é padrão de mercado",
    conteudo: "Sinal de entrada elimina clientes que somem, garante seu tempo mínimo e alinha o comprometimento de ambos os lados. Clientes sérios não hesitam. Se o cliente achar estranho pagar adiantado, isso conta algo sobre como ele trata fornecedores.",
    tempoLeitura: 35,
  },

  // CARREIRA
  {
    id: "meta-mensal",
    categoria: "carreira",
    titulo: "Freelancer sem meta é empresa sem planejamento",
    conteudo: "Defina seu número mínimo (paga as contas) e seu número ideal (vive bem + investe) todo mês. Quando você bate o mínimo, pode ser mais seletivo com projetos novos. Sem meta, você aceita qualquer coisa o tempo todo — mesmo quando não precisa.",
    tempoLeitura: 35,
  },
  {
    id: "reserva-emergencia",
    categoria: "carreira",
    titulo: "Meses ruins existem. Reserve nos bons.",
    conteudo: "Freelancing tem sazonalidade: dezembro e julho costumam ser fracos. Se você não reservar nos meses gordos, os magros viram crise. Meta prática: mantenha o equivalente a 3 meses de despesas numa conta separada. Isso muda sua postura em negociações — você negocia de poder, não de desespero.",
    tempoLeitura: 40,
  },
  {
    id: "curva-aprendizado",
    categoria: "carreira",
    titulo: "Dedique 10% do tempo a se tornar mais valioso",
    conteudo: "Quem parou de aprender em 2020 está cobrando preço de 2020. Reserve pelo menos 4h por semana para aprender algo novo na sua área. Não precisa ser curso longo: um tutorial, um projeto pessoal, uma skill adjacente. Seu preço em 2 anos é resultado do que você aprende hoje.",
    tempoLeitura: 35,
  },
];

export const CATEGORIAS_APRENDA = {
  precificacao: { label: "Precificação", color: "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950" },
  proposta:     { label: "Proposta",     color: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950" },
  posicionamento: { label: "Posicionamento", color: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950" },
  cliente:      { label: "Cliente",      color: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950" },
  carreira:     { label: "Carreira",     color: "text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950" },
};
