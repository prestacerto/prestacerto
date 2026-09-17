export type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prestacerto.com.br";

// CLIENTES
export const clienteEmails: Record<number, EmailTemplate> = {
  0: {
    subject: "Bem-vindo à PrestaCerto 👋",
    html: `
      <h1>Bem-vindo à PrestaCerto!</h1>
      <p>Obrigado por se registrar. Você está um passo mais perto de encontrar o profissional perfeito.</p>
      <h2>Como funciona:</h2>
      <ol>
        <li>Você publica um projeto</li>
        <li>Profissionais enviam propostas</li>
        <li>Você escolhe o melhor</li>
        <li>Contrata com segurança</li>
      </ol>
      <a href="${baseUrl}/projects/create" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Publicar meu primeiro projeto
      </a>
    `,
    text: "Bem-vindo à PrestaCerto! Clique no link para publicar seu primeiro projeto.",
  },
  1: {
    subject: "Você não precisa procurar profissionais.",
    html: `
      <h1>Como funciona a PrestaCerto</h1>
      <p>Diferente de outras plataformas, você não procura. Você publica e eles vêm a você.</p>
      <h2>O processo:</h2>
      <ol>
        <li><strong>Publica</strong> — Descreve o que precisa</li>
        <li><strong>Recebe propostas</strong> — Profissionais interessados respondem</li>
        <li><strong>Escolhe</strong> — Vê portfólio, avaliações, prazo</li>
        <li><strong>Paga direto</strong> — Sem intermediários</li>
      </ol>
      <a href="${baseUrl}/projects/create" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Publicar agora
      </a>
    `,
    text: "Publique seu projeto na PrestaCerto.",
  },
  2: {
    subject: "Como escolher o profissional certo",
    html: `
      <h1>Dicas para escolher bem</h1>
      <h2>O que analisar:</h2>
      <ul>
        <li><strong>Avaliações</strong> — Veja o histórico de clientes anteriores</li>
        <li><strong>Portfólio</strong> — Projetos parecidos com o seu</li>
        <li><strong>Conversa</strong> — Responde rápido? Entende o escopo?</li>
        <li><strong>Prazo</strong> — Quando consegue entregar</li>
      </ul>
      <p>Não tenha pressa. A pessoa certa faz diferença.</p>
      <a href="${baseUrl}/projects/list" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Encontrar profissionais
      </a>
    `,
    text: "Saiba como escolher o melhor profissional.",
  },
  3: {
    subject: "Os 5 serviços mais contratados essa semana",
    html: `
      <h1>Oportunidades em alta</h1>
      <p>Essas categorias estão com muito movimento. Talvez você tenha demanda aqui:</p>
      <ul>
        <li>💻 Programador</li>
        <li>🎨 Designer</li>
        <li>📱 Social Media</li>
        <li>⚡ Eletricista</li>
        <li>🧹 Diarista</li>
      </ul>
      <p>Se precisar de algo nessas áreas, a procura tá quente.</p>
      <a href="${baseUrl}/projects/create" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Publicar serviço
      </a>
    `,
    text: "Veja os serviços em alta demanda.",
  },
  4: {
    subject: "Ainda precisa de ajuda?",
    html: `
      <h1>A gente tá aqui</h1>
      <p>Se ficou com dúvida ou precisa de algo, temos opções:</p>
      <ul>
        <li>✅ <strong>Certo AI</strong> — Responde dúvidas 24/7</li>
        <li>✅ <strong>Suporte</strong> — Fale direto com a gente</li>
        <li>✅ <strong>Documentação</strong> — Guias e tutoriais</li>
      </ul>
      <p>Bora publicar seu primeiro projeto?</p>
      <a href="${baseUrl}/projects/create" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Publicar primeiro projeto
      </a>
    `,
    text: "Precisa de ajuda? Estamos aqui.",
  },
};

