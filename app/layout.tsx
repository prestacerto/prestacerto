import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://caduai.com.br'),
  title: 'IA para imobiliárias e atendimento no WhatsApp | Cadu AI',
  description: 'Inteligência de receita para imobiliárias. Mais visitas que acontecem.',
  openGraph: { title: 'Inteligência de receita para imobiliárias | Cadu AI', description: 'Mais visitas que acontecem.', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Cadu.AI — Mais visitas que acontecem.' }] },
  twitter: { card: 'summary_large_image', title: 'Inteligência de receita para imobiliárias | Cadu AI', description: 'Mais visitas que acontecem.', images: ['/og.png'] },
};
export default function RootLayout({children}: Readonly<{children:React.ReactNode}>) { return <html lang="pt-BR"><body className={geist.variable}>{children}</body></html>; }
