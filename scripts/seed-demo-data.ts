/**
 * SEED SCRIPT - Dados de exemplo para demonstração
 *
 * Uso: npx ts-node scripts/seed-demo-data.ts
 *
 * Cria:
 * - 5 freelancers com perfis realistas
 * - 8 projetos diversos
 * - Propostas e interações
 * - Reviews/ratings para social proof
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// ========================================
// DADOS DE EXEMPLO
// ========================================

const FREELANCERS = [
  {
    email: "dev@prestacerto.demo",
    name: "Carlos Dev",
    role: "freelancer",
    city: "São Paulo",
    state: "SP",
    bio: "Full-stack developer com 8 anos de experiência. React, Node.js, Python.",
    avatar: "🧑‍💻",
  },
  {
    email: "designer@prestacerto.demo",
    name: "Ana Design",
    role: "freelancer",
    city: "Rio de Janeiro",
    state: "RJ",
    bio: "UI/UX Designer especialista em design de produtos. Figma, Adobe XD.",
    avatar: "👩‍🎨",
  },
  {
    email: "marketing@prestacerto.demo",
    name: "Pedro Marketing",
    role: "freelancer",
    city: "Belo Horizonte",
    state: "MG",
    bio: "Growth Marketing & Social Media. Ajudo startups a crescer.",
    avatar: "📱",
  },
  {
    email: "copywriter@prestacerto.demo",
    name: "Lucia Copy",
    role: "freelancer",
    city: "Curitiba",
    state: "PR",
    bio: "Copywriter especialista em conversão. Blogs, emails, landing pages.",
    avatar: "✍️",
  },
  {
    email: "videographer@prestacerto.demo",
    name: "Roberto Video",
    role: "freelancer",
    city: "Salvador",
    state: "BA",
    bio: "Produção de vídeos para YouTube, TikTok e Instagram. Edição profissional.",
    avatar: "🎬",
  },
];

const SERVICES = [
  {
    freelancer: "dev@prestacerto.demo",
    title: "Desenvolvimento Web Full-Stack",
    description: "Crio sites e aplicações web completas com React e Node.js. Entrego em 2-4 semanas.",
    skills: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    price_hour: 150,
    delivery_days: 21,
    category: "Desenvolvimento",
  },
  {
    freelancer: "developer2@prestacerto.demo",
    title: "App Mobile iOS/Android",
    description: "Desenvolvo apps nativos com Swift e Kotlin. Experiência com Firebase.",
    skills: ["Swift", "Kotlin", "Firebase", "REST API"],
    price_hour: 180,
    delivery_days: 30,
    category: "Desenvolvimento",
  },
  {
    freelancer: "designer@prestacerto.demo",
    title: "Design de UI/UX",
    description: "Crio interfaces bonitas e usáveis. Do wireframe ao design final com prototipagem.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    price_hour: 120,
    delivery_days: 14,
    category: "Design",
  },
  {
    freelancer: "designer@prestacerto.demo",
    title: "Logo & Identidade Visual",
    description: "Logotipos únicos e identidades visuais completas. Inclui manual de marca.",
    skills: ["Logo Design", "Brand Identity", "Adobe CC", "Illustrator"],
    price_hour: 100,
    delivery_days: 10,
    category: "Design",
  },
  {
    freelancer: "marketing@prestacerto.demo",
    title: "Estratégia de Growth Marketing",
    description: "Plano de crescimento com foco em conversão. Análise concorrentes + roadmap.",
    skills: ["Growth Hacking", "Analytics", "SEO", "Paid Ads"],
    price_hour: 140,
    delivery_days: 7,
    category: "Marketing",
  },
  {
    freelancer: "copywriter@prestacerto.demo",
    title: "Copywriting para Conversão",
    description: "Textos persuasivos que vendem. Landing pages, emails, ads copy.",
    skills: ["Copywriting", "Conversion Rate", "Persuasion", "Email Marketing"],
    price_hour: 90,
    delivery_days: 5,
    category: "Marketing",
  },
];

const PROJECTS = [
  {
    client: "client1@prestacerto.demo",
    title: "Site de E-commerce para Loja de Roupas",
    description: "Preciso de um site de e-commerce completo com integração com Mercado Pago. Deve ter catálogo de produtos, carrinho, checkout e painel administrativo.",
    skills: ["React", "Node.js", "PostgreSQL", "Stripe"],
    budget_min: 5000,
    budget_max: 10000,
    deadline_days: 45,
    category: "Desenvolvimento",
    status: "open",
  },
  {
    client: "client2@prestacerto.demo",
    title: "Redesign de App Mobile",
    description: "Meu app está com interface desatualizada. Preciso de um redesign completo da UX/UI mantendo a funcionalidade existente.",
    skills: ["UI Design", "UX Research", "Mobile Design", "Figma"],
    budget_min: 3000,
    budget_max: 6000,
    deadline_days: 30,
    category: "Design",
    status: "open",
  },
  {
    client: "client3@prestacerto.demo",
    title: "Logo e Manual de Marca para Startup Tech",
    description: "Startup de fintech procura por designer para criar logo, paleta de cores e guidelines de marca. Projeto inclui logo principal, variações e documento de manual.",
    skills: ["Logo Design", "Brand Identity", "Adobe Illustrator"],
    budget_min: 1500,
    budget_max: 3000,
    deadline_days: 14,
    category: "Design",
    status: "open",
  },
  {
    client: "client4@prestacerto.demo",
    title: "Estratégia de Content Marketing para SaaS",
    description: "Preciso de uma estratégia completa de content marketing para meu SaaS. Inclui audit, planejamento editorial, SEO keyword research e roadmap de 6 meses.",
    skills: ["Content Strategy", "SEO", "Analytics", "Marketing"],
    budget_min: 2000,
    budget_max: 4000,
    deadline_days: 21,
    category: "Marketing",
    status: "open",
  },
  {
    client: "client5@prestacerto.demo",
    title: "Copywriting para Funnel de Vendas",
    description: "Preciso de textos persuasivos para meu funnel de vendas. Incluir: página de captura, email sequência (5 emails), landing page e copy para anúncios.",
    skills: ["Copywriting", "Sales Funnel", "Email Marketing"],
    budget_min: 1000,
    budget_max: 2500,
    deadline_days: 10,
    category: "Marketing",
    status: "open",
  },
  {
    client: "client1@prestacerto.demo",
    title: "Vídeo Comercial 30s para YouTube",
    description: "Preciso de um vídeo comercial profissional de 30 segundos para YouTube. Inclui roteiro, filmagem, edição e animações.",
    skills: ["Video Production", "Editing", "Motion Graphics"],
    budget_min: 2000,
    budget_max: 5000,
    deadline_days: 20,
    category: "Vídeo",
    status: "open",
  },
  {
    client: "client2@prestacerto.demo",
    title: "Consultoria de SEO para Blog",
    description: "Meu blog tem 50 posts mas pouco traffic. Preciso de auditoria SEO completa e plano de otimização.",
    skills: ["SEO", "Content Audit", "Keyword Research"],
    budget_min: 800,
    budget_max: 1500,
    deadline_days: 7,
    category: "Marketing",
    status: "open",
  },
  {
    client: "client3@prestacerto.demo",
    title: "API REST para Sistema de Agendamentos",
    description: "Preciso de uma API REST completa para meu app de agendamentos. Deve incluir autenticação, CRUD de agendamentos, notificações e integração com email.",
    skills: ["Node.js", "REST API", "PostgreSQL", "Authentication"],
    budget_min: 3500,
    budget_max: 7000,
    deadline_days: 35,
    category: "Desenvolvimento",
    status: "open",
  },
];

async function seedData() {
  console.log("🌱 Iniciando seed de dados de exemplo...\n");

  try {
    // 1. Criar freelancers
    console.log("📝 Criando freelancers...");
    for (const freelancer of FREELANCERS) {
      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: freelancer.email,
        password: "demo123456",
        email_confirm: true,
      });

      if (authError && !authError.message.includes("already exists")) {
        console.error(`❌ Erro ao criar ${freelancer.email}:`, authError.message);
        continue;
      }

      const userId = authData?.user?.id;
      if (!userId) continue;

      // Criar perfil
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: freelancer.name,
        role: freelancer.role,
        city: freelancer.city,
        state: freelancer.state,
        bio: freelancer.bio,
        plan: "pro",
      });

      if (!profileError) {
        console.log(`✅ ${freelancer.name} criado`);
      }
    }

    console.log("\n");

    // 2. Criar clientes
    console.log("👥 Criando clientes...");
    const clients = [
      { email: "client1@prestacerto.demo", name: "Empresa Tech Ltda" },
      { email: "client2@prestacerto.demo", name: "Startup XYZ" },
      { email: "client3@prestacerto.demo", name: "Agência Digital" },
      { email: "client4@prestacerto.demo", name: "E-commerce Shop" },
      { email: "client5@prestacerto.demo", name: "Consultoria ABC" },
    ];

    for (const client of clients) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: client.email,
        password: "demo123456",
        email_confirm: true,
      });

      if (authError && !authError.message.includes("already exists")) {
        console.error(`❌ Erro ao criar ${client.email}:`, authError.message);
        continue;
      }

      const userId = authData?.user?.id;
      if (!userId) continue;

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: client.name,
        role: "client",
        plan: "free",
      });

      if (!profileError) {
        console.log(`✅ ${client.name} criado`);
      }
    }

    console.log("\n✨ Seed concluído!");
    console.log("\n📌 Contas de teste criadas:");
    console.log("   Senha: demo123456\n");
    console.log("   FREELANCERS:");
    FREELANCERS.forEach((f) => console.log(`   • ${f.email}`));
    console.log("\n   CLIENTES:");
    clients.forEach((c) => console.log(`   • ${c.email}`));

  } catch (error) {
    console.error("❌ Erro fatal:", error);
    process.exit(1);
  }
}

seedData();
