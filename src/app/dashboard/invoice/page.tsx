import { ProductDashboard } from '@/components/product-dashboard';
import { getProductById } from '@/lib/community-products-data';

export const metadata = {
  title: 'Invoice - PrestaCerto',
  description: 'Gerador de notas fiscais',
};

export default function InvoicePage() {
  const product = getProductById('invoice');
  if (!product) return null;

  return (
    <ProductDashboard product={product}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Emitir nota fiscal</h3>
          <button className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold transition-colors">
            + Emitir NF-e
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Histórico de notas</h3>
          <p className="text-sm text-slate-600">Suas notas fiscais emitidas aparecerão aqui</p>
        </div>

        <div className="rounded-lg bg-green-50 border border-green-200 p-6">
          <h3 className="font-bold text-green-900 mb-2">Integração com propostas</h3>
          <p className="text-sm text-green-800">Emita NF diretamente de uma proposta aprovada no PrestaCerto</p>
        </div>
      </div>
    </ProductDashboard>
  );
}
