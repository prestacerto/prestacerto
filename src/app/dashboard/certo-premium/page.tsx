import { ProductDashboard } from '@/components/product-dashboard';
import { getProductById } from '@/lib/community-products-data';
import Link from 'next/link';

export const metadata = {
  title: 'Certo Premium - PrestaCerto',
  description: 'Suite completa all-in-one',
};

export default function CertoPremiumPage() {
  const product = getProductById('certo-premium');
  if (!product) return null;

  const includedProducts = [
    { name: 'Tax', slug: 'tax', price: 49.90 },
    { name: 'Invoice', slug: 'invoice', price: 19.90 },
    { name: 'Templates', slug: 'templates', price: 29.90 },
    { name: 'Cold Email', slug: 'cold-email', price: 79.90 },
  ];

  return (
    <ProductDashboard product={product}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Produtos inclusos</h3>
          <div className="space-y-3 mb-6">
            {includedProducts.map((prod) => (
              <Link
                key={prod.slug}
                href={`/dashboard/${prod.slug}`}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-pink-300 hover:bg-pink-50 transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">{prod.name}</h4>
                  <p className="text-xs text-slate-600">Acessar dashboard</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-700">~R$ {prod.price.toLocaleString('pt-BR')}/mês</p>
                  <p className="text-xs text-pink-600 font-semibold">→</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="rounded-lg bg-pink-50 border border-pink-200 p-4">
            <p className="text-sm text-pink-900">
              <strong>Economia:</strong> Você economiza ~R$ 87.70/mês vs. assinar separadamente
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Benefícios Premium</h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-slate-700"><strong>Limite de uso ampliado</strong> em todos os produtos</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-slate-700"><strong>Suporte prioritário 24h</strong> por chat e email</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-slate-700"><strong>API access</strong> para integrações customizadas</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-slate-700"><strong>Destaque automático</strong> no seu perfil</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="text-pink-600 font-bold">✓</span>
              <span className="text-slate-700"><strong>Consulta trimestral</strong> com especialista em impostos</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Uso este mês</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700">Notas fiscais (Invoice)</span>
                <span className="text-slate-900 font-semibold">5 de 500</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '1%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700">Sequências email (Cold Email)</span>
                <span className="text-slate-900 font-semibold">128 de 5000</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '2.5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-700">Templates usados</span>
                <span className="text-slate-900 font-semibold">12 de 80</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-pink-50 border border-pink-200 p-6">
          <h3 className="font-bold text-pink-900 mb-2">Próxima consulta</h3>
          <p className="text-sm text-pink-800 mb-4">Sua próxima consulta com especialista em impostos está agendada para 15 de dezembro.</p>
          <button className="rounded-lg bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 font-semibold transition-colors">
            Agendar nova consulta
          </button>
        </div>
      </div>
    </ProductDashboard>
  );
}
