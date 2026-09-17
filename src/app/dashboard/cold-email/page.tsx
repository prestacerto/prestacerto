import { ProductDashboard } from '@/components/product-dashboard';
import { getProductById } from '@/lib/community-products-data';

export const metadata = {
  title: 'Cold Email - PrestaCerto',
  description: 'Prospecção com IA',
};

export default function ColdEmailPage() {
  const product = getProductById('cold-email');
  if (!product) return null;

  return (
    <ProductDashboard product={product}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Criar nova sequência</h3>
          <button className="w-full rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 font-semibold transition-colors">
            + Nova sequência de emails
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Templates de cold email</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">• Apresentação + oferta</p>
            <p className="text-slate-700">• Recomendação de colega</p>
            <p className="text-slate-700">• Resposta a comentário</p>
            <p className="text-slate-700">• Follow-up após primeira</p>
          </div>
        </div>

        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6">
          <h3 className="font-bold text-yellow-900 mb-2">IA para personalização</h3>
          <p className="text-sm text-yellow-800">Use IA para adaptar cada email ao contato específico. Aumenta taxa de resposta em até 40%.</p>
        </div>
      </div>
    </ProductDashboard>
  );
}
