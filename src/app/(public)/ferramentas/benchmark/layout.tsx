import { getPageMetadata } from '@/lib/seo/metadata';
export const metadata = { ...getPageMetadata('Comparador de preços freelancer', 'Consulte as referências disponíveis para sua especialidade e região e compare com seu preço informado.', '/ferramentas/benchmark'), robots: { index: false, follow: true } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
