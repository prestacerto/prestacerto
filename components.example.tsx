/**
 * USAGE EXAMPLES - Componentes Reutilizáveis Certo AI
 *
 * Exemplos de como usar cada componente nos 27 produtos
 */

import React from 'react';
import {
  ProductCard,
  SubscriptionButton,
  PricingDisplay,
  AnalyticsChart,
  UserAccessCheck,
  WebhookStatus,
  RevenueMeter,
  ProductBadge,
} from './components';

// ============================================================================
// Example: ProductCard Usage
// ============================================================================

export const ProductCardExample = () => {
  return (
    <ProductCard
      title="Certo AI Pro"
      description="Acelerador de vendas com IA para consultores de autos"
      imageUrl="https://example.com/product.jpg"
      price={299}
      badge={<ProductBadge status="live" size="sm" />}
      onClick={() => console.log('Product clicked')}
    />
  );
};

// ============================================================================
// Example: SubscriptionButton Usage
// ============================================================================

export const SubscriptionButtonExample = () => {
  const handleSubscribe = async () => {
    try {
      // Call Assinify API
      const response = await fetch('/api/assinify/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan: 'pro', product: 'certo-ai' }),
      });
      const data = await response.json();
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <SubscriptionButton
        text="Assinar Plano Pro"
        plan="Pro"
        price="R$ 299/mês"
        onClick={handleSubscribe}
        variant="primary"
        size="lg"
      />

      <SubscriptionButton
        text="Plano Free"
        variant="outline"
        disabled
      />

      <SubscriptionButton
        text="Upgrade"
        isLoading
        variant="secondary"
      />
    </div>
  );
};

// ============================================================================
// Example: PricingDisplay Usage
// ============================================================================

export const PricingDisplayExample = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Simple compact display */}
      <PricingDisplay
        amount={299}
        currency="BRL"
        compact
        size="lg"
      />

      {/* Full display with label and billing period */}
      <PricingDisplay
        amount={2990}
        currency="BRL"
        label="Plano Anual"
        billingPeriod="yearly"
        size="lg"
        showLabel
      />

      {/* USD display */}
      <PricingDisplay
        amount={59}
        currency="USD"
        locale="en-US"
        billingPeriod="monthly"
        showLabel
      />
    </div>
  );
};

// ============================================================================
// Example: AnalyticsChart Usage
// ============================================================================

export const AnalyticsChartExample = () => {
  const chartData = [
    { label: 'Jan', value: 2400 },
    { label: 'Fev', value: 3200 },
    { label: 'Mar', value: 2800 },
    { label: 'Abr', value: 3900 },
    { label: 'Mai', value: 4200 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Bar chart */}
      <AnalyticsChart
        title="Receita Mensal (R$)"
        data={chartData}
        type="bar"
        height={250}
        maxValue={5000}
      />

      {/* With loading state */}
      <AnalyticsChart
        title="Acessos por Dia"
        data={[]}
        isLoading
        height={200}
      />
    </div>
  );
};

// ============================================================================
// Example: UserAccessCheck Usage
// ============================================================================

export const UserAccessCheckExample = () => {
  const [hasAccess, setHasAccess] = React.useState(false);

  // Simulate checking access from API
  React.useEffect(() => {
    const checkAccess = async () => {
      const response = await fetch('/api/user/access', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const { access } = await response.json();
      setHasAccess(access);
    };
    checkAccess();
  }, []);

  return (
    <UserAccessCheck
      hasAccess={hasAccess}
      userId="user-123"
      productId="certo-ai"
      onAccessDenied={() => console.log('Access denied')}
      fallback={
        <div className="bg-blue-50 p-4 rounded">
          <p>Assine um plano para acessar Premium Features</p>
        </div>
      }
    >
      <div className="bg-emerald-50 p-4 rounded">
        <p>Conteúdo exclusivo - Relatórios detalhados, IA avançada, etc</p>
      </div>
    </UserAccessCheck>
  );
};

// ============================================================================
// Example: WebhookStatus Usage
// ============================================================================

export const WebhookStatusExample = () => {
  return (
    <div className="space-y-3">
      {/* Connected webhook */}
      <WebhookStatus
        status="connected"
        webhookUrl="https://api.exemplo.com/webhooks/events"
        lastCheck={new Date()}
        verbose
        size="md"
      />

      {/* Error webhook */}
      <WebhookStatus
        status="error"
        webhookUrl="https://api.webhook.com/events"
        lastCheck={new Date(Date.now() - 3600000)}
        verbose
        size="md"
      />

      {/* Pending webhook */}
      <WebhookStatus
        status="pending"
        size="sm"
      />

      {/* Disconnected (simple) */}
      <WebhookStatus status="disconnected" size="sm" />
    </div>
  );
};

// ============================================================================
// Example: RevenueMeter Usage
// ============================================================================

export const RevenueMeterExample = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* On track */}
      <RevenueMeter
        current={15000}
        target={20000}
        label="MRR Atual"
        currency="R$"
        trend={12}
        size="md"
      />

      {/* Exceeded target */}
      <RevenueMeter
        current={25000}
        target={20000}
        label="MRR Projeto"
        currency="R$"
        trend={8}
        size="md"
      />

      {/* With loading animation */}
      <RevenueMeter
        current={10000}
        target={30000}
        label="ARR 2026"
        currency="R$"
        showPercentage
        animated
        size="lg"
      />
    </div>
  );
};

