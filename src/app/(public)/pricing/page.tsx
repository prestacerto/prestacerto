import { createServiceClient } from '@/lib/supabase/service';
import { PricingPlans } from '@/components/sales-agent/pricing-plans';
import { getAuthenticatedUser } from '@/lib/auth';

export const metadata = {
  title: 'Planos de Preço - Agente de Vendas SDR',
  description: 'Escolha o plano ideal para sua equipe de vendas B2B',
};

export default async function PricingPage() {
  const user = await getAuthenticatedUser();
  const userId = user?.id || 'anonymous';

  const supabase = createServiceClient();

  // Fetch pricing plans from database
  const { data: plans } = await supabase
    .from('stripe_plans')
    .select('*')
    .order('base_price', { ascending: true });

  // If no plans in database, use default plans
  const defaultPlans = [
    {
      id: 'price_starter',
      name: 'Starter',
      description: 'Perfeito para pequenas equipes',
      price: 29900, // R$ 299/mês
      currency: 'BRL',
      type: 'seat' as const,
      billingInterval: 'month',
      features: [
        'Até 3 assentos',
        'Prospecção com IA',
        'Até 10 prospects/dia por assento',
        'Email e WhatsApp',
        'Análise básica',
      ],
      highlighted: false,
    },
    {
      id: 'price_professional',
      name: 'Professional',
      description: 'Para equipes em crescimento',
      price: 69900, // R$ 699/mês
      currency: 'BRL',
      type: 'seat' as const,
      billingInterval: 'month',
      features: [
        'Até 10 assentos',
        'Prospecção com IA avançada',
        'Até 30 prospects/dia por assento',
        'Email, WhatsApp e LinkedIn',
        'Análise completa',
        'Integrações com APIs',
        '10% cashback em leads qualificados',
      ],
      highlighted: true,
    },
    {
      id: 'price_enterprise',
      name: 'Enterprise',
      description: 'Para empresas em escala',
      price: 199900, // R$ 1.999/mês
      currency: 'BRL',
      type: 'seat' as const,
      billingInterval: 'month',
      features: [
        'Assentos ilimitados',
        'Prospecção com IA customizada',
        'Prospects ilimitados/dia',
        'Todos os canais + integrações custom',
        'Análise preditiva',
        'Webhook customizado',
        '20% cashback em leads qualificados',
        'Suporte prioritário 24/7',
      ],
      highlighted: false,
    },
  ];

  const displayPlans = (plans && plans.length > 0) ? plans : defaultPlans;

  return (
    <main className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PricingPlans userId={userId} plans={displayPlans} />
      </div>
    </main>
  );
}
