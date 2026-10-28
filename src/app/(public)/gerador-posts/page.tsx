import { ProductLanding } from '@/components/product-landing/product-landing';
import { productMetadata } from '@/components/product-landing/metadata';

export const metadata = productMetadata(
  'Gerador de Posts com IA — LinkedIn, Instagram e TikTok',
  'Descreva o tema e receba posts prontos para suas redes, com agenda de publicação.',
  '#9333ea'
);

export default function GeradorPostsPage() {
  return (
    <ProductLanding
      config={{
        product: 'Gerador de Posts',
        badge: 'Feito com IA',
        headline: 'Uma semana de posts em minutos',
        subheadline: 'Descreva seu negócio e o tema. A IA escreve posts para LinkedIn, Instagram e TikTok no seu tom de voz.',
        bullets: [
          { value: '3 redes', label: 'LinkedIn, Instagram, TikTok' },
          { value: 'Seu tom', label: 'aprende como você escreve' },
          { value: 'R$ 29', label: 'a partir de, por mês' },
        ],
        features: [
          { icon: '🤖', title: 'IA de texto', desc: 'Posts, legendas e roteiros curtos' },
          { icon: '📱', title: 'Várias redes', desc: 'Formato certo para cada uma' },
          { icon: '📅', title: 'Calendário', desc: 'Planeje a semana inteira' },
          { icon: '#️⃣', title: 'Hashtags', desc: 'Sugestões por tema' },
          { icon: '🔁', title: 'Variações', desc: 'Várias versões do mesmo post' },
          { icon: '💡', title: 'Ideias', desc: 'Pautas quando faltar assunto' },
        ],
        plans: [
          { name: 'Criador', price: 'R$ 29', desc: '20 posts/mês', features: ['Posts com IA', 'Calendário', '1 marca'] },
          {
            name: 'Profissional',
            price: 'R$ 79',
            desc: '100 posts/mês',
            features: ['Tudo do Criador', 'Tom de voz próprio', '3 marcas'],
            highlight: true,
          },
          { name: 'Agência', price: 'R$ 149', desc: '400 posts/mês', features: ['Tudo do Profissional', '10 marcas', 'Vários usuários'] },
        ],
        ctaTitle: 'Nunca mais fique sem post',
        theme: {
          bg: 'from-purple-50',
          badge: 'bg-purple-100 text-purple-800',
          text: 'text-purple-600',
          button: 'bg-purple-600 hover:bg-purple-700',
          border: 'border-purple-500',
          band: 'bg-purple-700',
        },
      }}
    />
  );
}