// ============================================================================
// Example: ProductBadge Usage
// ============================================================================

export const ProductBadgeExample = () => {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      {/* Default sizes */}
      <ProductBadge status="live" size="sm" />
      <ProductBadge status="live" size="md" />
      <ProductBadge status="live" size="lg" />

      {/* Different statuses */}
      <ProductBadge status="building" text="Em Beta" />
      <ProductBadge status="planned" text="Roadmap" />
      <ProductBadge status="beta" />
      <ProductBadge status="deprecated" />

      {/* Custom text */}
      <ProductBadge status="live" text="Ao Vivo • 500+ usuários" size="md" />

      {/* Without icon */}
      <ProductBadge status="live" showIcon={false} />
    </div>
  );
};

// ============================================================================
// COMPLETE PAGE EXAMPLE - Product Showcase
// ============================================================================

export const CompleteProductPageExample = () => {
  const [isSubscribing, setIsSubscribing] = React.useState(false);
  const [userHasAccess, setUserHasAccess] = React.useState(true);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      // Integration com Assinify
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUserHasAccess(true);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <main className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="text-center mb-12">
          <ProductBadge status="live" text="Novo" size="md" className="mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Certo AI - Seu Acelerador de Vendas
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            IA treinada para consultores de autos venderem mais em menos tempo
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <PricingDisplay
              amount={299}
              label="Plano Pro"
              billingPeriod="monthly"
              size="lg"
              showLabel
            />
          </div>

          {/* CTA */}
          <SubscriptionButton
            text="Assinar Agora"
            plan="Pro"
            onClick={handleSubscribe}
            isLoading={isSubscribing}
            size="lg"
          />
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ProductCard
            title="Gestão de Leads"
            description="IA que qualifica e prioriza seus leads automaticamente"
            price={0}
            badge={<ProductBadge status="live" size="sm" />}
          />
          <ProductCard
            title="Email Assistant"
            description="Gere emails personalizados em segundos com IA"
            price={0}
            badge={<ProductBadge status="building" size="sm" />}
          />
          <ProductCard
            title="Analytics Pro"
            description="Dashboards inteligentes com previsões de vendas"
            price={0}
            badge={<ProductBadge status="planned" size="sm" />}
          />
        </section>

        {/* Access Control Example */}
        <UserAccessCheck
          hasAccess={userHasAccess}
          userId="user-123"
          productId="certo-ai"
        >
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Seus Dados
            </h2>

            {/* Revenue Meter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <RevenueMeter
                current={8500}
                target={10000}
                label="MRR Atual"
                trend={15}
                size="lg"
              />
              <RevenueMeter
                current={125000}
                target={100000}
                label="ARR Projetado"
                trend={22}
                size="lg"
              />
            </div>

            {/* Analytics Chart */}
            <AnalyticsChart
              title="Performance Últimos 5 Meses"
              data={[
                { label: 'Jan', value: 2100 },
                { label: 'Fev', value: 3200 },
                { label: 'Mar', value: 4100 },
                { label: 'Abr', value: 4800 },
                { label: 'Mai', value: 5200 },
              ]}
              type="bar"
              maxValue={6000}
            />
          </section>

          {/* Webhook Status */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Integrações
            </h2>
            <WebhookStatus
              status="connected"
              webhookUrl="https://api.certo.ai/webhooks"
              lastCheck={new Date()}
              verbose
              size="md"
            />
          </section>
        </UserAccessCheck>
      </div>
    </main>
  );
};

// ============================================================================
// Export all examples
// ============================================================================

export const AllExamples = () => (
  <div className="space-y-12 p-8 bg-slate-50 dark:bg-slate-950">
    <section>
      <h2 className="text-2xl font-bold mb-4">ProductCard</h2>
      <ProductCardExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">SubscriptionButton</h2>
      <SubscriptionButtonExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">PricingDisplay</h2>
      <PricingDisplayExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">AnalyticsChart</h2>
      <AnalyticsChartExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">UserAccessCheck</h2>
      <UserAccessCheckExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">WebhookStatus</h2>
      <WebhookStatusExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">RevenueMeter</h2>
      <RevenueMeterExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">ProductBadge</h2>
      <ProductBadgeExample />
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-4">Complete Page Example</h2>
      <CompleteProductPageExample />
    </section>
  </div>
);
