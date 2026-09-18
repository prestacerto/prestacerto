import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Search, Check, Plus, MapPin, Code2, PenTool, Megaphone, FileText, Calculator } from 'lucide-react';
import { getPageMetadata } from '@/lib/seo/metadata';
import { HomeConversionTracking } from '@/components/home/home-conversion-tracking';
import { PlansSection } from '@/components/plans-section';
import { StructuredData, getFAQSchema } from '@/components/structured-data';
import './home.css';

export const metadata = getPageMetadata(
  'Freelancers e prestadores de serviços | PrestaCerto',
  'Encontre freelancers e prestadores de serviços no PrestaCerto. Publique seu projeto grátis, compare perfis e propostas e combine os detalhes com o profissional.',
  '/',
  '/images/banners/prestacerto-principal.png',
);

const categories = [
  { name: 'Tecnologia', description: 'Sites, sistemas e automações', icon: Code2, href: '/contratar/desenvolvimento-web' },
  { name: 'Design & criação', description: 'Marcas, interfaces e conteúdo', icon: PenTool, href: '/contratar/design-grafico' },
  { name: 'Marketing', description: 'Tráfego, redes sociais e estratégia', icon: Megaphone, href: '/contratar/marketing-digital' },
  { name: 'Conteúdo', description: 'Redação, copywriting e redes sociais', icon: FileText, href: '/contratar/redacao-conteudo' },
];
const steps = [
  { title: 'Conte o que você precisa', description: 'Descreva o serviço, o resultado que espera e seu prazo. Publique seu projeto gratuitamente.' },
  { title: 'Compare as propostas', description: 'Veja os perfis, conheça os trabalhos e compare o que cada profissional oferece.' },
  { title: 'Combine e comece', description: 'Alinhe escopo, valor, pagamento e entrega diretamente com o profissional escolhido.' },
];
const questions = [
  { question: 'Preciso pagar para publicar um projeto?', answer: 'Não. Criar sua conta de cliente e publicar um projeto é gratuito. O valor do serviço e as condições de pagamento são combinados com o profissional.' },
  { question: 'Como escolho o profissional certo?', answer: 'Compare os perfis, os trabalhos apresentados e o conteúdo das propostas. Antes de contratar, converse sobre o escopo, as revisões, o prazo e o valor da entrega.' },
  { question: 'Posso oferecer meus serviços na plataforma?', answer: 'Sim. Escolha “Sou profissional”, crie seu perfil gratuito e apresente seus serviços. Depois, consulte os projetos abertos e as condições do seu plano para enviar propostas.' },
  { question: 'O atendimento pode ser remoto?', answer: 'Depende do serviço. Design, desenvolvimento e outras entregas digitais podem ser feitos remotamente. Para serviços presenciais, confirme a região atendida diretamente com o profissional.' },
];
const localLinks = [
  { label: 'Design gráfico em São Paulo', path: 'design-grafico/sao-paulo' },
  { label: 'Desenvolvimento web no Rio de Janeiro', path: 'desenvolvimento-web/rio-de-janeiro' },
  { label: 'Marketing digital em Belo Horizonte', path: 'marketing-digital/belo-horizonte' },
  { label: 'Desenvolvimento web em Curitiba', path: 'desenvolvimento-web/curitiba' },
  { label: 'Design gráfico em Recife', path: 'design-grafico/recife' },
  { label: 'Marketing digital em Brasília', path: 'marketing-digital/brasilia' },
];
const comparisonRows = [
  ['Publicação de projeto', 'Gratuita para começar'],
  ['Comissão sobre o serviço', '0% de comissão do PrestaCerto'],
  ['Certo AI', 'Apoio para estruturar propostas, com revisão humana'],
  ['Certo Propostas', 'PDF e biblioteca no navegador'],
  ['Escolha do profissional', 'Compare perfis e propostas antes de combinar'],
  ['Contato', 'Condições combinadas diretamente entre as partes'],
];

