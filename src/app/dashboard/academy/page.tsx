import { ProductDashboard } from '@/components/product-dashboard';
import { getProductById } from '@/lib/community-products-data';

export const metadata = {
  title: 'Academy - PrestaCerto',
  description: 'Cursos online para freelancers e empresas',
};

export default function AcademyPage() {
  const product = getProductById('academy');
  if (!product) return null;

  return (
    <ProductDashboard product={product}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-4">Cursos disponíveis</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <h4 className="font-semibold text-slate-900">Como escrever propostas que vendem</h4>
              <p className="text-sm text-slate-600 mt-1">Aprenda as melhores práticas para propostas vencedoras</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <h4 className="font-semibold text-slate-900">Negociação com clientes</h4>
              <p className="text-sm text-slate-600 mt-1">Técnicas para negociar melhor e fechar mais negócios</p>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <h4 className="font-semibold text-slate-900">Gestão financeira para freelancers</h4>
              <p className="text-sm text-slate-600 mt-1">Como organizar suas finanças e crescer com segurança</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 border border-purple-200 p-6">
          <h3 className="font-bold text-purple-900 mb-2">Próximos cursos</h3>
          <p className="text-sm text-purple-800">Confira em breve: Lei Geral de Proteção de Dados (LGPD) para freelancers, Operações para crescer, e muito mais.</p>
        </div>
      </div>
    </ProductDashboard>
  );
}
