import { ProductLanding } from '@/components/product-landing/product-landing';
import { productMetadata } from '@/components/product-landing/metadata';

export const metadata = productMetadata(
  'Email Marketing simples para PMEs',
  'Crie, envie e acompanhe campanhas de email sem curva de aprendizado.',
  '#2563eb'
);

export default function EmailMarketingPage() {
  return (
    <ProductLanding
      config={{
        product: 'Email Marketing',
        badge: 'Simples, em português, preço em real',
        headline: 'Email marketing sem complicação',
        subheadline: 'Monte a campanha, escolha a lista, envie. Acompanhe aberturas e cliques num painel só.',
        bullets: [
          { value: 'Modelos', label: 'prontos para editar' },
          { value: 'Automação', label: 'boas-vindas e follow-up' },
          { value: 'R$ 79', label: 'a partir de, por mês' },
        ],
        features: [
          { icon: '✏️', title: 'Editor', desc: 'Monte emails sem código' },
          { icon: '📨', title: 'Listas', desc: 'Organize e importe contatos' },
          { icon: '🎯', title: 'Segmentação', desc: 'Envie só pra quem importa' },
          { icon: '📊', title: 'Relatórios', desc: 'Aberturas e cliques' },
          { icon: '⏰', title: 'Agendamento', desc: 'Envie no melhor horário' },
          { icon: '🔁', title: 'Sequências', desc: 'Boas-vindas e follow-ups automáticos' },
        ],
        plans: [
          { name: 'Starter', price: 'R$ 79', desc: 'Até 2.000 contatos', features: ['Editor', 'Listas', 'Relatórios'] },
          {
            name: 'Pro',
            price: 'R$ 199',
            desc: 'Até 15.000 contatos',
            features: ['Tudo do Starter', 'Segmentação', 'Sequências automáticas'],
            highlight: true,
          },
          { name: 'Business', price: 'R$ 499', desc: 'Até 60.000 contatos', features: ['Tudo do Pro', 'Domínio próprio', 'Suporte prioritário'] },
        ],
        ctaTitle: 'Comece a enviar esta semana',
        theme: {
          bg: 'from-blue-50',
          badge: 'bg-blue-100 text-blue-800',
          text: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          border: 'border-blue-500',
          band: 'bg-blue-700',
        },
      }}
    />
  );
}