export default function Home() {
  return (
    <div className="pc-home" id="home">
      <HomeConversionTracking />
      <StructuredData type="FAQPage" data={getFAQSchema(questions)} />
      <section className="hero wrap" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> FREELANCERS E PRESTADORES DE SERVIÇOS</p>
          <h1 id="home-title">O profissional certo<br />{' '}<span>para o seu projeto.</span></h1>
          <p className="hero-description">Da criação de um site aos serviços para sua casa: publique o que precisa, compare perfis e propostas e escolha com quem trabalhar.</p>
          <div className="hero-actions">
            <Link href="/para-clientes" className="button" data-home-cta="client" data-placement="hero">Publicar projeto grátis <ArrowRight size={18} /></Link>
            <Link href="/register?role=freelancer" className="button button-outline" data-home-cta="freelancer" data-placement="hero">Quero oferecer serviços</Link>
          </div>
          <p className="hero-note"><Check size={16} /> Publicação gratuita. Sem cartão. Contrate quando decidir.</p>
          <div className="hero-search">
            <label htmlFor="home-service-search">Já sabe qual serviço procura?</label>
            <form className="search-box" action="/services" method="get" role="search" aria-label="Buscar serviços" data-home-search>
              <Search size={20} aria-hidden="true" />
              <input id="home-service-search" name="q" type="search" placeholder="Ex.: criação de site, design, fotografia" maxLength={100} />
              <button type="submit">Buscar <ArrowUpRight size={16} /></button>
            </form>
          </div>
        </div>
        <figure className="banner-art hero-banner lidy-hero-banner">
          <div className="lidy-photo-frame">
            <Image className="lidy-hero-image" src="/images/marketing/lidy/lidi-lisboa.jpg" alt="Lidi Lisboa, atriz brasileira em destaque na página" fill sizes="(max-width: 800px) 100vw, 50vw" priority />
          </div>
          <figcaption><strong>Celebridades que confiam na PrestaCerto</strong><span>Lidi Lisboa · atriz brasileira</span></figcaption>
        </figure>
      </section>

      <section className="trust-strip wrap" aria-label="Por que usar o PrestaCerto">
        <div className="trust-intro"><p className="eyebrow">CONFIANÇA PARA COMEÇAR</p><h2>Um caminho claro para o próximo projeto.</h2><p>Publique sua necessidade ou apresente seu trabalho com informações claras desde o primeiro contato.</p></div>
        <div className="trust-points">
          <div><Check size={18} /><strong>Publicação gratuita</strong><span>Comece sem cartão e decida com calma.</span></div>
          <div><Check size={18} /><strong>Compare antes de escolher</strong><span>Veja perfis e propostas para encontrar o melhor encaixe.</span></div>
          <div><Check size={18} /><strong>Contato direto</strong><span>Combine escopo, prazo e entrega com transparência.</span></div>
        </div>
      </section>

      <div className="principles wrap" aria-label="Como o PrestaCerto ajuda">
        {['Publique gratuitamente', 'Compare perfis e propostas', 'Combine diretamente'].map(text => <span key={text}><Check size={17} />{text}</span>)}
      </div>

      <section className="wrap comparison-section section-space" id="diferenciais" aria-labelledby="comparison-title">
        <div className="section-head"><div><p className="eyebrow">POR QUE PRESTACERTO</p><h2 id="comparison-title">Mais clareza para contratar e trabalhar.</h2><p className="section-description">Veja como o PrestaCerto organiza a contratação e o trabalho, com recursos que você consegue conferir antes de decidir.</p></div></div>
        <div className="comparison-table" role="region" aria-label="Comparação de diferenciais do PrestaCerto" tabIndex={0}>
          <div className="comparison-table-head"><b>O que importa</b><b>Como funciona no PrestaCerto</b></div>
          {comparisonRows.map(row => <div className="comparison-table-row" key={row[0]}><span>{row[0]}</span><span className="highlight">{row[1]}</span></div>)}
        </div>
        <p className="comparison-note">Recursos e limites podem variar por plano. Confira as condições antes de contratar.</p>
      </section>

      <section className="categories wrap section-space" id="categorias" aria-labelledby="categories-title">
        <div className="section-head"><div><p className="eyebrow">PARA CADA IDEIA, UMA ESPECIALIDADE</p><h2 id="categories-title">De que serviço você precisa?</h2></div><Link className="text-link" href="/services">Ver todos os serviços <ArrowUpRight size={18} /></Link></div>
        <div className="category-grid">{categories.map(({ name, description, icon: Icon, href }) => <Link className="category" href={href} key={name}><div className="category-top"><span className="category-icon"><Icon size={24} /></span><ArrowUpRight size={17} /></div><h3>{name}</h3><p>{description}</p></Link>)}</div>
      </section>

      <section className="steps-section" id="como-funciona" aria-labelledby="steps-title"><div className="wrap section-space">
        <div className="section-head"><div><p className="eyebrow">DO PRIMEIRO CONTATO À ENTREGA</p><h2 id="steps-title">Seu próximo projeto começa assim.</h2></div><Link className="text-link" href="/como-funciona">Entenda como funciona <ArrowUpRight size={18} /></Link></div>
        <ol className="steps">{steps.map((step, index) => <li className="step" key={step.title}><span className="step-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      </div></section>

      <section className="wrap freelancer-section section-space" id="para-profissionais" aria-labelledby="freelancer-heading"><div className="freelancer">
        <div className="banner-art freelancer-banner"><picture><source media="(max-width: 767px)" srcSet="/images/marketing/v1/prestacerto-profissionais-960.avif" type="image/avif"/><source srcSet="/images/marketing/v1/prestacerto-profissionais-960.avif 960w, /images/marketing/v1/prestacerto-profissionais.avif 1920w" sizes="(max-width: 800px) 100vw, 850px" type="image/avif"/><source srcSet="/images/marketing/v1/prestacerto-profissionais-960.webp 960w, /images/marketing/v1/prestacerto-profissionais.webp 1920w" sizes="(max-width: 800px) 100vw, 850px" type="image/webp"/><Image src="/images/marketing/v1/prestacerto-profissionais.webp" alt="Profissional sorrindo com um notebook no colo e detalhes azuis do PrestaCerto" width={1920} height={1080} loading="lazy" /></picture></div>
        <div className="freelancer-copy"><p className="eyebrow">PARA QUEM FAZ ACONTECER</p><h2 id="freelancer-heading">Seu talento merece<br />{' '}o próximo projeto.</h2><p>Mostre o que você sabe fazer. Crie seu perfil, apresente seus serviços e encontre projetos que combinam com seu trabalho.</p><ul className="freelancer-benefits"><li><Check size={17} />Perfil gratuito para começar</li><li><Check size={17} />Espaço para apresentar seus serviços</li><li><Check size={17} />Oportunidades para enviar propostas</li></ul><Link href="/register?role=freelancer" className="button" data-home-cta="freelancer" data-placement="professional_banner">Criar meu perfil grátis <ArrowRight size={18} /></Link><Link className="text-link freelancer-projects" href="/projects">Explorar projetos abertos <ArrowUpRight size={17} /></Link><p className="plan-note">Quer conhecer os limites e recursos de cada plano? <Link href="/plans">Veja os planos.</Link></p></div>
      </div></section>

      <section className="wrap home-plans" id="planos" aria-labelledby="plans-title"><div className="section-head"><div><p className="eyebrow">PARA QUEM QUER CRESCER</p><h2 id="plans-title">Escolha o plano para acelerar suas propostas.</h2><p className="section-description">O Pro é o mais escolhido por quem quer enviar propostas com mais volume e visibilidade. Compare também o Business para uma operação mais completa.</p></div></div><PlansSection focusPaidPlans /></section>

      <section className="wrap tools-section" id="ferramentas" aria-labelledby="tools-title"><div className="section-head"><div><p className="eyebrow">UMA AJUDA PARA O SEU TRABALHO</p><h2 id="tools-title">Prepare o próximo passo.</h2></div></div><div className="tools-grid">
        <Link className="tool-card" href="/ferramentas/calculadora"><Calculator size={25} /><div><h3>Calculadora de preço</h3><p>Estime seu valor por hora e por projeto. Grátis, sem cadastro.</p></div><ArrowUpRight size={20} /></Link>
        <Link className="tool-card" href="/ferramentas/propostas" data-home-cta="proposal_tool" data-placement="tools"><FileText size={25} /><div><h3>Certo Propostas · novo</h3><p>Crie seu orçamento em PDF, salve modelos e acompanhe cada negociação. Comece grátis.</p></div><ArrowUpRight size={20} /></Link>
      </div></section>

      <section className="wrap faq-section section-space" aria-labelledby="faq-title"><div><p className="eyebrow">ANTES DE COMEÇAR</p><h2 id="faq-title">Ficou alguma dúvida?</h2><p className="section-description">Entenda o essencial para dar o próximo passo.</p><Link className="text-link" href="/ajuda">Visitar a central de ajuda <ArrowUpRight size={18} /></Link></div><div className="faq-list">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<Plus size={19} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>

      <section className="local-section" aria-labelledby="local-title"><div className="wrap section-space"><div className="section-head"><div><p className="eyebrow"><MapPin size={15} /> ESPECIALIDADES E REGIÕES</p><h2 id="local-title">Encontre serviços na sua cidade.</h2><p className="section-description">Explore o que considerar ao contratar e conheça os perfis disponíveis por região.</p></div><Link href="/contratar" className="text-link">Ver categorias e cidades <ArrowUpRight size={18} /></Link></div><div className="local-links">{localLinks.map(({ label, path }) => <Link href={`/contratar/${path}`} key={path}>{label}<ArrowUpRight size={16} /></Link>)}</div></div></section>

      <section className="wrap final-cta section-space" aria-labelledby="final-title"><div><p className="eyebrow">DA IDEIA AO PRIMEIRO PASSO</p><h2 id="final-title">Vamos tirar seu plano do papel?</h2><p>Conte o que você precisa. A publicação do projeto é gratuita.</p></div><Link href="/para-clientes" className="button" data-home-cta="client" data-placement="final">Publicar projeto grátis <ArrowRight size={18} /></Link></section>
    </div>
  );
}