// PRESTADORES
export const prestadorEmails: Record<number, EmailTemplate> = {
  0: {
    subject: "Bem-vindo à PrestaCerto 🚀",
    html: `
      <h1>Bem-vindo à PrestaCerto!</h1>
      <p>Você entrou na maior plataforma de freelancers do Brasil.</p>
      <h2>Próximos passos:</h2>
      <ul>
        <li><strong>Perfil</strong> — Complete com sua experiência</li>
        <li><strong>Propostas</strong> — Responda projetos que batem com seu perfil</li>
        <li><strong>Planos</strong> — Conheca Premium e Pro</li>
      </ul>
      <a href="${baseUrl}/profile" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Completar perfil
      </a>
    `,
    text: "Bem-vindo! Complete seu perfil na PrestaCerto.",
  },
  1: {
    subject: "Como aparecer primeiro nas buscas",
    html: `
      <h1>Sua visibilidade importa</h1>
      <p>Quanto mais completo seu perfil, mais aparece para clientes.</p>
      <h2>O que fazer:</h2>
      <ul>
        <li>📸 <strong>Foto</strong> — Uma de rosto, profissional</li>
        <li>📂 <strong>Portfólio</strong> — Seus 3-5 melhores projetos</li>
        <li>🏷️ <strong>Categorias</strong> — Escolha todas que você domina</li>
        <li>✍️ <strong>Bio</strong> — Fale quem você é em 2 linhas</li>
      </ul>
      <a href="${baseUrl}/profile" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Melhorar perfil
      </a>
    `,
    text: "Complete seu perfil para aparecer mais nas buscas.",
  },
  2: {
    subject: "Como conseguir seus primeiros clientes",
    html: `
      <h1>Dicas reais</h1>
      <p>Aqui estão as estratégias que funcionam:</p>
      <h2>Tática 1: Responda rápido</h2>
      <p>Quem responde em 1 hora ganha muito mais que quem demora.</p>
      <h2>Tática 2: Customize sua proposta</h2>
      <p>Não mande copy-paste. Mostre que leu e entendeu.</p>
      <h2>Tática 3: Preço é secundário</h2>
      <p>Seu portfólio e rapidez valem mais que ser barato.</p>
      <p>Bora começar?</p>
    `,
    text: "Veja como conseguir seus primeiros clientes.",
  },
  3: {
    subject: "Quanto cobrar?",
    html: `
      <h1>Definindo preços</h1>
      <p>Essa é a dúvida mais comum. Vamos descomplicar.</p>
      <h2>Regra 1: Não seja barato</h2>
      <p>Profissional barato = desconfiança. Cobra baseado em resultado, não em horas.</p>
      <h2>Regra 2: Aumente com portfólio</h2>
      <p>Nos primeiros 5 projetos, pode fazer por menos. Depois, levanta.</p>
      <h2>Regra 3: Negocie</h2>
      <p>Clientes vão oferecer menos. Você contra-oferece. É assim que funciona.</p>
      <p>O portfólio é seu maior ativo.</p>
    `,
    text: "Saiba como precificar seu trabalho.",
  },
  4: {
    subject: "Conheça o Plano Pro",
    html: `
      <h1>Leve sua carreira pro próximo nível</h1>
      <p>Depois de alguns projetos, muitos profissionais optam pelo Pro. Não é obrigatório, mas faz diferença.</p>
      <h2>Benefícios:</h2>
      <ul>
        <li>⭐ Você sai como destaque</li>
        <li>📊 Você vê mais oportunidades</li>
        <li>🎯 Filtros melhores</li>
        <li>💰 Clientes com maior orçamento</li>
      </ul>
      <p>Sem pressa. Muitas histórias de sucesso começaram grátis.</p>
    `,
    text: "Conheça o Plano Pro da PrestaCerto.",
  },
};

// Getter para ambos
export function getEmailTemplate(
  sequence: "CLIENTE" | "PRESTADOR",
  step: number
): EmailTemplate {
  const templates = sequence === "CLIENTE" ? clienteEmails : prestadorEmails;
  return templates[step] || templates[0];
}
