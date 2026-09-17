import { ProductDashboard } from '@/components/product-dashboard';
import { getProductById } from '@/lib/community-products-data';

export const metadata = {
  title: 'Destaque - PrestaCerto',
  description: 'Perfil em destaque',
};

export default function DestaquePage() {
  const product = getProductById('destaque');
  if (!product) return null;

  return (
    <ProductDashboard product={product}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Status do seu destaque</h3>
          <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <p className="text-sm text-indigo-900"><strong>Status:</strong> Ativo até 15 de outubro</p>
            <p className="text-xs text-indigo-700 mt-2">Seu perfil está em destaque nos resultados de busca</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Seu perfil em destaque</h3>
          <div className="p-4 rounded-lg border-2 border-indigo-300 bg-indigo-50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-300"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">Seu nome</h4>
                  <span className="inline-flex px-2 py-1 text-xs font-bold bg-indigo-600 text-white rounded">★ Destaque</span>
                </div>
                <p className="text-sm text-slate-700 mt-1">Sua especialidade</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Impacto do destaque</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-600 font-semibold">Visualizações este mês</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">142</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-600 font-semibold">Propostas recebidas</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">8</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-slate-600 font-semibold">Taxa de conversão</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">5,6%</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-6">
          <h3 className="font-bold text-indigo-900 mb-2">Renovar destaque</h3>
          <p className="text-sm text-indigo-800 mb-4">Seu destaque vence em 15 de outubro. Renove para continuar em destaque.</p>
          <button className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-semibold transition-colors">
            Renovar agora
          </button>
        </div>
      </div>
    </ProductDashboard>
  );
}
