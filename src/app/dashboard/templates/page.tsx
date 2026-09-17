import { ProductDashboard } from '@/components/product-dashboard';
import { getProductById } from '@/lib/community-products-data';

export const metadata = {
  title: 'Templates - PrestaCerto',
  description: 'Biblioteca de templates profissionais',
};

export default function TemplatesPage() {
  const product = getProductById('templates');
  if (!product) return null;

  return (
    <ProductDashboard product={product}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Templates populares</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {['Proposta de projeto', 'Contrato freelancer', 'CV profissional', 'Recibo de pagamento', 'Orçamento', 'Relatório de conclusão'].map((template) => (
              <div key={template} className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer">
                <h4 className="font-semibold text-slate-900">{template}</h4>
                <p className="text-xs text-slate-600 mt-1">Pronto para usar</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-6">
          <h3 className="font-bold text-blue-900 mb-2">Novos templates</h3>
          <p className="text-sm text-blue-800">A cada mês novos templates são adicionados. Fique atualizado com as melhores práticas.</p>
        </div>
      </div>
    </ProductDashboard>
  );
}
