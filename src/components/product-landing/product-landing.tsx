import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LeadForm } from './lead-form';

export type ProductLandingConfig = {
  product: string;
  badge: string;
  headline: string;
  subheadline: string;
  bullets: { value: string; label: string }[];
  features: { icon: string; title: string; desc: string }[];
  plans: { name: string; price: string; desc: string; features: string[]; highlight?: boolean }[];
  ctaTitle: string;
  theme: {
    bg: string;
    badge: string;
    text: string;
    button: string;
    border: string;
    band: string;
  };
};

export function ProductLanding({ config }: { config: ProductLandingConfig }) {
  const { theme } = config;
  const primaryBtn = cn(buttonVariants({ size: 'lg' }), 'h-11 px-5 text-white', theme.button);
  const outlineBtn = cn(
    buttonVariants({ size: 'lg' }),
    'h-11 px-5 border border-gray-300 bg-white text-gray-900 hover:bg-gray-100'
  );

  return (
    <div className={cn('min-h-screen bg-gradient-to-b to-white text-gray-900', theme.bg)}>

      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
        <span className={`inline-block mb-4 rounded-full px-3 py-1 text-xs font-medium ${theme.badge}`}>
          {config.badge}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">{config.headline}</h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{config.subheadline}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <a href="#comecar" className={primaryBtn}>
            Quero começar
          </a>
          <a href="#precos" className={outlineBtn}>
            Ver preços
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {config.bullets.map((b) => (
            <div key={b.label}>
              <p className={`text-3xl font-bold ${theme.text}`}>{b.value}</p>
              <p className="text-gray-600 text-sm">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">O que você consegue fazer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {config.features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-white p-6 text-center">
              <p className="text-3xl mb-2">{f.icon}</p>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="precos" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Preços</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border bg-white p-6 flex flex-col ${plan.highlight ? `border-2 ${theme.border}` : ''}`}
            >
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="text-3xl font-bold mt-2">
                {plan.price}
                <span className="text-sm font-normal text-gray-500">/mês</span>
              </p>
              <p className="text-sm text-gray-600 mt-1 mb-4">{plan.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm">
                    ✓ {f}
                  </li>
                ))}
              </ul>
              <a
                href="#comecar"
                className={plan.highlight ? primaryBtn : outlineBtn}
              >
                Escolher {plan.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="comecar" className={`${theme.band} py-16 sm:py-20 scroll-mt-10`}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center text-white">{config.ctaTitle}</h2>
          <p className="mb-8 text-center text-white/80">Deixe seus dados e ativamos sua conta com você.</p>
          <LeadForm
            product={config.product}
            plans={config.plans.map((p) => `${p.name} — ${p.price}/mês`)}
            accent={theme.button}
          />
        </div>
      </section>
    </div>
  );
}
