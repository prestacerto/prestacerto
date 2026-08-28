import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const siteUrl = 'https://caduai.com.br';
const siteTitle = 'IA para imobiliárias no WhatsApp | Cadu AI';
const siteDescription = 'O Cadu AI atende, qualifica e acompanha leads imobiliários pelo WhatsApp para gerar mais visitas com contexto para o corretor.';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Cadu AI',
  title: { default: siteTitle, template: '%s | Cadu AI' },
  description: siteDescription,
  alternates: { canonical: '/', languages: { 'pt-BR': '/' } },
  category: 'Tecnologia para imobiliárias',
  creator: 'Cadu AI',
  publisher: 'Cadu AI',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  keywords: ['IA para imobiliárias', 'atendimento imobiliário no WhatsApp', 'automação de leads imobiliários', 'qualificação de leads imobiliários', 'CRM para imobiliária', 'chatbot para imobiliária', 'follow-up imobiliário', 'leads imobiliários'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', locale: 'pt_BR', url: '/', siteName: 'Cadu AI', title: siteTitle, description: 'Atenda, qualifique e acompanhe leads para transformar conversas em visitas.', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cadu.AI — Mais visitas que acontecem.' }] },
  twitter: { card: 'summary_large_image', title: siteTitle, description: 'Atenda, qualifique e acompanhe leads para transformar conversas em visitas.', images: ['/og.png'] },
};
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Cadu AI',
      alternateName: 'Cadu.AI',
      url: siteUrl,
      logo: `${siteUrl}/icon-512.png`,
      image: `${siteUrl}/og.png`,
      description: 'Inteligência de receita e atendimento por IA para imobiliárias.',
      sameAs: ['https://instagram.com/caduai.br'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Cadu AI',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': `${siteUrl}/#website` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}/og.png`, width: 1200, height: 630 },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteUrl}/#software`,
      name: 'Cadu AI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, WhatsApp',
      url: siteUrl,
      description: siteDescription,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BRL',
        lowPrice: '30',
        highPrice: '10000',
        offerCount: 3,
        availability: 'https://schema.org/InStock',
      },
      provider: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'Service',
      '@id': `${siteUrl}/#service`,
      name: 'IA para atendimento imobiliário no WhatsApp',
      provider: { '@id': `${siteUrl}/#organization` },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      serviceType: 'Qualificação e acompanhamento de leads imobiliários por IA',
      audience: { '@type': 'Audience', audienceType: 'Imobiliárias, incorporadoras e corretores' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Modelos comerciais Cadu AI',
        itemListElement: [
          { '@type': 'Offer', name: 'Por visita comparecida', priceCurrency: 'BRL', priceSpecification: { '@type': 'PriceSpecification', minPrice: 30, maxPrice: 50, priceCurrency: 'BRL' } },
          { '@type': 'Offer', name: 'Por resultado atribuído', priceCurrency: 'BRL', priceSpecification: { '@type': 'PriceSpecification', minPrice: 200, maxPrice: 500, priceCurrency: 'BRL' } },
          { '@type': 'Offer', name: 'Enterprise mensal', priceCurrency: 'BRL', priceSpecification: { '@type': 'PriceSpecification', minPrice: 5000, maxPrice: 10000, priceCurrency: 'BRL' } },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq`,
      mainEntity: [
        { '@type': 'Question', name: 'O Cadu substitui o corretor?', acceptedAnswer: { '@type': 'Answer', text: 'Não. O Cadu assume a primeira resposta, a triagem e o acompanhamento. O corretor entra quando existe contexto e uma próxima ação clara.' } },
        { '@type': 'Question', name: 'Com quais CRMs o Cadu pode funcionar?', acceptedAnswer: { '@type': 'Answer', text: 'Vista CRM e RD Station estão entre os primeiros conectores. Também desenhamos integrações para Kenlo, CV CRM, Imoview, HubSpot e outros sistemas.' } },
        { '@type': 'Question', name: 'Como funciona o modelo por resultado?', acceptedAnswer: { '@type': 'Answer', text: 'Antes do piloto, definimos juntos o que conta como visita ou negócio atribuído. A remuneração acompanha o resultado verificado pela operação.' } },
        { '@type': 'Question', name: 'O Cadu inventa imóveis, preços ou disponibilidade?', acceptedAnswer: { '@type': 'Answer', text: 'Não. Ele trabalha apenas com as fontes autorizadas pela sua imobiliária e pede ajuda humana quando a informação não está disponível.' } },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteUrl}/#breadcrumb`,
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: siteUrl }],
    },
  ],
};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) { return <html lang="pt-BR"><body className={geist.variable}>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}/></body></html>; }
