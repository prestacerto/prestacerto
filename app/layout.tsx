import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://cadu-ai.kadusima.chatgpt.site'),
  title: { default: 'IA para imobiliárias no WhatsApp | Cadu AI', template: '%s | Cadu AI' },
  description: 'O Cadu atende, qualifica e acompanha leads imobiliários pelo WhatsApp para gerar mais visitas com contexto para o corretor.',
  alternates: { canonical: '/' },
  keywords: ['IA para imobiliárias', 'atendimento imobiliário no WhatsApp', 'automação de leads imobiliários', 'qualificação de leads imobiliários', 'CRM para imobiliária'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Cadu AI', title: 'IA para imobiliárias no WhatsApp | Cadu AI', description: 'Atenda, qualifique e acompanhe leads para transformar conversas em visitas.', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cadu.AI — Mais visitas que acontecem.' }] },
  twitter: { card: 'summary_large_image', title: 'IA para imobiliárias no WhatsApp | Cadu AI', description: 'Atenda, qualifique e acompanhe leads para transformar conversas em visitas.', images: ['/og.png'] },
};
const organizationSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: 'Cadu AI', url: 'https://cadu-ai.kadusima.chatgpt.site', logo: 'https://cadu-ai.kadusima.chatgpt.site/og.png', description: 'Inteligência de receita e atendimento por IA para imobiliárias.', sameAs: ['https://instagram.com/caduai.br'] };
const serviceSchema = { '@context': 'https://schema.org', '@type': 'Service', name: 'IA para atendimento imobiliário no WhatsApp', provider: { '@type': 'Organization', name: 'Cadu AI' }, areaServed: { '@type': 'Country', name: 'Brasil' }, serviceType: 'Qualificação e acompanhamento de leads imobiliários por IA' };
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) { return <html lang="pt-BR"><body className={geist.variable}>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(serviceSchema)}}/></body></html>; }
