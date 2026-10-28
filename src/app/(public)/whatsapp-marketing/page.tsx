import { ProductLanding } from '@/components/product-landing/product-landing';
import { productMetadata } from '@/components/product-landing/metadata';

export const metadata = productMetadata(
  'WhatsApp Marketing — Automação de mensagens para PMEs',
  'Envie campanhas, agende mensagens e responda clientes no WhatsApp sem digitar uma por uma.',
  '#16a34a'
);

export default function WhatsAppMarketingPage() {
  return (
    <ProductLanding
      config={{
        product: 'WhatsApp Marketing',
        badge: 'Automação de WhatsApp para PMEs',
        headline: 'Pare de mandar mensagem uma por uma',
        subheadline:
          'Campanhas, agendamento, templates com o nome do cliente e respostas automáticas. Tudo no WhatsApp que seu cliente já usa.',
        bullets: [
          { value: 'Templates', label: 'com {{nome}} e {{empresa}}' },
          { value: 'Agendamento', label: 'mande na hora certa' },
          { value: 'R$ 299', label: 'a partir de, por mês' },
        ],
        features: [
          { icon: '📤', title: 'Campanhas', desc: 'Dispare para sua lista de clientes' },
          { icon: '📅', title: 'Agendamento', desc: 'Programe envios para depois' },
          { icon: '🎯', title: 'Templates', desc: 'Modelos prontos e personalizáveis' },
          { icon: '📊', title: 'Histórico', desc: 'Veja o que foi enviado e para quem' },
          { icon: '🤖', title: 'Resposta automática', desc: 'IA responde dúvidas comuns' },
          { icon: '🔗', title: 'Integração', desc: 'Conecta com o Agente de Vendas' },
        ],
        plans: [
          { name: 'Starter', price: 'R$ 299', desc: 'Até 500 contatos', features: ['Campanhas', 'Templates', 'Histórico'] },
          {
            name: 'Growth',
            price: 'R$ 699',
            desc: 'Até 5.000 contatos',
            features: ['Tudo do Starter', 'Agendamento', 'Resposta automática com IA'],
            highlight: true,
          },
          { name: 'Pro', price: 'R$ 1.499', desc: 'Contatos ilimitados', features: ['Tudo do Growth', 'Vários números', 'Suporte prioritário'] },
        ],
        ctaTitle: 'Comece a automatizar seu WhatsApp',
        theme: {
          bg: 'from-green-50',
          badge: 'bg-green-100 text-green-800',
          text: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700',
          border: 'border-green-500',
          band: 'bg-green-700',
        },
      }}
    />
  );
}
